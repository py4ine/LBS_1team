# Python 3.8 슬림 버전 이미지를 기반으로 설정
FROM python:3.8-slim

# 작업 디렉토리 설정 (컨테이너 내부의 /app 디렉토리에서 작업)
WORKDIR /app

# 필수 시스템 패키지 설치  cmake \
RUN apt-get update && apt-get install -y \
    build-essential \        
    git \                    
    ninja-build \            
    ffmpeg \                 
    libsm6 \                 
    libxext6 \               
    && rm -rf /var/lib/apt/lists/* 

# Python pip 업그레이드
RUN pip install --no-cache-dir --upgrade pip

# 1단계: NumPy 최신 버전 설치 및 다른 패키지 설치
COPY requirements.txt . 
RUN pip install --no-cache-dir -r requirements.txt

# 프로젝트 코드 복사 (로컬 디렉토리 내용을 컨테이너 내부 /app에 복사)
COPY . .

# ByteTrack 설치
RUN git clone https://github.com/ifzhang/ByteTrack.git \
    && sed -i 's/np.float/float/g' ByteTrack/yolox/tracker/*.py \
    && cd ByteTrack && python3 setup.py develop                        

# FastAPI 서버가 실행될 포트 (8000번 포트 노출)
EXPOSE 8000

# 컨테이너 시작 시 실행될 명령어 (FastAPI 서버 실행)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]