import React, { useEffect, useState } from 'react'
import CategoryService from '../../Services/CategoryService';
import BlogCard from '../Admin/Blog/BlogCard'
import { useParams } from 'react-router-dom';


const BlogsbyCategory = () => {
    const { slug } = useParams();
    const [category, setCategory] = useState({ name: "" })
    const [blogs, setBlog] = useState([])


    useEffect(
        () => {
            CategoryService.singleCategory(slug).then(data => {
                console.log(data)
                if (data.error) {
                    console.log(data.error)
                } else {
                    console.log(data)
                    setCategory(data.category)
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
                            <h1 className="display-4 font-weight-bold">{category.name}</h1>
                            {blogs.map((b, i) => (
                                <div>
                                    <BlogCard key={i} blog={b} />
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


export default BlogsbyCategory
