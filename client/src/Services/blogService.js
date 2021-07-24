
export default {
    createBlog: blog => {
        console.log("blogservice", blog.get('title'))
        return fetch('/blog/create', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: blog
        })
            .then(response => {
                return response.json();
            })
            .catch(err => console.log(err));
    },
    getBlogsandCategories: (limit, skip) => {
        const data = {
            limit, skip
        }
        return fetch('/blog/blogs-categories-tags', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }, body: JSON.stringify(data)
        })
            .then(response => {
                return response.json();
            })
            .catch(err => console.log(err));

    },
    singleblog: (slug) => {
        console.log("single blog got hit from front head")
        return fetch(`/blog/blog/${slug}`)
            .then(response => {
                return response.json();
            })
            .catch(err => console.log(err))
    },

    listAll: () => {
        return fetch(`/blogs`, {
            method: 'GET'
        })
            .then(response => {
                return response.json();
            })
            .catch(err => console.log(err))
    },
    removeBlog: (slug) => {
        return fetch(`/blog/${slug}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                return response.json();
            })
            .catch(err => console.log(err))

    },
    updateBlog: (blog, slug) => {
        return fetch(`/blog/${slug}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json'
            },
            body: blog
        }).then(response => {
            return response.json();
        })
            .catch(err => console.log(err))
    },

    listSearch: (params) => {

    },

    listRelated: (blog) => {
        console.log("body from the frontend", blog)
        return fetch(`/blog/blog/related`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(blog)
        }).then(response => {
            return response.json();
        })
            .catch(err => console.log(err))
    },

}