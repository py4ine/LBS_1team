import React, { useEffect, useState } from "react"; // -useEffect 추가 (찬진)
import { useLocation, useNavigate, useParams } from "react-router-dom"; // -useParams 추가 (찬진)
import Header from "../../components/Layout/Header";
import "../../assets/css/FloorPlan.css";
import FloorPlanBtn from "../../components/Detail/FloorPlanBtn"; // 버튼 컴포넌트 추가 (찬진)

function FloorPlan() {
  const navigate = useNavigate();
  const { bldgId, flplanId } = useParams(); // URL에서 case,flplan ID 가져오기 (찬진)
  const location = useLocation(); // 이전 페이지에서 전달된 데이터(state) 가져오기 (찬진)

  // location.state에서 층수정보 추출 , 없으면 기본값으로 설정 (찬진)
  // const { gro_flo_co, und_flo_co } = location.state || {
  //   gro_flo_co: 1,
  //   und_flo_co: 0,
  // };

  // 층수 정보 상태 관리
  const [floorInfo, setFloorInfo] = useState({
    gro_flo_co: location.state?.gro_flo_co || 1,
    und_flo_co: location.state?.und_flo_co || 0,
  });

  // url , location.state가 변경될때마다 층수정보 업데이트 useEffect
  useEffect(() => {
    if (
      location.state?.gro_flo_co !== undefined &&
      location.state?.und_flo_co !== undefined
    ) {
      setFloorInfo({
        gro_flo_co: Number(location.state.gro_flo_co),
        und_flo_co: Number(location.state.und_flo_co),
      });
    }
  }, [location.state]);

  //  url 에서 현재 층수 가져오기 (찬진)
  const currentFloor = flplanId ? Number(flplanId) : 1;

  const [imageSrc, setImageSrc] = useState(
    "https://storage.cloud.google.com/lbsteam1/image%203.png"
  );
  const [isFullScreen, setIsFullScreen] = useState(false); // 특정 컨테이너만 화면 꽉 채우기

  // 버튼 데이터 배열
  const buttonData = [
    {
      label: "비상구",
      src: "asddsadas",
    },
    {
      label: "엘리베이터",
      src: "https://storage.cloud.google.com/lbsteam1/png-clipart-pokemon-pikachu-pikachu-pokemon-games-pokemon-thumbnail.png",
    },
    {
      label: "소화전",
      src: "https://storage.cloud.google.com/lbsteam1/png-transparent-doraemon-miffy-desktop-doraemon-thumbnail.png",
    },
    {
      label: "창문",
      src: "https://storage.cloud.google.com/lbsteam1/png-transparent-ghibli-museum-studio-ghibli-animation-animation-food-studio-head-thumbnail.png",
    },
    {
      label: "CCTV",
      src: "https://storage.cloud.google.com/lbsteam1/image.png",
    },
    {
      label: "출입구",
      src: "https://storage.cloud.google.com/lbsteam1/image.png",
    },
    {
      label: "인원수",
      src: "https://storage.cloud.google.com/lbsteam1/png-transparent-computer-icons-test-event-miscellaneous-text-logo.png",
    },
  ];

  // 층별 설계도 버튼 핸들러
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

  const handleFloorNavigation = (floor) => {
    navigate(`/map/${bldgId}/${floor}`, {
      state: floorInfo,
    });
  };

  const handleClick = () => {
    navigate(`/map/${bldgId}`); // 이동할 경로
  };

  return (
    <>
      <Header />
      <div className="main_container">
        <div className="floorplan_main_container">
          {/* 닫기 버튼 */}
          <div className="css-x-button" onClick={handleClick}></div>

          {/* 층 선택 */}
          {/* <div className="floorplan-header"> */}
          <FloorPlanBtn
            gro_flo_co={floorInfo.gro_flo_co}
            und_flo_co={floorInfo.und_flo_co}
            // onChange={handleFloorChange}
            onFloorSelect={handleFloorNavigation}
            currentFloor={currentFloor}
          />
          {/* <select className="floor-select" onChange={handleFloorChange}>
              <option value="1층">1층 설계도</option>
              <option value="2층">2층</option>
              <option value="3층">3층</option>
            </select> */}
          {/* </div> */}

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
            <img
              src={imageSrc}
              alt="설계도 이미지"
              className="floorplan-image"
            />
            {isFullScreen && (
              <button
                className="close-fullscreen"
                onClick={handleCloseFullScreen}
              >
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
