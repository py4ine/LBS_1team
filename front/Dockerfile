# React 빌드
FROM node:22-alpine AS builder

WORKDIR /app

# 패키지 설치
COPY package*.json ./
RUN npm install 

# 환경 변수 파일 복사
COPY .env ./

# 소스 복사 및 빌드
COPY . .
RUN npm run build

# 경량 서버를 사용하여 빌드 결과를 저장
CMD ["npx", "serve", "-s", "dist", "-l", "5173"]

EXPOSE 5173


