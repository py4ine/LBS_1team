import login from './login/loginIndex.js'
import details from './details/detailsIndex.js'

const mountRouters = (app) => {
    app.use('/login', login);
    app.use('/details', details);
}

export default mountRouters;