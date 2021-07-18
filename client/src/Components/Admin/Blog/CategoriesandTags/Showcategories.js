import React from 'react'
import { Link } from 'react-router-dom';

const Showcategories = ({ categories }) => {
console.log("blog inside categories",categories)
        return categories.map((c, i) => (
            <Link key={i} className="btn btn-primary mr-1 ml-1 mt-3" to={`/categories/${c.slug}`}>
                {c.name}
            </Link>
        ));
   
}
export default Showcategories