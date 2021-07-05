export default {
    create: (tag) => {
        return fetch('/tag/create', {
            method: "post",
            body: JSON.stringify(tag),
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
    gettags: () => {
        return fetch('/tag/list')
            .then(res => {
                if (res.status !== 401)
                    return res.json().then(data => data);
                else
                    return { message: { msgBody: "Unsuccessfull get tags" }, msgError: true };

            })

    },
    singletag: (slug) => {
        return fetch(`/tag/${slug}`).then(res => {
            if (res.status !== 401)
                return res.json().then(data => data);
            else
                return { message: { msgBody: "Unsuccessfull get single tag" }, msgError: true };

        })

    },
    removetag: (slug) => {
        return fetch(`/tag/${slug}`, {
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

    },
}