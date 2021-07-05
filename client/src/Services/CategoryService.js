export default {
    create: (category) => {
        return fetch('/category/create', {
            method: "post",
            body: JSON.stringify(category),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status !== 401)
                return res.json().then(data => data);
            else
                return { message: { msgBody: "Unsuccessfull" }, msgError: true };

        })

    },
    getCategories: () => {
        return fetch('/category/list')
            .then(res => {
                if (res.status !== 401)
                    return res.json().then(data => data);
                else
                    return { message: { msgBody: "Unsuccessfull get categories" }, msgError: true };

            })

    },
    singleCategory: (slug) => {
        return fetch(`/category/${slug}`).then(res => {
            if (res.status !== 401)
                return res.json().then(data => data);
            else
                return { message: { msgBody: "Unsuccessfull get single category" }, msgError: true };

        })

    },
    removeCategory: (slug) => {
        return fetch(`/category/${slug}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status !== 401)
                return res.json().then(data => data);
            else
                return { message: { msgBody: "Unsuccessfull" }, msgError: true };

        })

    }
}