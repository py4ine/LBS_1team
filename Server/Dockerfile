# Node.js 20을 사용하여 백엔드 서버 빌드
FROM node:22-alpine

# 작업 디렉터리 설정
WORKDIR /app

# package.json 및 package-lock.json 복사
COPY package*.json ./

# Node.js 의존성 설치 (간단하게 여러 패키지 설치)
RUN npm install

COPY . .

EXPOSE 8080
 
CMD ["npm", "start"]