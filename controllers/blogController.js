const Blog = require('../models/blog');
const Category = require('../models/Category');
const Tag = require('../models/tag');
const formidable = require('formidable');
const slugify = require('slugify');
const { stripHtml } = require('string-strip-html');
const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandler');
const fs = require('fs');
const { smartTrim } = require('../helpers/excerpttrim');
const blog = require('../models/blog');

exports.create = (req, res) => {
    console.log("blog create backend hit")
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not upload'
            });
        }
        const { title, body, categories, tags } = fields;


        if (!title || !title.length) {
            return res.status(400).json({
                error: 'title is required'
            });
        }
        if (!body || body.length < 200) {
            return res.status(400).json({
                error: 'Content is too short'
            });
        }

        if (!categories || categories.length === 0) {
            return res.status(400).json({
                error: 'At least one category is required'
            });
        }

        if (!tags || tags.length === 0) {
            return res.status(400).json({
                error: 'At least one tag is required'
            });
        }

        let blog = new Blog();
        blog.title = title;
        blog.body = body;
        blog.slug = slugify(title).toLowerCase();
        blog.mtitle = `${title} Appname`;
        blog.mdesc = stripHtml(body).result.substring(0, 160);
        blog.postedBy = req.user._id;
        blog.excerpt = smartTrim(body, 320, ' ', ' ...')

        console.log("blog.mdesc", blog.mdesc)
        console.log("blog.excerpt", blog.excerpt)



        let arrayOfCategories = categories && categories.split(',');
        let arrayOfTags = tags && tags.split(',');
        console.log("categories", categories)

        if (files.photo) {
            if (files.photo.size > 50000000) {
                return res.status(400).json({
                    error: 'Image should be less then 5mb in size'
                })
            }
            blog.photo.data = fs.readFileSync(files.photo.path);
            blog.photo.contentType = files.photo.type;
        }
        blog.save((err, result) => {
            if (err) {
                console.log(err)
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }

            Blog.findByIdAndUpdate(result._id, { $push: { categories: arrayOfCategories } }, { new: true }).exec(
                (err, result) => {
                    if (err) {
                        console.log(err)
                        return res.status(400).json({
                            error: errorHandler(err)
                        });
                    } else {
                        Blog.findByIdAndUpdate(result._id, { $push: { tags: arrayOfTags } }, { new: true }).exec(
                            (err, result) => {
                                if (err) {
                                    return res.status(400).json({
                                        error: errorHandler(err)
                                    });
                                } else {
                                    res.json(result);
                                }
                            }
                        );
                    }

                }
            )
        })
    })

}
exports.list = (req, res) => {
    Blog.find({})
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username')
        .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                })
            }
            res.json(data)
        })
}

exports.listAllBlogsCategoriesTags = (req, res) => {
    console.log("list All Blogs Categories Tags got hit")
    //
    let limit = req.body.limit ? parseInt(req.body.limit) : 30;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;
    console.log("skip", skip)
    console.log("limit", limit)

    let blogs;
    let categories;
    let tags

    Blog.find({})
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username')
        .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                })
            }
            blogs = data;
            Category.find({}).exec((err, c) => {
                if (err) {
                    return res.json({
                        error: errorHandler(err)
                    });
                }
                categories = c; // categories
                Tag.find({}).exec((err, t) => {
                    if (err) {
                        return res.json({
                            error: errorHandler(err)
                        });
                    }
                    tags = t;
                    // return all blogs categories tags
                    res.json({ blogs, categories, tags, size: blogs.length });
                });

            })
        })

};

exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOne({ slug })
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username')
        .select('_id title body slug mtitle mdesc categories tags postedBy createdAt updatedAt')
        .exec((err, dara) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data)
        });
};

exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'Blog Deleted successfully'
        });
    })
};

exports.update = (req, res) => {
    //
    const slug = req.params.slug.toLowerCase();

    Blog.findOne({ slug }).exec((err, oldBlog) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        let form = new formidable.IncomingForm();
        form.keepExtensions = true;

        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.status(400).json({
                    error: 'Image could not upload'
                });
            }
            let slugBeforeMerge = oldBlog.slug;
            oldBlog = _.merge(oldBlog, fields);
            oldBlog.slug = slugBeforeMerge;

            const { body, desc, categories, tags } = fields;

            if (body) {
                oldBlog.excerpt = smartTrim(body, 320, ' ', ' ...');
                oldBlog.desc = stripHtml(body.substring(0, 160));
            }

            if (categories) {
                oldBlog.categories = categories.split(',');
            }

            if (tags) {
                oldBlog.tags = tags.split(',');
            }

            if (files.photo) {
                if (files.photo.size > 50000000) {
                    return res.status(400).json({
                        error: 'Image should be less then 1mb in size'
                    });
                }
                blog.photo.data = fs.readFileSync(files.photo.path)
                blog.photo.contentType = files.photo.type
            }

            oldBlog.save((err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                // result.photo = undefined;
                res.json(result);

            })
        })

    })
};

exports.photo = (req, res) => {

    const slug = req.params.slug.toLowerCase();
    Blog.findOne({ slug })
        .select('photo')
        .exec((err, blog) => {
            if (err || !blog) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.set('Content-Type', blog.photo.contentType);
            return res.send(blog.photo.data)
        })
}