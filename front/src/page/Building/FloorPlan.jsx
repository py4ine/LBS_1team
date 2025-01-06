import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Layout/Header";
import "../../assets/css/FloorPlan.css";

function FloorPlan() {
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState("https://storage.cloud.google.com/lbsteam1/image%203.png");
  const [isFullScreen, setIsFullScreen] = useState(false); // 특정 컨테이너만 화면 꽉 채우기

  // 버튼 데이터 배열
  const buttonData = [
    { label: "비상구", src: "https://storage.cloud.google.com/lbsteam1/images.png" },
    { label: "엘리베이터", src: "https://storage.cloud.google.com/lbsteam1/png-clipart-pokemon-pikachu-pikachu-pokemon-games-pokemon-thumbnail.png" },
    { label: "소화전", src: "https://storage.cloud.google.com/lbsteam1/png-transparent-doraemon-miffy-desktop-doraemon-thumbnail.png" },
    { label: "창문", src: "https://storage.cloud.google.com/lbsteam1/png-transparent-ghibli-museum-studio-ghibli-animation-animation-food-studio-head-thumbnail.png" },
    { label: "CCTV", src: "https://storage.cloud.google.com/lbsteam1/image.png" },
    { label: "출입구", src: "https://storage.cloud.google.com/lbsteam1/image.png" },
    { label: "인원수", src: "https://storage.cloud.google.com/lbsteam1/png-transparent-computer-icons-test-event-miscellaneous-text-logo.png" },
  ];

  const handleFloorChange = (event) => {
    const floor = event.target.value;
    const defaultImage = {
      "1층": "https://storage.cloud.google.com/lbsteam1/image%203.png",
      "2층": "https://storage.cloud.google.com/lbsteam1/second-floor.png",
      "3층": "https://storage.cloud.google.com/lbsteam1/third-floor.png",
    };
    setImageSrc(defaultImage[floor]);
    setIsFullScreen(true); // 설계도 컨테이너만 꽉 채우기 활성화
  };

  const handleCloseFullScreen = () => {
    setIsFullScreen(false); // 화면 꽉 채우기 비활성화
  };

  const handleClick = () => {
    navigate("/map/1"); // 이동할 경로
  };

  return (
    <>
      <Header />
      <div className="main_container">
        <div className="floorplan_main_container">
          {/* 닫기 버튼 */}
          <div className="css-x-button" onClick={handleClick}></div>

          {/* 층 선택 */}
          <div className="floorplan-header">
            <select className="floor-select" onChange={handleFloorChange}>
              <option value="1층">1층 설계도</option>
              <option value="2층">2층</option>
              <option value="3층">3층</option>
            </select>
          </div>

          {/* <div class="selectBox2 ">
            <button class="label">fruits 🍊</button>
            <ul class="optionList">
              <li class="optionItem">apple</li>
              <li class="optionItem">orange</li>
              <li class="optionItem">grape</li>
              <li class="optionItem">melon</li>
            </ul>
          </div> */}

          {/* 설계도 이미지 */}
          <div
            className={`floorplan-image-container ${
              isFullScreen ? "fullscreen" : ""
            }`}
          >
            <img src={imageSrc} alt="설계도 이미지" className="floorplan-image" />
            {isFullScreen && (
              <button className="close-fullscreen" onClick={handleCloseFullScreen}>
                닫기
              </button>
            )}
          </div>

          {/* 아이콘 버튼 */}
          {!isFullScreen && (
            <div className="icon-buttons">
              {buttonData.map((button, index) => (
                <button key={index} onClick={() => setImageSrc(button.src)}>
                  {button.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default FloorPlan;
