const endpoint = process.env.REACT_APP_API_ENDPOINT;
const api = {
    auth:{
        facebook:{
            url: `${endpoint}auth/signup/facebook`,
            method: "POST"
        },
        login:{
            url: `${endpoint}auth/signin`,
            method: "POST"
        },
        registration:{
            url: `${endpoint}auth/signup`,
            method: "POST"
        },

    },
    question:{
        create:{
            url: `${endpoint}questions`,
            method: "POST"
        }
    }
}
export default api;
