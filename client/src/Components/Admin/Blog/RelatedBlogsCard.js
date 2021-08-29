import React from 'react'
import renderHTML from 'react-render-html';
import { Link } from 'react-router-dom';
import moment from 'moment';


export default function RelatedBlogsCard(props) {
    console.log(props.blog.excerpt)
    const blog= props.blog    
    return (
        <div className="card">
            <section>
                <Link to={`/blogs/${blog.slug}`}>
                    <a >
                        <img
                            className="img img-fluid"
                            style={{ maxHeight: 'auto', width: '100%' }}
                            src={`/blog/blog/photo/${blog.slug}`}
                            alt={blog.title}
                        />
                    </a>
                </Link>
            </section>
            <div className="card-body">
                <section>
                    <Link to={`/blogs/${blog.slug}`}>
                        <a>
                            <h5 className="card-title">{blog.title}</h5>
                        </a>
                    </Link>
                   <p className="card-text"> {renderHTML(blog.excerpt)}</p>
                </section>
            </div>
            <div className="card-body">
                Posted {moment(blog.updatedAt).fromNow()} by{' '}
                <Link to={`/`}>
                    <a className="float-right">{blog.postedBy.name}</a>
                </Link>
            </div>
        </div>

    )
}
