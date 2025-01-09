
import login from './login/loginIndex.js'
import details from './details/detailsIndex.js'
import waters from './waters/waterIndex.js'
import danger from './danger/dangerIndex.js'
import cases from './cases/casesIndex.js'
import around from './around/aroundIndex.js'

const mountRouters = (app) => {
    app.use('/login', login);
    app.use('/details', details);
    app.use('/waters', waters)
    app.use('/danger', danger)
    app.use('/cases', cases)
    app.use('/around', around)
}

import login from "./login/loginIndex.js";
import details from "./details/detailsIndex.js";
import waters from "./waters/waterIndex.js";
import incidents from "./incidents/incidentsIndex.js";
import cases from "./cases/casesIndex.js";

const mountRouters = (app) => {
  app.use("/login", login);
  app.use("/details", details); // 건물상세
  app.use("/waters", waters); // 소방용수
  app.use("/incidents", incidents); // 유해시설
  app.use("/cases", cases); // 사건
};


export default mountRouters;
