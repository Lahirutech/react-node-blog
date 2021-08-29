import React from 'react'
import renderHTML from 'react-render-html';
import moment from 'moment';
import { Link } from 'react-router-dom';


const BlogCard = ({ blog }) => {

    const showBlogCategories = (blog) =>

        blog.categories.map((c, i) => (
            <Link key={i} to={`/categories/${c.slug}`}>
                <p className="btn btn-primary mr-1 ml-1 mt-3">{c.name}</p>
            </Link>
        ));

    const showBlogTags = blog => {
        return blog.tags.map((t, i) => {
            return (
                <Link key={i} to={`/tags/${t.slug}`}>
                    <p className="btn btn-outline-primary mr-1 ml-1 mt-3">{t.name}</p>
                </Link>
            )
        });
    }

    return (
        <div className="lead pb-4">
            <header>
                <Link to={`/blogs/${blog.slug}`}>
                    <h2 className="pt-3 pb-3 font-weight-bold">{blog.title}</h2>
                </Link>
            </header>
            <section>
                <p className="mark ml-1 pt-2 pb-2">
                    Written by {blog.postedBy.username} | Published {moment(blog.updatedAt).fromNow()}
                </p>
            </section>
            <section>
                {showBlogCategories(blog)}
                {showBlogTags(blog)}
                <br />
                <br />
            </section>

            <div className="row">
                <div className="col-md-4">
                    <section>
                        <img
                            className="img img-fluid"
                            style={{ maxHeight: '150px', width: 'auto' }}
                            src={`blog/blog/photo/${blog.slug}`}
                            alt={blog.title}
                        />
                    </section>
                </div>
                <div className="col-md-8">
                    <section>
                        <div className="pb-3">{blog.excerpt ? renderHTML(blog.excerpt) : null}</div>
                        <Link to={`/blogs/${blog.slug}`}>
                            <p className="btn btn-primary pt-2">Read more</p>
                        </Link>
                    </section>
                </div>
            </div>
        </div>
    )
}


export default BlogCard