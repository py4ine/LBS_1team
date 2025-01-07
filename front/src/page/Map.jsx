import React, {useRef, useState} from "react";
import { Link } from "react-router-dom";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import useMap from "../hooks/useMap";
import {mapConfig} from "../config/mapConfig";
import "../assets/css/map.css"
import backArrowIcon from "../assets/images/map_icons/bg/icon_backarrow_BG.png";
import fireAreaIcon from "../assets/images/map_icons/bg/icon_linepin_BG.png";
import myLocationIcon from "../assets/images/map_icons/bg/icon_mylocation_BG.png";


const MapBox =() => {
  // console.log("!!")
  const mapContainerRef = useRef(null);

  useMap(mapContainerRef, mapConfig.defaultStyle , mapConfig);

  return <div ref ={mapContainerRef} style={{width : '100%', height : '100vh'}}/>
  // 'calc(100vh - 120px)'
}

function Map() {
  const [isElementsShifted, setIsElementsShifted] = useState(false);
  const [activeModalType, setActiveModalType] = useState(null);

  // 핀 위치 표시를 위한 함수
  const handlePinClick = (pinType) => {
    if (pinType === "pin2") {
      // pin2 (내위치 핀) 클릭시 geoLocate 컨트롤 트리거
      const geolocateControl = document.querySelector(
        ".mapboxgl-ctrl-geolocate"
      );
      if (geolocateControl) {
        geolocateControl.click();
      }
    }
    // 나중에 실제 데이터와 연동하여 핀 위치 표시 로직 구현
    console.log(`${pinType} 핀이 클릭되었습니다`);
  };

  const handleModalOrSearchChange = (isOpen, modalType = null) => {
    setIsElementsShifted(isOpen);
    setActiveModalType(modalType);
  };

  const getPinAreaClassName = () => {
    if (!isElementsShifted) return 'pinArea';
    if (activeModalType) {
      return `pinArea ${activeModalType}-modal-active`;
    }
    return 'pinArea search-active';
  };

  return (
    <>
      <Header />
      <div className="main_container">
        <MapBox/>
        <div className="backArea">
          <Link to="/main">
            <img 
              src={backArrowIcon}
              alt="뒤로가기" 
              className="back-icon"
            />
          </Link>
        </div>
        <div className={getPinAreaClassName()}>
          <img 
            src={fireAreaIcon} 
            alt="핀1" 
            className="pin-icon"
            onClick={() => handlePinClick('pin1')}
          />
          <img 
            src={myLocationIcon} 
            alt="핀2" 
            className="pin-icon"
            onClick={() => handlePinClick('pin2')}
          />
        </div>
      </div>
      <Footer onStateChange={handleModalOrSearchChange} />
    </>
  );
}

export default Map;
