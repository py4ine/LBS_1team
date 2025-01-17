# 빌드
FROM node:22 as build

WORKDIR /app

#  패키지 복사 및 설치
COPY package*.json ./
RUN npm install

# 소스 복시 및 빌드
COPY . .
RUN npm run build

# 프로덕션 스테이지
# FROM nginx:alpine

# SSL 설정을 위한 디렉토리 생성
# RUN mkdir -p /etc/nginx/ssl

# nginx 설정 파일 복사
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드 결과물을 nginx로 복사
# COPY --from=build /app/dist /usr/share/nginx/html

# ssl 포트 노출
# EXPOSE 443

# vite 개발 서버 포트
EXPOSE 5173

# CMD ["nginx", "-g", "daemon off;"]

# 프로덕션 모드로 실행
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]