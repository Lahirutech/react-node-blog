import React, { useState, useEffect } from 'react'
import { withRouter } from "react-router";
import CategoryService from '../../../Services/CategoryService';
import TagService from '../../../Services/tag';
import blogService from '../../../Services/blogService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { keyBy } from 'lodash';
const BlogCrud = ({ router }) => {



    const [body, setBody] = useState(dataFromLS("blog"))

    const [tags, setTags] = useState([])
    const [categories, setCategories] = useState([])


    const [checked, setChecked] = useState([])
    const [checkedTag, setCheckedTag] = useState([]); // tags

    const [values, setValues] = useState({
        error: '',
        sizeError: '',
        success: '',
        formData: new FormData(),
        title: dataFromLS("title"),
        hidePublishButton: false
    })
    const [sampleImage, setSampleImage] = useState("https://dummyimage.com/300x150/6b666b/fff.jpg")

    const { error, sizeError, success, formData, title, hidePublishButton } = values;


    useEffect(() => {
        console.log('use Effect triggerd')
        setValues({ ...values });
        loadTags()
        loadCategories()
    }, [router]);

    const loadCategories = () => {
        CategoryService.getCategories().then(data => {
            console.log("tags", data)
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setCategories(data)
            }
        })
    }
    const loadTags = () => {
        TagService.gettags().then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setTags(data)
            }
        })
    }

    const handleToggle = c => () => {
        setValues({ ...values, error: '' });
        //return the first index or -1
        const clickedCategory = checked.indexOf(c);
        const all = [...checked]

        if (clickedCategory === -1) {
            all.push(c)
        } else {
            all.splice(clickedCategory, 1)
        }
        console.log(all)
        setChecked(all)
        formData.set('categories', all)
    }

    const handleTagsToggle = c => () => {
        setValues({ ...values, error: '' });
        const clickedTag = checkedTag.indexOf(c)
        const all = [...checkedTag];
        if (clickedTag === -1) {
            all.push(c)
        } else {
            all.splice(clickedTag, 1);
        }
        console.log(all);
        setCheckedTag(all)
        formData.set('tags', all);
    }


    const showCategories = () => {
        return (
            categories && categories.map((c, i) => (
                <li key={i} className="list-unstyled">
                    <input onChange={handleToggle(c._id)} type="checkbox" className="mr-2" />
                    <label className="form-check-label">{c.name}</label>
                </li>
            ))

        )
    }

    const showTags = () => {
        return (
            tags &&
            tags.map((t, i) => (
                <li key={i} className="list-unstyled">
                    <input onChange={handleTagsToggle(t._id)} type="checkbox" className="mr-2" />
                    <label className="form-check-label">{t.name}</label>
                </li>
            ))
        );
    }

    function dataFromLS(key) {
        if (typeof window === 'undefined') {
            return false;
        }

        if (localStorage.getItem(key)) {
            return JSON.parse(localStorage.getItem(key));
        } else {
            return false;
        }
    };

    const publishBlog = e => {
        e.preventDefault();
        blogService.createBlog(formData).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setValues({ ...values, title: '', error: '', success: `A new blog titled "${data.title}" is created` });
                setBody('');
                setChecked([])
                setCheckedTag([])
                localStorage.clear();

            }
        })
    };

    const handleChange = name => e => {
        //clear the errors
        setValues({...values,error:"",success:""})
        console.log(e.target.value);
        const value = name === 'photo' ? e.target.files[0] : e.target.value;
        if (name === 'photo') {
            console.log("files", e.target.files)
            let sample = URL.createObjectURL(e.target.files[0])
            console.log(sample)
            setSampleImage(sample)
        }
        formData.set(name, value);
        setValues({ ...values, [name]: value, formData, error: '' });

        if (name == "title") {
            setTitleLocalStorage(e.target.value)
        }

    };

    const setTitleLocalStorage = (val) => {
        localStorage.setItem('title', JSON.stringify(val))
    }

    //when changing the rich text editor
    const handleBody = e => {
        //clear the errors
        setValues({...values,error:"",success:""})

        // console.log(e);
        setBody(e);
        formData.set('body', e);
        if (typeof window !== 'undefined') {
            localStorage.setItem('blog', JSON.stringify(e));

        }
        console.log(formData);
    };


    const createBlogForm = () => {
        return (
            <form onSubmit={publishBlog}>
                <div className="form-group">
                    <label className="text-muted">Title</label>
                    <input type="text" className="form-control" value={title} onChange={handleChange('title')} />
                </div>

                <div className="form-group">
                    <ReactQuill modules={BlogCrud.modules}
                        formats={BlogCrud.formats}
                        value={body}
                        placeholder="Write something amazing..."
                        onChange={handleBody} />
                </div>
                <div>
                    <button type="submit" className="btn btn-primary">
                        Publish
                    </button>
                </div>
            </form>
        )
    }

    const showError = () => {
        return (
            <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
                {error}
            </div>
        )
    }
    const showSuccess = () => {
        return (
            <div className="alert alert-success" style={{ display: success ? '' : 'none' }}>
                {success}
            </div>
        )
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-8">
                    {createBlogForm()}
                    <div className="pt-3">
                        {showError()}
                        {showSuccess()}
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
                            <img id="blah" src={sampleImage} width="300" height="150" alt="your image" />

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











BlogCrud.modules = {
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

BlogCrud.formats = [
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

export default withRouter(BlogCrud)
