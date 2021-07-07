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
        console.log(blog.mdesc)


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
    //
};

exports.read = (req, res) => {
    //
};

exports.remove = (req, res) => {
    //
};

exports.update = (req, res) => {
    //
};