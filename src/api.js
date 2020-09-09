const endpoint = process.env.REACT_APP_API_ENDPOINT;
const api = {
    auth:{
        facebook:{
            url: `${endpoint}auth/signup/facebook`,
            method: "POST"
        },
        login:{
            url: `${endpoint}search/categories`,
            method: "GET"
        },
        registration:{
            url: `${endpoint}search/categories`,
            method: "GET"
        },
    },
}
export default api;
