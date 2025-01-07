<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta> 
import React, {useRef, useState, useEffect} from "react";
import { Link } from "react-router-dom";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import useMap from "../hooks/useMap";
import {mapConfig} from "../config/mapConfig";
import "../assets/css/map.css"
import backArrowIcon from "../assets/images/map_icons/bg/icon_backarrow_BG.png";
import fireAreaIcon from "../assets/images/map_icons/bg/icon_linepin_BG.png";
import fireAreaActiveIcon from "../assets/images/map_icons/bg/icon_linepinW_BG.png";
import myLocationIcon from "../assets/images/map_icons/bg/icon_mylocation_BG.png";
import myLocationActiveIcon from "../assets/images/map_icons/bg/icon_mylocationW_BG.png";


const MapBox =() => {
  const mapContainerRef = useRef(null);

  useMap(mapContainerRef, mapConfig.defaultStyle , mapConfig);

  return <div ref ={mapContainerRef} style={{width : '100%', height : '100vh'}}/>
}

function Map() {
  const mapContainerRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [isElementsShifted, setIsElementsShifted] = useState(false);
  const [activeModalType, setActiveModalType] = useState(null);
  const [activePin, setActivePin] = useState(null);

  // useMap hook 사용
  const map = useMap(mapContainerRef, mapConfig.defaultStyle, mapConfig);

  useEffect(() => {
    if (mapContainerRef.current && map) {
      setMapInstance(map);
      // 전역 객체에 map 인스턴스 저장
      window.mapInstance = map;
    }
    
    // cleanup function
    return () => {
      window.mapInstance = null;
    };
  }, [map]);

  // 핀 위치 + 이미지 변경 표시를 위한 함수
  const handlePinClick = (pinType) => {
    if (pinType === "pin2") {
      // pin2 (내위치 핀) 클릭시 geoLocate 컨트롤 트리거
      const geolocateControl = document.querySelector(
        ".mapboxgl-ctrl-geolocate"
      );
      if (geolocateControl) {
        geolocateControl.click();
      }
    } else if (pinType === "pin1" && activePin === "pin2") {
      // pin2가 활성화된 상태에서 pin1을 클릭할 때
      // geolocate 컨트롤을 비활성화
      const geolocateControl = document.querySelector(
        ".mapboxgl-ctrl-geolocate"
      );
      if (geolocateControl) {
        geolocateControl.click(); // 한번 더 클릭하여 비활성화
      }
    }
    
    // 핀 상태 화이트 이미지로 업데이트
    setActivePin(activePin === pinType ? null : pinType);
  };

  //footer modal이 올라오는 길이가 다르기 때문에 핀1/핀2의 위치를 그에 맞게 조절하기 위한 함수
  const handleModalOrSearchChange = (isOpen, modalType = null) => {
    setIsElementsShifted(isOpen); // 요소들의 위치 이동 여부를 설정
    setActiveModalType(modalType); // 활성화된 모달의 타입을 설정
  };

  const getPinAreaClassName = () => {
    if (!isElementsShifted) return 'pinArea';
    if (activeModalType) {
      return `pinArea ${activeModalType}-modal-active`;
    }
    return 'pinArea search-active';
  };

  //핀을 눌렀을때 이미지가 변경되게 할 경로 지정 함수
  const getIconSource = (pinType) => {
    switch(pinType) {
      case 'pin1':
        return activePin === 'pin1' ? fireAreaActiveIcon : fireAreaIcon;
      case 'pin2':
        return activePin === 'pin2' ? myLocationActiveIcon : myLocationIcon;
      default:
        return '';
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <div ref={mapContainerRef} style={{width: '100%', height: '100vh'}}/>
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
            src={getIconSource('pin1')}
            alt="핀1" 
            className="pin-icon"
            onClick={() => handlePinClick('pin1')}
          />
          <img 
            src={getIconSource('pin2')}
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
