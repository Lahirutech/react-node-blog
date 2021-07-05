export default {
    createBlog: blog => {
        return fetch('blog/create', {
            method: "post",
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