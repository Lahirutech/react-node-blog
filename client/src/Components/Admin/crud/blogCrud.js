import React, { useState, useEffect } from 'react'
import { withRouter } from "react-router";
import CategoryService from '../../../Services/CategoryService';
import TagService from '../../../Services/tag';
import { createBlog } from '../../../Services/blogService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { keyBy } from 'lodash';
const BlogCrud = ({ router }) => {

    const [body, setBody] = useState(dataFromLS("blog"))

    const [tags, setTags] = useState([])
    const [categories, setCategories] = useState([])

    const [values, setValues] = useState({
        error: '',
        sizeError: '',
        success: '',
        formData: new FormData(),
        title: dataFromLS("title"),
        hidePublishButton: false
    })
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
        console.log('ready to publishBlog');
    };

    const handleChange = name => e => {
        console.log(e.target.value);
        const value = name === 'photo' ? e.target.files[0] : e.target.value;
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
        // console.log(e);
        setBody(e);
        formData.set('body', e);
        if (typeof window !== 'undefined') {
            localStorage.setItem('blog', JSON.stringify(e));

        }
        console.log(formData);
    };


    const showcategories = () => {
        return (
            categories && categories.map((c, i) => (
                <li key={i} className="list-unstyled">
                    <input onChange={handleToggle(c._id)} type="checkbox" className="mr-2" />
                    <label className="form-check-label">{c.name}</label>
                </li>
            ))

        )
    }


    const showtags = () => {
        return (
            <div>
                <p>Show Tags</p>
            </div>
        )
    }

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




    return (
        <div>{createBlogForm()}

            {showcategories()}

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
