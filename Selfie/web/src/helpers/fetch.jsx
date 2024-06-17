const baseUrl = process.env.REACT_APP_API_URL;

export const fetchNoToken = (endpoint, data, method = "GET") => {
    const url = `${baseUrl}/${endpoint}`;

    if (method === "GET") {
        return fetch(url);
    } else {
        return fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
    }
};

export const fetchWithToken = (endpoint, data, method = 'GET') => {
    const url = `${baseUrl}/${endpoint}`;
    const token = localStorage.getItem('token');

    return fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'x-token': token
        },
        body: JSON.stringify(data)
    });
};
