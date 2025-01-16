import express from 'express'
import compression from 'compression'
import cors from 'cors'
import mountRouters from './api/routes.js'


const app = express();

app.use(express.json());
app.use(compression());


// cors 설정
app.use(cors({
    // origin: 'http://localhost:5173',  // 클라이언트 주소
    // methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'],  // 허용 메서드
    // credentials: true,  // 쿠키 전송 허용
}));




mountRouters(app);

// app.get('/', (res, res) => {
//     res.redirect('/login');
// });

export default app;