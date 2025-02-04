# 소방RG

# 프로젝트 개요

## 1.1 프로젝트 ONE PAGE PROPOSAL 및 인터뷰

### 소방RG 소방관분들을 위한 데이터 플랫폼

url(https://lbsteam1.duckdns.org/)

![ERD](/readme/onepage.png)

### 소방관분들 인터뷰 피드백

![ppt5](https://github.com/py4ine/LBS_1team/blob/main/readme/%EB%B0%9C%ED%91%9CPPT%EC%9D%98%20%EC%82%AC%EB%B3%B8/%EB%B0%9C%ED%91%9CPPT%EC%9D%98%20%EC%82%AC%EB%B3%B8-05.png?raw=true)

## 1.2 프로젝트 앱 로고

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

- 사건 주변의 소방용수, 유해시설, 기상정보, 건물의 상세정보, 실시간 인원 관제 등을 한 플렛폼에 통합 하였습니다.
- AI기술을 통해 실시간 인원 관제 시스템을 구현 시켰습니다.

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

![ERD](/readme/End_to_End.png)

## 2.2 시스템 구성도

### GCP 서버 배포
![GCP](/readme/servergcp.png)

### home서버 배포
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
<img src="https://img.shields.io/badge/expo-000020?style=for-the-badge&logo=expo&logoColor=white">
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
  <img src="https://img.shields.io/badge/postgresql-4169E1?style=for-the-badge&logo=postgresql&logoColor=white">
  <img src="https://img.shields.io/badge/googlecloudstorage-AECBFA?style=for-the-badge&logo=googlecloudstorage&logoColor=white">
  <img src="https://img.shields.io/badge/qgis-589632?style=for-the-badge&logo=qgis&logoColor=white">
</div>

### <div align="center"> Deployment </div>

<div align="center">
    <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=Docker&logoColor=white">
    <img src="https://img.shields.io/badge/raspberrypi-A22846?style=for-the-badge&logo=raspberrypi&logoColor=white">
    <img src="https://img.shields.io/badge/googlecloud-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white">
</div>
</div>

# 5. 저니맵에 따른 디자인

|                   **메인화면1**                    |
| :-----------------------------------------------: |
|       ![Main Page1](https://github.com/py4ine/LBS_1team/blob/main/readme/%EB%B0%9C%ED%91%9CPPT%EC%9D%98%20%EC%82%AC%EB%B3%B8/%EB%B0%9C%ED%91%9CPPT%EC%9D%98%20%EC%82%AC%EB%B3%B8-10.png?raw=true)       |
|                    **메인화면1**                   |
|      ![Main Page2](https://github.com/py4ine/LBS_1team/blob/main/readme/%EB%B0%9C%ED%91%9CPPT%EC%9D%98%20%EC%82%AC%EB%B3%B8/%EB%B0%9C%ED%91%9CPPT%EC%9D%98%20%EC%82%AC%EB%B3%B8-11.png?raw=true)      |


# 6. 데이터

- 데이터는 소방청 국토부 행안부 등 공공데이터를 최대한 활용 했습니다.

![data](https://github.com/py4ine/LBS_1team/blob/main/readme/%EB%B0%9C%ED%91%9CPPT%EC%9D%98%20%EC%82%AC%EB%B3%B8/%EB%B0%9C%ED%91%9CPPT%EC%9D%98%20%EC%82%AC%EB%B3%B8-12.png?raw=true)

# 7. 인원 관제 알고리즘

![AI Algorithm](/readme/objects_D&T_algorithm.png)

## 📑기타 사항


![API 명세서](https://github.com/py4ine/LBS_1team/blob/main/readme/%EB%B0%9C%ED%91%9CPPT%EC%9D%98%20%EC%82%AC%EB%B3%B8/%EB%B0%9C%ED%91%9CPPT%EC%9D%98%20%EC%82%AC%EB%B3%B8-27.png?raw=true)
