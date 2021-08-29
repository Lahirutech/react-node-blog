import React, { useState, useEffect } from 'react'
import { withRouter } from "react-router";
import CategoryService from '../../../Services/CategoryService';
import TagService from '../../../Services/tag';
import blogService from '../../../Services/blogService';
import ReactQuill from 'react-quill';
import { useParams } from 'react-router-dom';

import 'react-quill/dist/quill.snow.css';



const BlogUpdate = ({ router }) => {

    const { slug } = useParams();

    const [body, setBody] = useState('')
    const [values, setValues] = useState({
        title: '',
        error: '',
        success: '',
        formData: new FormData(),
        title: '',
        body: ''
    })
    const [sampleImage, setSampleImage] = useState("https://dummyimage.com/300x150/6b666b/fff.jpg")

    const { error, success, formData, title } = values;

    useEffect(() => {
        setValues({ ...values })
        initBlog()
    }, [router])

    const initBlog = () => {
        if (slug) {
            blogService.singleblog(slug).then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    setValues({ ...values, title: data.title });
                    setBody(data.body);
                }
            });
        }
    }

    const handleChange = name => e => {
        const value = name === 'photo' ? e.target.files[0] : e.target.value
        formData.set(name, value)
        setValues({ ...values, [name]: value, formData, error: '' });
    }

    const handleBody = e => {
        setBody(e);
        formData.set('body', e);
    };


    const editBlog = () => {
        console.log('update blog')
    }

    const updateBlogForm = () => {
        return (
            <form onSubmit={editBlog}>
                <div className="form-group">
                    <label className="text-muted">Title</label>
                    <input type="text" className="form-control" value={title} onChange={handleChange('title')} />
                </div>

                <div className="form-group">
                    <ReactQuill modules={BlogUpdate.modules}
                        formats={BlogUpdate.formats}
                        value={body}
                        placeholder="Write something amazing..."
                        onChange={handleBody} />
                </div>
                <div>
                    <button type="submit" className="btn btn-primary">
                        Update
                    </button>
                </div>
            </form>
        )
    }

    return (
        <div className="container-fluid pb-5">
            <div className="row">
                <div className="col-md-8">
                    {updateBlogForm()}
                    <div className="pt-3">
                        <p>show success and error msg</p>
                    </div>
                </div>

                <div className="col-md-4">
                    <div>
                        <div className="form-group pb-2">
                            <h5> Featured Image</h5>
                            <hr />
                            <small className="text-muted">Max size: 1mb</small>
                            <div>
                                <label className="btn btn-outline-info">
                                    Upload featured image
                                    <input onChange={handleChange('photo')} type="file" accept="image/*" hidden />
                                </label>
                            </div>
                            <img className="img img-fluid"
                                style={{ maxHeight: '150px', width: 'auto' }}
                                src={`/blog/blog/photo/${slug}`}
                                alt={title} />

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



BlogUpdate.modules = {
    toolbar: [
        [{ header: '1' }, { header: '2' }, { header: [3, 4, 5, 6] }, { font: [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image', 'video'],
        ['clean'],
        ['code-block']
    ]
};

BlogUpdate.formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'link',
    'image',
    'video',
    'code-block'
];


export default withRouter(BlogUpdate)