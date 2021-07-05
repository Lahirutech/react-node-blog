import React from 'react'
import { Link } from 'react-router-dom';


export default function Adminindex() {
    return (
        <div className="row">
            <div className="col-3">
                <ul className="list-group">
                    <Link to="/tagsandcategories">
                        <li className="list-group-item">Create Tags and categories</li>
                    </Link>
                    <Link to="/createblog">
                        <li className="list-group-item">Create a Blog</li>
                    </Link>

                </ul>
            </div>
            <div className="col-9">
                One of three columns
            </div>

        </div>
    )
}
