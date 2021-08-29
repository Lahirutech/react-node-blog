import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import blogService from '../../../Services/blogService';
import BlogCard from "./BlogCard"


const Displayblogs = () => {


    const [limit, setLimit] = useState(1);
    const [skip, setSkip] = useState(0);
    const [size, setSize] = useState();
    const [initialBlogs, setInItialBlogs] = useState()
    const [loadedBlogs, setLoadedBlogs] = useState([]);


    useEffect(() => {
        console.log("useEffect triggered")
        console.log("limit", limit)
        blogService.getBlogsandCategories(limit, skip).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                console.log("data returned", data)
                setInItialBlogs(data)
                setSize(data.size)
            }
        })

    }, [])

    const showAllBlogs = () => {
        console.log("showall blogs", initialBlogs)
        if (initialBlogs) {
            const blogs = initialBlogs.blogs
            return blogs.map((blog, i) => {
                console.log("one blog at a time", blog)

                return (
                    <article key={i}>
                        <BlogCard blog={blog} />
                        <hr />
                    </article>
                )
            })
        }

    }

    const showBAllCategories = () => {
        if (initialBlogs) {
            return initialBlogs.categories.map((c, i) => (
                <Link className="btn btn-primary mr-1 ml-1 mt-3" key={i} to={`/categories/${c.slug}`}>
                    {c.name}
                </Link>
            ));
        }
    }


    const showAllTags = () => {
        if (initialBlogs) {
            return initialBlogs.tags.map((t, i) =>
            (
                <Link className="btn btn-outline-primary mr-1 ml-1 mt-3" key={i} to={`/tags/${t.slug}`}>
                    {t.name}
                </Link>
            )
            );
        }
    }

    const loadMore = () => {
        console.log("loadmore button clicked")
        let toSkip = skip + limit;
        blogService.getBlogsandCategories(toSkip, limit).then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                setLoadedBlogs([...loadedBlogs, ...data.blogs]);
                setSize(data.size);
                setSkip(toSkip);
            }
        })
    }


    const loadMoreButton = () => {
        return (
            size > 0 &&
            size >= limit && (
                <button onClick={loadMore} className="btn btn-outline-primary btn-lg">
                    Load mmore
                </button>
            )
        )
    }

    const showLoadedBlogs = () => {
        return loadedBlogs.map((blog, i) => (
            <article key={i}>
                <BlogCard blog={blog} />
            </article>
        ));
    };

    return (
        <div>
            <div className="container-fluid">
                <header>
                    <div className="col-md-12 pt-3">
                        <h1 className="display-4 font-weight-bold text-center">Programming blogs and tutorials</h1>
                    </div>
                    <section>
                        <p>{showAllTags()}{showBAllCategories()}</p>
                        <p></p>
                    </section>
                </header>
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">{showAllBlogs()}</div>
                    <div className="container-fluid">{showLoadedBlogs()}</div>
                    <div className="text-center pt-5 pb-5">{loadMoreButton()}</div>
                </div>
            </div>

        </div>
    )
}

Displayblogs.getInitialProps = async () => {


}
export default Displayblogs