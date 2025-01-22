import express from "express";
import compression from "compression";
import cors from "cors";
import mountRouters from "./api/routes.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "소방 RG API",
      version: "1.0.0",
      description: "소방 RG Documentation",
    },
    servers: [
      {
        url: "http://localhost:8080",
        description: "Development server",
      },
    ],
  },
  apis: [
    // "./src/api/**/*.js", // api 파일들의 경로
    // 또는 현재 구조에 맞는 경로
    "./src/api/**/*.js", // 모든 API 파일
    "./src/api/*/*.ctrl.js", // 특정 컨트롤러 파일들
    "./src/api/*/*.router.js", // 라우터 파일들, // 또는 현재 구조에 맞는 경로
    // "./api/**/*.js", // 모든 API 파일
    // "./api/details/details.ctrl.js", // details controller
    // "./api/*/detailsIndex.js", // index 파일
  ],
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.json());
app.use(compression());

// cors 설정
app.use(
  cors({
    // origin: 'https://lbsteam1.duckdns.org',  // 클라이언트 주소
    // origin: "http://localhost:8080", // 클라이언트 주소
    // methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // 허용 메서드
    // credentials: true, // 쿠키 전송 허용
  })
);

mountRouters(app);

// app.get('/', (res, res) => {
//     res.redirect('/login');
// });

export default app;
