import login from './login/loginIndex.js'
import details from './details/detailsIndex.js'
import waters from './waters/waterIndex.js'
import incidents from './incidents/incidentsIndex.js'
import cases from './cases/casesIndex.js'

const mountRouters = (app) => {
    app.use('/login', login);
    app.use('/details', details);
    app.use('/waters', waters)
    app.use('/incidents', incidents)
    app.use('/cases', cases)
}

export default mountRouters;