import React, { useState, useEffect } from 'react'
import { withRouter } from "react-router";
import CategoryService from '../../../Services/CategoryService';
import blogService from '../../../Services/blogService';
import categoryService from '../../../Services/CategoryService';
import tagService from '../../../Services/tagService';

import ReactQuill from 'react-quill';
import { useParams, useHistory } from 'react-router-dom';

import 'react-quill/dist/quill.snow.css';



const BlogUpdate = ({ router }) => {

    const { slug } = useParams();
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);

    const [checked, setChecked] = useState([]) //categories
    const [checkedTag, setCheckedTag] = useState([]); // tags

    const [body, setBody] = useState('')
    const [values, setValues] = useState({
        title: '',
        error: '',
        success: '',
        formData: new FormData(),
        title: '',
        body: ''
    })
    let history = useHistory()



    const [sampleImage, setSampleImage] = useState("https://dummyimage.com/300x150/6b666b/fff.jpg")
    const { error, success, formData, title } = values;

    useEffect(() => {
        setValues({ ...values })
        initBlog()
        initCategories();
        initTags();

    }, [router])

    const initCategories = () => {
        categoryService.getCategories().then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                console.log("categories", categories)
                setCategories(data)
            }
        })

    }

    const initTags = () => {
        tagService.gettags().then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setTags(data)
            }
        })
    }


    const handleToggle = (c) => () => {
        setValues({ ...values, error })
        const clickedCategory = checked.indexOf(c)
        const all = [...checked]

        if (clickedCategory === -1) {
            all.push(c)
        } else {
            all.splice(clickedCategory, 1)
        }
        console.log(all);
        setChecked(all);
        formData.set('categories', all);
    }

    const findOutCategory = (c) => {
        const result = checked.indexOf(c)
        if (result != -1) {
            return true
        } else {
            return false
        }


    }

    const handleTagsToggle = (t) => () => {
        setValues({ ...values, error })
        const clickedTag = checkedTag.indexOf(t)
        const all = [...checkedTag]

        if (clickedTag === -1) {
            all.push(t)
        } else {
            all.splice(clickedTag, 1)
        }
        console.log(all);
        setChecked(all);
        formData.set('categories', all);

    }
    const findOutTag = (t) => {
        const result = checkedTag.indexOf(t)
        if (result != -1) {
            return true
        } else {
            return false
        }

    }



    const showCategories = () => {
        return (
            categories && categories.map((c, i) => (
                <li key={i} className="list-unstyled">
                    <input
                        onChange={handleToggle(c._id)}
                        checked={findOutCategory(c._id)}
                        type="checkbox"
                        className="mr-2"
                    />
                    <label className="form-check-label">{c.name}</label>
                </li>

            ))
        )
    }

    const showTags = () => {
        return (
            tags && tags.map((t, i) => (
                <li key={t} className="list-unstyled">
                    <input
                        onChange={handleTagsToggle(t._id)}
                        checked={findOutTag(t._id)}
                        type="checkbox"
                        className="mr-2"
                    />
                    <label className="form-check-label">{t.name}</label>
                </li>
            ))
        )
    }



    const initBlog = () => {
        if (slug) {
            blogService.singleblog(slug).then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    setValues({ ...values, title: data.title });
                    setBody(data.body);
                    setCategoriesArray(data.categories);
                    setTagsArray(data.tags);
                }
            });
        }
    }
    const setCategoriesArray = blogcategories => {
        let ca = []
        blogcategories.map((c, i) => {
            ca.push(c._id);
        })
        setChecked(ca)
    }
    const setTagsArray = blogTags => {
        let ta = []
        blogTags.map((t, i) => {
            ta.push(t._id)
        })
        setCheckedTag(ta);

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


    const editBlog = (e) => {
        console.log('update blog')
        e.preventDefault()
        blogService.updateBlog(formData, slug).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });

            } else {
                setValues({ ...values, title: '', success: `Blog titled "${data.title}" is successfully updated` })
                history.push('/')
            }

        })

    }

    const UpdateBlogForm = () => {
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
    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className="alert alert-success" style={{ display: success ? '' : 'none' }}>
            {success}
        </div>
    );

    return (
        <div className="container-fluid pb-5">
            <div className="row">
                <div className="col-md-8">
                    <UpdateBlogForm/>
                    <div className="pt-3">
                        {showSuccess()}
                        {showError()}
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
                    <div>
                        <h5>Categories</h5>
                        <hr />

                        <ul style={{ maxHeight: '200px', overflowY: 'scroll' }}>{showCategories()}</ul>
                    </div>
                    <div>
                        <h5>Tags</h5>
                        <hr />
                        <ul style={{ maxHeight: '200px', overflowY: 'scroll' }}>{showTags()}</ul>
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