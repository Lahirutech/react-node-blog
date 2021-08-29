import React, { useState, useEffect, useContext } from 'react'
import CategoryService from '../../../Services/CategoryService';
import TagService from '../../../Services/tag';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import blogService from '../../../Services/blogService'
import { AuthContext } from '../../../Context/AuthContext';
import { Link } from 'react-router-dom';

import moment from 'moment';


const EditdeleteList = () => {
    const [blogs, setBlogs] = useState([]);
    const [message, setMessage] = useState('');
    const { user } = useContext(AuthContext);


    useEffect(() => {
        console.log("useEffect Triggered")
        loadBlogs();
        console.log(user)

    }, [])

    const loadBlogs = () => {
        blogService.listAll().then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                setBlogs(data)
            }
        })
    }
    const showUpdateButton = blog => {
        if (user.role == 'admin') {
            return (
                <Link to={`/blogsupdate/${blog.slug}`} className="ml-2 btn btn-sm btn-warning">
                    Update
                </Link>
            )
        } else {
            return (
           
                    <Link to={`/blogsupdate/${blog.slug}`} className="ml-2 btn btn-sm btn-warning">
                        Update
                    </Link>
                
            )
        }
    }
    const deleteBlog = slug => {
        blogService.removeBlog(slug).then(
            data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    setMessage(data.message)
                    loadBlogs();
                }
            }
        )
    }
    const deleteConfirm = slug => {
        let answer = window.confirm('Are you sure you want to delete your blog?');
        if (answer) {
            deleteBlog(slug);
        }
    }
    const showAllBlogs = () => {
        console.log(blogs)
        return blogs.map((blog, i) => {
            return (
                <div key={i} className="pb-5">
                    <h3>{blog.title}</h3>
                    <p className="mark">
                        Written by {blog.postedBy.name} | Published on {moment(blog.updatedAt).fromNow()}
                    </p>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteConfirm(blog.slug)}>
                        Delete
                    </button>
                    {showUpdateButton(blog)}
                </div>
            )
        })
    }
    return (
        <React.Fragment>
            <div className="row">
                <div className="col-md-12">
                    <p>My Blogs</p>
                    {message && <div className="alert alert-warning">{message}</div>}
                    {showAllBlogs()}
                </div>
            </div>
        </React.Fragment>
    )
}
export default EditdeleteList