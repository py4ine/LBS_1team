# 소방RG
# 프로젝트 개요
## 1.1 프로젝트 제목
### 소방RG 소방관분들을 위한 데이터 플랫폼
url(https://lbsteam1.duckdns.org/)

## 1.2 프로젝트 로고

<div align="center">
    <img src="/readme/App_Logo_2.png" alt="Logo">
</div>

## 1.3 프로젝트 정보
### 1.3.1 소개
#### 1.3.1.1 배경
- 일평균 100건의 화재사건, 10건의 인명피해
- 건물 내 인원 파악의 어려움 
- 사건 데이터 통합 플랫폼의 부재


#### 1.3.1.2 기획 의도
- **소방관 분들에게 도움을 줄수있는 서비스가 뭐가있을까?** 라는 아이디어를 통해,

   **화재사건 중심의 주변 데이터와 실시간 영상을통한 인원관제 통합 플랫폼** 개발 프로젝트를 기획하였습니다.


#### 1.3.1.3 프로젝트 요약
- 사건 주변의 소방용수, 유해시설, 기상정보, 건물의 상세정보, 실시간 인원 관제 등을 한 플렛폼에 통합하였습니다. 
- AI기술을 통해 실시간 인원 관제 시스템의 정확성을 향상시켰습니다.

### 1.3.2 개발 기간 (총 13주)
⏰ 2024년 12월 16일 ~ 2025년 1월 22일


### 1.3.3 주요 기능
#### 가. 실시간 인원관제
- 실시간 CCTV영상, AI기반 인원관제
#### 나. 사건위치 기반 정보제공
- 소방용수, 유해시설, 기상정보 제공
#### 다. 검색기능 및 주변 건물 정보
- 위치기반 주변 건물 폴리곤 제공, 건물명 기반 검색 제공 



## 1.4 팀 소개
#### 👩‍💻 [김준우] (팀장)
#### 👩‍💻 [김서현] (Frontend)
#### 👩‍💻 [배찬진] (Fullstack)
#### 👩‍💻 [김호준] (Backend)


## 1.5 시연 영상 링크
🎞 1차 시연 영상 [보러가기]().


# 2. 프로젝트 아키텍처

## 2.1 ETE flow chart (End to End)
![ERD](/readme_image/ERD.png)
## 2.2 시스템 구성도
![GCP](/readme/servergcp.png)
![HOME](/readme/serverhome.png)

## 2.3 ERD (Entity Relationship Diagram)
![ERD](/readme/erd.png)

# 4. 기술 스택


<div style="display:flex; flex-direction:column; align-items:flex-start;">

    
### <div align="center"> Package Manager </div>
<div align="center" >
<img src="https://img.shields.io/badge/Node.js-5FA04E?style=for-the-badge&logo=node.js&logoColor=white">
<img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
<img src="https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white">
<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black">
  react native
</div>


### <div align="center"> Cooperation Tools </div>
<div align="center">
<img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white">
<img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white">
<img src="https://img.shields.io/badge/Google Chrome-4285F4?style=for-the-badge&logo=Google Chrome&logoColor=white">
<img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white">
</div>


### <div align="center"> IDE </div>
<div align="center">
<img src="https://img.shields.io/badge/Visual Studio Code-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white">
<img src="https://img.shields.io/badge/Jupyter-F37626?style=for-the-badge&logo=jupyter&logoColor=white">
<img src="https://img.shields.io/badge/Google Colab-F9AB00?style=for-the-badge&logo=Google Colab&logoColor=black">
<img src="https://img.shields.io/badge/Anaconda-44A833?style=for-the-badge&logo=Anaconda&logoColor=white">
</div>


### <div align="center"> Database </div>
<div align="center"> 
  postgresql
  postgis?
  qgis?
</div>

### <div align="center"> Deployment </div>
<div align="center">
  gcp
  라즈베리
<img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=Docker&logoColor=white">
</div>
</div>


# 5. 화면
| **메인화면**  | **회원가입** |
|:------------:|:------------:|
| ![Main Page](./readme_image/main.png) | ![Sign Up](./readme_image/signUp.png) |
| **로그인**    | **마이페이지** |
| ![Login Page](./readme_image/login.png) | ![MyPage](./readme_image/mypage.png) |
| **MAP**        | **가계부** |
| ![MAP](./readme_image/map.png)  | ![Household](./readme_image/household.png) |
| **주식 비교** | **주식 예측** |
| ![Stock Compare](./readme_image/compareStock.png)  | ![Stock Prediction](./readme_image/predicStock.png) |
| **뉴스**     | **통합 채팅방** |
| ![News Page](./readme_image/news.png)  | ![News Talk](./readme_image/newsTalk.png) |
| **FAQ**   | **관리자 화면** |
| ![FAQ](./readme_image/FAQ.png) | ![Adim](./readme_image/admin.png) |
| **챗봇**    | **챗봇 모달** |
| ![Chatbot](./readme_image/chatbot.png) | ![Chatbot modal](./readme_image/Chatbot-modal.png)|



# 6. 데이터
- 데이터는 소방청 국토부 행안부 등 공공데이터를 최대한 활용 했습니다.

이미지


## 📑기획 및 설계

[프로젝트 기획서 (1)](https://www.notion.so/1-15fe53d1ead580fab8dbfd58365157d6?pvs=21)

[ 피그마](https://www.notion.so/15fe53d1ead58072b8eac135a5885668?pvs=21)

[ERD](https://www.notion.so/ERD-15fe53d1ead58066a508c7b4b22a065e?pvs=21)

[API 명세서](https://www.notion.so/API-15fe53d1ead580fbad80d353d133fc0b?pvs=21)

## 📄기록

[구로 소방서 인터뷰 - 12월 27일](https://www.notion.so/12-27-168e53d1ead5804fade6c4839acf15e4?pvs=21)


