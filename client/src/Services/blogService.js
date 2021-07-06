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
    }
}