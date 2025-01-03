import login from './login/loginIndex.js'

const mountRouters = (app) => {
    app.use('/login', login);
}

export default mountRouters;