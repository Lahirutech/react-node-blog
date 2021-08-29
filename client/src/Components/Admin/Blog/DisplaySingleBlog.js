import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import blogService from '../../../Services/blogService';
import renderHTML from 'react-render-html';
import ShowTags from './CategoriesandTags/ShowTags'
import Showcategories from './CategoriesandTags/Showcategories'
import moment from 'moment';
import RelatedBlogsCard from './RelatedBlogsCard';

export default function DisplaySingleBlog() {
    const { slug } = useParams();
    const [blog, setBlog] = useState({ _id: null, categories: [], tags: [], slug: [] })
    const [related, setRelated] = useState([])

    useEffect(() => {
        blogService.singleblog(slug).then(data => {
            console.log("Received data from the useEffect", data)
            setBlog(data)
        })
    }, [])

    useEffect(() => {
        blog._id && loadRelated()
    }, [blog]);


    const loadRelated = () => {
        console.log("load related got hit",)
        blogService.listRelated(blog).then(blogdata => {
            console.log(blogdata)
            if (blogdata.error) {
                console.log(blogdata.error)
            } else {
                console.log("loadrelated data received")
                setRelated(blogdata)
            }

        })
    }

    const ShowRelatedBlogs = () => {
        console.log("related", related)
        return related.map((relatedblog, k) => (
            <div className="col-md-4" key={k}>
                <article>
                    <RelatedBlogsCard blog={relatedblog} />
                </article>
            </div>
        ))
    }

    return (
        <React.Fragment>
            <article>
                <div className="container-fluid">
                    <section>
                        <div className="row">
                            <img
                                src={`/blog/blog/photo/${blog.slug}`}
                                alt={blog.title}
                                className="img img-fluid featured-image"
                            />
                        </div>
                    </section>

                    <section>
                        <p className="lead mt-3 mark">
                            Written by {blog.username} | Published {moment(blog.updatedAt).fromNow()}
                        </p>

                        <div className="pb-3">
                            {console.log("blog.categories", blog.categories)}
                            {blog ? <p>Blog is here</p> : <p>Blog is not here</p>}
                            {<Showcategories categories={blog.categories} />}
                            {<ShowTags tags={blog.tags} />}
                            <br />
                            <br />
                        </div>
                    </section>
                </div>
                <h4 className="text-center pt-5 pb-5 h2">Related blogs</h4>
                <div className="container">
                    <section>
                        <div className="col-md-12 lead">{blog.body ? renderHTML(blog.body) : null}</div>

                    </section>
                </div>
                <h4 className="text-center pt-5 pb-5 h2">Related blogs</h4>
                <div className="container row">
                    {blog._id != null ? <ShowRelatedBlogs /> : 'Loading Related Blogs'}
                </div>

                <div className="container pb-5">
                    <p>show comments</p>
                </div>

            </article>
        </React.Fragment>
    )
}
