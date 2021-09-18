import React, { useState, useEffect } from 'react'
import BlogCard from '../Admin/Blog/BlogCard'
import { useParams } from 'react-router-dom';
import CategoryService from '../../Services/CategoryService';


const BlogsbyTags = () => {
    const { slug } = useParams();
    const [tag, setTag] = useState({ name: "" })
    const [blogs, setBlog] = useState([])

    useEffect(() => {
        CategoryService.singleTag(slug).then(data => {
            console.log("data", data)
            if (data.error) {
                console.log(data.error)

            } else {
                setTag(data.tag)
                setBlog(data.blogs)
            }
        })
    }, [])

    return (
        <React.Fragment>
            <main>
                <div className="container-fluid text-center">
                    <header>
                        <div className="col-md-12 pt-3">
                            <h1 className="display-4 font-weight-bold">{tag.name}</h1>
                            {blogs.map((b, i) => (
                                <div key={i}>
                                    <BlogCard blog={b} />
                                    <hr />
                                </div>
                            ))}
                        </div>

                    </header>
                </div>
            </main>

        </React.Fragment>
    )
}

export default BlogsbyTags