import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Layout/Header";
import "../../assets/css/FloorPlan.css";

function FloorPlan() {
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState("https://storage.cloud.google.com/lbsteam1/image%203.png");

  const handleClick = () => {
    navigate("/map/1"); // 이동할 경로
  };
  return (
    <>
      <Header />
      <div className="main_container">
      
        <div className="floorplan_main_container">
        <div class="css-x-button" onClick={handleClick}></div>
          <div className="floorplan-header">
            <select className="floor-select">
              <option value="1층">1층 설계도</option>
              <option value="2층">2층</option>
              <option value="3층">3층</option>
            </select>
          </div>

          {/* 설계도 이미지 */}
          <div className="floorplan-image-container">
          <img src={imageSrc} alt="설계도 이미지" className="floorplan-image" />
        </div>

        {/* 아이콘 버튼 */}
        <div className="icon-buttons">
          <button onClick={() => setImageSrc("https://storage.cloud.google.com/lbsteam1/images.png")}>
            비상구
          </button>
          <button onClick={() => setImageSrc("https://storage.cloud.google.com/lbsteam1/png-clipart-pokemon-pikachu-pikachu-pokemon-games-pokemon-thumbnail.png")}>
            엘리베이터
          </button>
          <button onClick={() => setImageSrc("https://storage.cloud.google.com/lbsteam1/png-transparent-doraemon-miffy-desktop-doraemon-thumbnail.png")}>
            소화전
          </button>
          <button onClick={() => setImageSrc("https://storage.cloud.google.com/lbsteam1/png-transparent-ghibli-museum-studio-ghibli-animation-animation-food-studio-head-thumbnail.png")}>
            창문
          </button>
          <button onClick={() => setImageSrc("/images/cctv.png")}>CCTV</button>
          <button onClick={() => setImageSrc("/images/entrance.png")}>
            출입구
          </button>
          <button onClick={() => setImageSrc("/images/people-count.png")}>
            인원수
          </button>
          </div>                                        
        </div>

      </div>
    </>
  );
}

export default FloorPlan;
