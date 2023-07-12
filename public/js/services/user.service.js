

const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'

export const userService = {
    login,
    signup,
    logout,
    getLoggedinUser,
    getEmptyCredentials,
    get
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}



function login({ username, password }) {
    return axios.post('/api/auth/login', { username, password })
        .then(res => res.data)
        .then(user => {
            sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
            return user
        })
}

function signup({ username, password, fullname }) {
    return axios.post('/api/auth/signup', { username, password, fullname })
        .then(res => res.data)
        .then(user => {
            sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
            return user
        })
}

function logout() {
    return axios.post('/api/auth/logout')
        .then(() => {
            sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
        })
}

function get(userId) {
	return axios.get('/api/auth/' + userId).then(res => res.data)
}

function getEmptyCredentials() {
    return {
        username: '',
        password: '',
        fullname: ''
    }
}

