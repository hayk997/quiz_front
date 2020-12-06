const endpoint = process.env.REACT_APP_API_ENDPOINT;
const api = {
    auth:{
        facebook:{
            login:{
                url: `${endpoint}auth/signin/facebook`,
                method: "POST"
            },
            reg:{
                url: `${endpoint}auth/signup/facebook`,
                method: "POST"
            }
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
        },
        list:{
            url: `${endpoint}questions`,
            method: "GET"
        },
        single:{
            url: `${endpoint}questions/`,
            method: "GET"
        }
    },
    answers:{
        create:{
            url: `${endpoint}answers/`,
            method: "POST"
        },
        list:{
            url: `${endpoint}answers/`,
            method: "GET"
        },
        single:{
            url: `${endpoint}answers/single/`,
            method: "GET"
        },
        data:{
            url: `${endpoint}answers/data/`,
            method: "GET"
        }
    },
    setup:{
        create:{
            url: `${endpoint}setups/`,
            method: "POST"
        },
        list:{
            url: `${endpoint}answers/`,
            method: "GET"
        },
        single:{
            url: `${endpoint}answers/single/`,
            method: "GET"
        }
    },
    Post:{
        delete: {
            url: `${endpoint}posts/`,
            method: "DELETE"
        },
        react:{
            url: `${endpoint}posts/`,
            method: "POST"
        },
        visibility:{
            url: `${endpoint}posts/visibility/`,
            method: "POST"
        }
    },
    user:{
        list: {
            url: `${endpoint}users/`,
            method: "GET"
        },
        find: {
            url: `${endpoint}users?username=`,
            method: "GET"
        },
        check:{
            url: `${endpoint}usernamecheck`,
            method: "POST"
        },
        post:{
            url: `${endpoint}users/`,
            method: "POST"
        }

    }
}
export default api;
