import React from 'react'
import { Link } from 'react-router-dom';


const ShowTags = ({ tags }) => {
    return tags.map((t, i) => (
        <Link className="btn btn-outline-primary mr-1 ml-1 mt-3" key={i} to={`/tags/${t.slug}`}>
            {t.name}
        </Link>
    ));
}
export default ShowTags