import React, { useState } from "react";
import { Link } from "react-router-dom";
import waterIcon from "../../assets/images/map_icons/footer/icon_water.png";
import waterIcon1 from "../../assets/images/map_icons/water/icon_water1.png";
import waterIcon2 from "../../assets/images/map_icons/water/icon_water2.png";
import waterIcon3 from "../../assets/images/map_icons/water/icon_water3.png";
import waterIcon4 from "../../assets/images/map_icons/water/icon_water4.png";
import waterIcon5 from "../../assets/images/map_icons/water/icon_water5.png";
import waterIcon6 from "../../assets/images/map_icons/water/icon_water6.png";
import harmfulnessIcon from "../../assets/images/map_icons/footer/icon_harmfulness.png";
import harmfulnessIcon1 from "../../assets/images/map_icons/harmfulness/icon_harmfulness1.png";
import harmfulnessIcon2 from "../../assets/images/map_icons/harmfulness/icon_harmfulness2.png";
import homeIcon from "../../assets/images/map_icons/footer/icon_home.png";
import weatherIcon from "../../assets/images/map_icons/footer/icon_weather.png";
import searchIcon from "../../assets/images/map_icons/footer/icon_search.png";
import "../../assets/css/footer.css";


function Footer({ onStateChange, onLoadGeoJson, onLoadWaterJson, onLoadDangerJson, onremovePointLayers, longitude, latitude, weatherData  }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [modalPosition, setModalPosition] = useState(0);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [text, setText] = useState("");
  const [isWaterVisible, setIsWaterVisible] = useState(false);
  const [isDangerVisible, setIsDangerVisible] = useState(false);
  // console.log(weatherData)
  const icons = [
    { id: 1, src: waterIcon, alt: "용수시설", title: "용수시설" },
    { id: 2, src: harmfulnessIcon, alt: "유해시설", title: "유해시설" },
    { id: 3, src: homeIcon, alt: "홈", title: "홈" },
    { id: 4, src: weatherIcon, alt: "날씨정보", title: "날씨정보" },
    { id: 5, src: searchIcon, alt: "검색", title: "검색" },
  ];
  const waterArea = [
    { id: 1, src: waterIcon1, alt: "1", title:": 지상식 소화전" },
    { id: 2, src: waterIcon2, alt: "2", title: ": 지하식 소화전" },
    { id: 3, src: waterIcon3, alt: "3", title: ": 급수탑" },
    { id: 4, src: waterIcon4, alt: "4", title: ": 저수조" },
    { id: 5, src: waterIcon5, alt: "5", title: ": 승하강식" },
    { id: 6, src: waterIcon6, alt: "5", title: ": 비상소화장치" },
  ];
  const harmfulnessArea = [
    { id: 1, src: harmfulnessIcon1, alt: "1", title:": 지상식 소화전" },
    { id: 2, src: harmfulnessIcon2, alt: "2", title: ": 지하식 소화전" },
    
  ];

  const getWindDirection = (degree) => {
    const directions = ["북", "북동", "동", "남동", "남", "남서", "서", "북서"];
    const index = Math.round(degree / 45) % 8;
    return directions[index];
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientY);
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
    const diff = touchEnd - touchStart;
    if (diff > 0) {
      setModalPosition(diff);
    }
  };

  const handleTouchEnd = () => {
    const diff = touchEnd - touchStart;
    if (diff > 50) {
      closeModal();
    } else {
      setModalPosition(0);
    }
  };

  const getModalType = (modalId) => {
    switch(modalId) {
      case 1:
        return 'water';
      case 2:
        return 'harmfulness';
      case 4:
        return 'weather';
      default:
        return null;
    }
  };

  const openModal = (modalId) => {
    if (modalId === activeModal) {
      closeModal();
    } else {
      if (isModalOpen) {
        closeModal();
        setTimeout(() => {
          setIsModalOpen(true);
          setActiveModal(modalId);
          setModalPosition(0);
          onStateChange(true, getModalType(modalId));
        }, 100);
      } else {
        setIsModalOpen(true);
        setActiveModal(modalId);
        setModalPosition(0);
        onStateChange(true, getModalType(modalId));
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveModal(null);
    setModalPosition(0);
    onStateChange(isSearchVisible, null);
  };

  const toggleSearch = () => {
    const newSearchState = !isSearchVisible;
    setIsSearchVisible(newSearchState);
    if (!isModalOpen) {
      onStateChange(newSearchState, null);
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };





  const handleWaterClick = () => {
    if (isWaterVisible) {
      // 데이터 제거
      onremovePointLayers("points");
      setIsWaterVisible(false); // 상태 초기화
    } else if (isDangerVisible) {
      
      onremovePointLayers("points");
      setIsDangerVisible(false);
      // 데이터 로드
      handleNearbyWaters();
      setIsWaterVisible(true); // 데이터가 표시 중임을 추적
    } else {

      handleNearbyWaters();
      setIsWaterVisible(true);
    }
  };
  
  const handleDangerClick = () => {
    if (isDangerVisible) {
      // 데이터 제거
      onremovePointLayers("points");
      setIsDangerVisible(false); // 상태 초기화
    } else if (isWaterVisible) {
      onremovePointLayers("points");
      setIsWaterVisible(false); 
      // 데이터 로드
      handleNearbyDanger();
      setIsDangerVisible(true); // 데이터가 표시 중임을 추적
    } else {

      handleNearbyDanger();
      setIsDangerVisible(true); 
    }
  };
  

  
  const handleNearbyBuildings = () => {
    // const longitude = 126.87942186751448; // 테스트용 경도
    // const latitude = 37.48095295527662; // 테스트용 위도
  
    if (onLoadGeoJson) {
      console.log("onLoadGeoJson 호출:", { longitude, latitude });
      onLoadGeoJson(longitude, latitude);
    } else {
      console.warn("onLoadGeoJson 함수가 전달되지 않았습니다.");
    }
  };

  const handleNearbyWaters = () => {
    // const longitude = 126.87942186751448; // 테스트용 경도
    // const latitude = 37.48095295527662; // 테스트용 위도
  
    if (onLoadWaterJson) {
      console.log("onLoadWaterJson 호출:", { longitude, latitude });
      onLoadWaterJson(longitude, latitude);
    } else {
      console.warn("onLoadWaterJson 함수가 전달되지 않았습니다.");
    }
  };

  const handleNearbyDanger = () => {
    // const longitude = 126.87942186751448; // 테스트용 경도
    // const latitude = 37.48095295527662; // 테스트용 위도
  
    if (onLoadDangerJson) {
      console.log("onLoadDangerJson 호출:", { longitude, latitude });
      onLoadDangerJson(longitude, latitude);
    } else {
      console.warn("onLoadDangerJson 함수가 전달되지 않았습니다.");
    }
  };
  
  return (
    <div className="footer_mainWrap">
      {isModalOpen && activeModal !== 3 && (
        <div 
          className="modal_container"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`modal-title-${activeModal}`}
          onKeyDown={handleKeyDown}
        >
          <div 
            className="modal_overlay" 
            onClick={closeModal}
            aria-label="Close modal"
          />
          <div 
            className={`modal_content active ${modalPosition > 0 ? 'dragging' : ''}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              transform: `translateX(-50%) translateY(${modalPosition}px)`
            }}
            tabIndex="-1"
          >
            <div className="modal_handle">
              <div className="handle_bar" />
            </div>
            <div className="modal_inner">
              {activeModal === 1 ? (
                <div className="water-icons-container">
                  <h2 id={`modal-title-${activeModal}`} className="sr-only">용수시설 정보</h2>
                  {waterArea.map((water) => (
                    <div key={water.id} className="water-icon-item">
                      <img src={water.src} alt="" aria-hidden="true" />
                      <span role="text">{water.title}</span>
                    </div>
                  ))}
                </div>
              ) : activeModal === 2 ? (
                <div className="harmfulness-icons-container">
                  <h2 id={`modal-title-${activeModal}`} className="sr-only">유해시설 정보</h2>
                  {harmfulnessArea.map((harmfulness) => (
                    <div key={harmfulness.id} className="harmfulness-icon-item">
                      <img src={harmfulness.src} alt="" aria-hidden="true" />
                      <span role="text">{harmfulness.title}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <h2 id={`modal-title-${activeModal}`} className="sr-only">
                    {icons.find(icon => icon.id === activeModal)?.title}
                  </h2>
                  <p role="text" >온도: {weatherData.temperature}°C</p>
                  <p>습도: {weatherData.humidity}%</p>
                  <p>풍속: {weatherData.windSpeed} m/s</p>
                  <p>풍향: {getWindDirection(weatherData.windDirection)}°</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      {isSearchVisible && (
        <>
          <div className="search-form-container">
            <form className="search-form">
              <input 
                type="text" 
                placeholder="주소,건물명을 검색하세요"
                value={text}
                onChange={handleChange}
                className="search-input"
              />
              <button type="submit" className="search-submit">
                <img src={searchIcon} alt="검색" />
              </button>
            </form>
          </div>
          <div className="search-button-container">
            <button className="search-button" onClick={handleNearbyBuildings}>
              주변 건물 조회
            </button>
          </div>
        </>
      )}

      <div className="footer_wrap">
        <div className="footer_container">
          <div className="footer_bg">
          <ul className="footer_list">
              {icons.map((icon) => {
                let content;

                if (icon.id === 1) {
                  content = (
                    <button className="footer_link" onClick={() => {openModal(icon.id); handleWaterClick();}}>
                      <div className="footer_icon">
                        <img src={icon.src} alt={icon.alt} />
                        <p className="footer_text">{icon.title}</p>
                      </div>
                    </button>
                  );
                } else if (icon.id === 2) {
                  content = (
                    <button className="footer_link" onClick={() => {openModal(icon.id); handleDangerClick()}}>
                      <div className="footer_icon">
                        <img src={icon.src} alt={icon.alt} />
                        <p className="footer_text">{icon.title}</p>
                      </div>
                    </button>
                  );
                } else if (icon.id === 3) {
                  content = (
                    <Link to="/" className="footer_link">
                      <div className="footer_icon">
                        <img src={icon.src} alt={icon.alt} />
                        <p className="footer_text">{icon.title}</p>
                      </div>
                    </Link>
                  );
                } else if (icon.id === 4) {
                  content = (
                    <button className="footer_link" onClick={() => openModal(icon.id)}>
                      <div className="footer_icon">
                        <img src={icon.src} alt={icon.alt} />
                        <p className="footer_text">{icon.title}</p>
                      </div>
                    </button>
                  );
                } else if (icon.id === 5) {
                  content = (
                    <button className="footer_link" onClick={toggleSearch}>
                      <div className="footer_icon">
                        <img src={icon.src} alt={icon.alt} />
                        <p className="footer_text">{icon.title}</p>
                      </div>
                    </button>
                  );
                } else {
                  content = (
                    <button className="footer_link" onClick={() => openModal(icon.id)}>
                      <div className="footer_icon">
                        <img src={icon.src} alt={icon.alt} />
                        <p className="footer_text">{icon.title}</p>
                      </div>
                    </button>
                  );
                }

                return (
                  <li key={icon.id} className="footer_item">
                    {content}
                  </li>
                );
              })}
            </ul>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;