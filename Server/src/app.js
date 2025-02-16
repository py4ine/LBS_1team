import express from "express";
import compression from "compression";
import cors from "cors";
import mountRouters from "./api/routes.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();
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


// Swagger 설정 정의
const options = {
  definition: {
    openapi: "3.0.0",  // openAPI 버전 정의
    // API 문서의 기본 정보 정의
    info: {  
      title: "소방 RG API",
      version: "1.0.0",
      description: "소방 RG 명세서",
    },
    // 사용할 서버 목록 정의
    servers: [
      {
        url: "https://lbsteam1.duckdns.org",
        description: "소방RG",
      },
    ],
  },
  // Swagger가 API 문서를 작성할 때 참고할 주석이 있는 파일 경로
  apis: [
    "./api/**/*.js",  // api 하위 모든 폴더의 .js 파일들
    "./api/*/*.ctrl.js",  // api 하위 한단계 폴더의 컨트롤러 파일들
    "./api/*/*.router.js",  // api 하위 한단계 폴더의 라우터 파일들

    // "./api/**/*.js",  // 모든 API 하위 모든 폴더의 .js 파일들
    // "./api/details/details.ctrl.js",  // details 폴더의 controller 파일
    // "./api/*/detailsIndex.js", // API 한단계 하위 폴더의 디테일index 파일
  ],
};

const specs = swaggerJsdoc(options);  // options를 기반으로 json형식 API명세서 생성
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));  // api-docs 경로에 Swagger 문서를 제공


mountRouters(app);


export default app;