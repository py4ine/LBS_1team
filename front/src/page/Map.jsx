import React, {useRef, useState, useEffect} from "react";
import { Link } from "react-router-dom";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import useMap from "../hooks/useMap";
import {mapConfig} from "../config/mapConfig";
import "../assets/css/map.css"
import backArrowIcon from "../assets/images/map_icons/bg/icon_backarrow_BG.png";
import fireAreaIcon from "../assets/images/map_icons/bg/icon_linepin_BG.png";
import myLocationIcon from "../assets/images/map_icons/bg/icon_mylocation_BG.png";
import axios from "axios";

const MapBox = ({ onLoadGeoJson, onLoadWaterJson, onLoadDangerJson, onremovePointLayers }) => {
  const mapContainerRef = useRef(null);

  // `useMap`에서 세 개의 로드 함수 반환
  const { loadGeoJsonRef, loadWaterJsonRef, loadDangerJsonRef, removePointLayersRef } = useMap(mapContainerRef, mapConfig.defaultStyle, mapConfig);

  useEffect(() => {
    if (loadGeoJsonRef.current && onLoadGeoJson) {
      onLoadGeoJson(loadGeoJsonRef.current);
    }
    if (loadWaterJsonRef.current && onLoadWaterJson) {
      onLoadWaterJson(loadWaterJsonRef.current);
    }
    if (loadDangerJsonRef.current && onLoadDangerJson) {
      onLoadDangerJson(loadDangerJsonRef.current);
    }
    if (removePointLayersRef.current && onremovePointLayers) {
      onremovePointLayers(removePointLayersRef.current);
    }
  }, [loadGeoJsonRef, loadWaterJsonRef, loadDangerJsonRef, removePointLayersRef, onLoadGeoJson, onLoadWaterJson, onLoadDangerJson, onremovePointLayers]);

  return <div ref={mapContainerRef} style={{ width: "100%", height: "100vh" }} />;
};





function Map({ removepoint: initialPointLayers ="point", longitude: initialLongitude = 126.87942186751448, latitude: initialLatitude = 37.48095295527662 }) {
  const [isElementsShifted, setIsElementsShifted] = useState(false);
  const [activeModalType, setActiveModalType] = useState(null);
  const loadGeoJsonRef = useRef(null);
  const loadWaterJsonRef = useRef(null);
  const loadDagerJsonRef = useRef(null);
  const removePointLayersRef = useRef(null);
  
  
  // useState에 초기값으로 파라미터 값을 전달
  const [longitude, setLongitude] = useState(initialLongitude);
  const [latitude, setLatitude] = useState(initialLatitude);
  const [removepoint, setPointLayers] = useState(initialPointLayers);


  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(""); // 오류 상태 추가

  const API_KEY = "409e846b281cf5d9778aa237b0136e6b";

  // 날씨 데이터 가져오기
  const fetchWeatherData = async () => {
    try {
      setError(""); // 초기화
      const response = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
        params: {
          lat: latitude,
          lon: longitude,
          appid: API_KEY,
        },
      });

      const kelvinTemperature = response.data.main.temp;
      const celsiusTemperature = kelvinTemperature - 273.15;

      setWeatherData({
        temperature: celsiusTemperature.toFixed(2),
        humidity: response.data.main.humidity,
        windSpeed: response.data.wind.speed,
        windDirection: response.data.wind.deg || "N/A",
      });
    } catch (err) {
      setError("날씨 정보를 가져오는 데 실패했습니다.");
    }
  };

  // 초기 날씨 데이터를 가져옵니다.
  useEffect(() => {
    fetchWeatherData();
  }, [latitude, longitude]);


  const handlePinClick = (pinType) => {
    if (pinType === "pin2") {
      const geolocateControl = document.querySelector(
        ".mapboxgl-ctrl-geolocate"
      );
      if (geolocateControl) {
        geolocateControl.click();
      }
    }
    console.log(`${pinType} 핀이 클릭되었습니다`);
  };

  const handleModalOrSearchChange = (isOpen, modalType = null) => {
    setIsElementsShifted(isOpen);
    setActiveModalType(modalType);
  };

  const handleLoadGeoJson = (longitude, latitude) => {
    if (loadGeoJsonRef.current) {
      console.log("GeoJSON 로드 실행:", { longitude, latitude });
      loadGeoJsonRef.current(longitude, latitude); // GeoJSON 로드
    } else {
      console.warn("loadGeoJson 함수가 초기화되지 않았습니다.");
    }
  };
  const handleWaterJson = (longitude, latitude) => {
    if (loadWaterJsonRef.current) {
      console.log("Water 로드 실행:", { longitude, latitude });
      loadWaterJsonRef.current(longitude, latitude); // GeoJSON 로드
    } else {
      console.warn("loadWaterJson 함수가 초기화되지 않았습니다.");
    }
  };
  const handleDangerJson = (longitude, latitude) => {
    if (loadDagerJsonRef.current) {
      console.log("Danger 로드 실행:", { longitude, latitude });
      loadDagerJsonRef.current(longitude, latitude); // GeoJSON 로드
    } else {
      console.warn("loadDagerJson 함수가 초기화되지 않았습니다.");
    }
  };

  const handleRemovePointLayers = (removepoint) => {
    if (removePointLayersRef.current) {
      console.log("Danger 로드 실행:", { removepoint });
      removePointLayersRef.current(removepoint); // GeoJSON 로드
    } else {
      console.warn("loadDagerJson 함수가 초기화되지 않았습니다.");
    }
  };

  const getPinAreaClassName = () => {
    if (!isElementsShifted) return "pinArea";
    if (activeModalType) {
      return `pinArea ${activeModalType}-modal-active`;
    }
    return "pinArea search-active";
  };

  return (
    <>
      <Header />
      <div className="main_container">
        <MapBox
          onLoadGeoJson={(loadGeoJson) => {
            loadGeoJsonRef.current = loadGeoJson;
          }}
          onLoadWaterJson={(loadWaterJson) => {
            loadWaterJsonRef.current = loadWaterJson;
          }}
          onLoadDangerJson={(loadDangerJson) => {
            loadDagerJsonRef.current = loadDangerJson;
          }}
          onremovePointLayers={(removePointLayers) => {
            removePointLayersRef.current = removePointLayers;
          }}
        />
        <div className="backArea">
          <Link to="/">
            <img src={backArrowIcon} alt="뒤로가기" className="back-icon" />
          </Link>
        </div>
        <div className={getPinAreaClassName()}>
          <img
            src={fireAreaIcon}
            alt="핀1"
            className="pin-icon"
            onClick={() => handlePinClick("pin1")}
          />
          <img
            src={myLocationIcon}
            alt="핀2"
            className="pin-icon"
            onClick={() => handlePinClick("pin2")}
          />
        </div>
      </div>
      <Footer
        onLoadWaterJson={handleWaterJson}
        onLoadDangerJson={handleDangerJson}
        onLoadGeoJson={handleLoadGeoJson}
        onStateChange={handleModalOrSearchChange}
        onremovePointLayers={handleRemovePointLayers}
        longitude={longitude} // 전달
        latitude={latitude} // 전달
        weatherData={weatherData}
      />
    </>
  );
}

export default Map;
