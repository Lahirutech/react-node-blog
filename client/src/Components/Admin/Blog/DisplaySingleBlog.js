import React from 'react'
import { useParams } from 'react-router-dom';


export default function DisplaySingleBlog() {
    const { slug } = useParams();

    return (

        <div>
            <div>Username: {slug}</div>
        </div>
    )
}
