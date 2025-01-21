import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import useMap from "../hooks/useMap";
import { mapConfig } from "../config/mapConfig";
import "../assets/css/map.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setMapCenter,
  setMapZoom,
  setMarkers,
  setSelectedBuilding,
} from "../store/slice/mapSlice"; // redux slice

// 아이콘 import
import backArrowIcon from "../assets/images/map_icons/bg/icon_backarrow_BG.png";
import fireAreaIcon from "../assets/images/map_icons/bg/icon_linepin_BG.png";
import fireAreaActiveIcon from "../assets/images/map_icons/bg/icon_linepinW_BG.png";
import myLocationIcon from "../assets/images/map_icons/bg/icon_mylocation_BG.png";
import myLocationActiveIcon from "../assets/images/map_icons/bg/icon_mylocationW_BG.png";
import leftArrowIcon from "../assets/images/button_icons/icon_leftarrow_G.png";
import pullfinIcon from "../assets/images/map_icons/icon_pullfin.png";

function Map() {
  // 필요한 hooks 설정
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mapContainerRef = useRef(null);
  const footerRef = useRef(null);

  // Redux store 필요한 상태들 가져오기
  const currentCase = useSelector((state) => state.cases.currentCase);
  const { fs_code } = useSelector((state) => state.auth);
  // const { center, zoom, waterfacilities, dangerfacilities } = useSelector(
  //   (state) => state.map
  // );

  // local 상태 관리
  const [isElementsShifted, setIsElementsShifted] = useState(false);
  const [isPin1ModalOpen, setIsPin1ModalOpen] = useState(false);
  const [activePin, setActivePin] = useState(null);
  const [currentLocationMarker, setCurrentLocationMarker] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [caseMarker, setCaseMarker] = useState(null); // 사건 위치 마커 상태 저장소 (찬진)
  const [activeModalType, setActiveModalType] = useState(null);

  // GeoJSON 관련 ref
  const loadGeoJsonRef = useRef(null);
  const loadWaterJsonRef = useRef(null);
  const loadDangerJsonRef = useRef(null);
  const removePointLayersRef = useRef(null);

  const [mapInstance, setMapInstance] = useState(null);
  // const [mapLoaded, setMapLoaded] = useState(false);
  const location = useLocation();
  // const [caseData, setCaseData] = useState(location.state.caseData); // caseData 상태 저장소 (찬진)
  // const [fs_code, setFs_code] = useState(location.state.fsCode); // fsCode 상태저장소
  // const [longitude, setLongitude] = useState(location.state.caseData.longitude); // (추가)
  // const [latitude, setLatitude] = useState(location.state.caseData.latitude); // (추가)
  // const [center, setCenter] = useState(null); // 지도 중심점
  // const [bound, setbound] = useState(null); // 지도 중심점

  // console.log(location.state.caseData);

  // useMap hook 사용
  const {
    map,
    mapboxgl,
    mapLoaded,
    loadGeoJsonRef: hookGeoJsonRef,
    loadWaterJsonRef: hookWaterJsonRef,
    loadDangerJsonRef: hookDangerJsonRef,
    removePointLayersRef: hookRemovePointLayersRef,
  } = useMap(mapContainerRef, mapConfig.defaultStyle, mapConfig);

  // 사건 데이터 체크 (찬진)
  useEffect(() => {
    if (!currentCase) {
      navigate("/main");
      return;
    }
  }, [currentCase, navigate]);

  useEffect(() => {
    if (mapContainerRef.current && map) {
      setMapInstance(map);
      window.mapInstance = map;
    }

    return () => {
      window.mapInstance = null;
    };
  }, [map]);

  // useEffect에서 마커 관리
  useEffect(() => {
    if (!map || !mapLoaded || !currentCase || !mapboxgl) {
      return;
    }

    const marker = createMarker();

    return () => {
      if (marker) {
        marker.remove();
      }
    };
  }, [mapLoaded, map, currentCase, mapboxgl]);

  // ref 설정
  useEffect(() => {
    loadGeoJsonRef.current = hookGeoJsonRef.current;
    loadWaterJsonRef.current = hookWaterJsonRef.current;
    loadDangerJsonRef.current = hookDangerJsonRef.current;
    removePointLayersRef.current = hookRemovePointLayersRef.current;
  }, [
    hookGeoJsonRef,
    hookWaterJsonRef,
    hookDangerJsonRef,
    hookRemovePointLayersRef,
  ]);

  // 마커 생성
  const createMarker = () => {
    try {
      // console.log("Creating marker with data:", caseData);

      const el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundImage = `url(${pullfinIcon})`;
      el.style.width = "40px";
      el.style.height = "40px";
      el.style.backgroundRepeat = "no-repeat";
      el.style.backgroundPosition = "center";

      const marker = new mapboxgl.Marker({
        element: el,
        anchor: "bottom",
      })
        .setLngLat([currentCase.longitude, currentCase.latitude])
        .addTo(map);

      setCaseMarker(marker);

      // map state redux 업데이트
      dispatch(setMapCenter([currentCase.longitude, currentCase.latitude]));
      dispatch(setMapZoom(15));

      map.flyTo({
        center: [currentCase.longitude, currentCase.latitude],
        zoom: 15,
        essential: true,
      });

      return marker;
    } catch (error) {
      console.error("Error creating marker:", error);
      return null;
    }
  };

  // 사건 마커 제거 (찬진)
  const removeCaseMarker = () => {
    if (caseMarker) {
      caseMarker.remove();
    }
  };

  // 데이터 핸들러 함수들
  const handleLoadGeoJson = () => {
    if (map) {
      const mapCenter = map.getCenter(); // 현재 지도의 중심점을 직접 가져옴

      // 상태 업데이트
      // setCenter(mapCenter);
      dispatch(setMapCenter([mapCenter.lng, mapCenter.lat]));

      // 중심점 좌표를 직접 사용
      if (loadGeoJsonRef.current) {
        loadGeoJsonRef
          .current(mapCenter.lng, mapCenter.lat)
          .then((data) => {
            // 건물 데이터를 redux store에 저장
            dispatch(setMarkers(data));
          })
          .catch((error) => {
            console.error("Error loading building data:", error);
          });
      }
    }
  };

  // console.log("1: ", caseData.longitude);
  const handleWaterJson = () => {
    if (map) {
      const mapBound = map.getBounds();

      // 경계 좌표를 각각 가져옴
      const southWest = mapBound.getSouthWest();
      const northWest = mapBound.getNorthWest();
      const northEast = mapBound.getNorthEast();
      const southEast = mapBound.getSouthEast();

      // POLYGON 좌표 생성
      const polygonCoords = `
        POLYGON((
          ${southWest.lng} ${southWest.lat},
          ${northWest.lng} ${northWest.lat},
          ${northEast.lng} ${northEast.lat},
          ${southEast.lng} ${southEast.lat},
          ${southWest.lng} ${southWest.lat}
        ))
      `.replace(/\s+/g, " "); // 공백을 하나로 정리

      console.log("Generated POLYGON:", polygonCoords);

      if (loadWaterJsonRef.current) {
        loadWaterJsonRef.current(polygonCoords);
      }
    } else {
      console.error("Map object is not available.");
    }
  };

  const handleDangerJson = () => {
    if (map) {
      const mapBound = map.getBounds();

      // 경계 좌표를 각각 가져옴
      const southWest = mapBound.getSouthWest();
      const northWest = mapBound.getNorthWest();
      const northEast = mapBound.getNorthEast();
      const southEast = mapBound.getSouthEast();

      // POLYGON 좌표 생성
      const polygonCoords = `
        POLYGON((
          ${southWest.lng} ${southWest.lat},
          ${northWest.lng} ${northWest.lat},
          ${northEast.lng} ${northEast.lat},
          ${southEast.lng} ${southEast.lat},
          ${southWest.lng} ${southWest.lat}
        ))
      `.replace(/\s+/g, " "); // 공백을 하나로 정리

      console.log("Generated POLYGON:", polygonCoords);

      if (loadDangerJsonRef.current) {
        loadDangerJsonRef.current(polygonCoords);
      }
    } else {
      console.error("Map object is not available.");
    }
  };

  const handleRemovePointLayers = (pointType) => {
    if (removePointLayersRef.current) {
      removePointLayersRef.current(pointType);
    }
  };

  // UI 관련 핸들러
  const handleBackClick = () => {
    navigate("/main");
  };

  // Footer 모달 상태 관리
  const handleModalOrSearchChange = (isOpen, modalType = null) => {
    if (isOpen && isPin1ModalOpen) {
      setIsPin1ModalOpen(false);
      setActivePin(null);
    }

    setIsElementsShifted(isOpen);
    setActiveModalType(modalType);
  };

  // Pin 클릭 핸들러
  const handlePinClick = (pinType) => {
    if (pinType === "pin1") {
      const newModalState = !isPin1ModalOpen;

      if (isElementsShifted) {
        setIsElementsShifted(false);
        setActiveModalType(null);

        if (footerRef.current) {
          footerRef.current.resetState();
        }
      }

      // footer의 currentMarker 제거하기 위한 함수
      const removeSearchMarker = () => {
        if (footerRef.current) {
          footerRef.current.removeSearchMarker();
        }
      };

      removeSearchMarker(); // 검색 마커 제거 (찬진)
      createMarker(); // 사건핀 마커 재생성 및 이동 (찬진)
      setIsPin1ModalOpen(newModalState);
      handleModalOrSearchChange(newModalState, "pin1");
    }
    if (pinType === "pin2") {
      if (currentLocationMarker) {
        currentLocationMarker.remove();
        setCurrentLocationMarker(null);
        if (watchId) {
          navigator.geolocation.clearWatch(watchId);
          setWatchId(null);
        }
        setActivePin(null);

        return;
      }

      // 현재 위치 마커 생성 및 위치 추적 로직
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            if (map) {
              map.flyTo({
                center: [lng, lat],
                zoom: 15,
                essential: true,
              });

              const el = document.createElement("div");
              el.className = "current-location-marker";
              el.style.width = "20px";
              el.style.height = "20px";
              el.style.borderRadius = "50%";
              el.style.backgroundColor = "var(--textColor)";
              el.style.border = "2px solid white";
              el.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";

              const marker = new mapboxgl.Marker({
                element: el,
                anchor: "center",
                offset: [0, 0],
                animate: false,
              })
                .setLngLat([lng, lat])
                .addTo(map);

              setCurrentLocationMarker(marker);

              const id = navigator.geolocation.watchPosition(
                (newPosition) => {
                  const newLat = newPosition.coords.latitude;
                  const newLng = newPosition.coords.longitude;
                  marker.setLngLat([newLng, newLat]);

                  // 위치가 업데이트될 때마다 날씨 정보도 업데이트
                  fetchWeatherData(newLat, newLng);
                },
                (error) => {
                  console.error("Error tracking location:", error);
                  alert("위치 추적을 할 수 없습니다.");
                  setActivePin(null);
                },
                {
                  enableHighAccuracy: true,
                  maximumAge: 0,
                  timeout: 5000,
                }
              );

              setWatchId(id);
            }
          },
          (error) => {
            console.error("Error getting initial location:", error);
            alert("초기 위치를 가져올 수 없습니다.");
            setActivePin(null);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000,
          }
        );
      } else {
        alert("이 브라우저에서는 위치 정보를 사용할 수 없습니다.");
        setActivePin(null);
      }
    }

    setActivePin(activePin === pinType ? null : pinType);
  };

  const getPinAreaClassName = () => {
    if (isPin1ModalOpen) {
      return "pinArea pin1-modal-active";
    }
    if (!isElementsShifted) return "pinArea";
    if (activeModalType) {
      return `pinArea ${activeModalType}-modal-active`;
    }
    return "pinArea search-active";
  };

  const getIconSource = (pinType) => {
    switch (pinType) {
      case "pin1":
        return activePin === "pin1" ? fireAreaActiveIcon : fireAreaIcon;
      case "pin2":
        return activePin === "pin2" ? myLocationActiveIcon : myLocationIcon;
      default:
        return "";
    }
  };

  // 컴포넌트 언마운트 시 위치 추적 중지
  useEffect(() => {
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return (
    <>
      <Helmet>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Helmet>
      <Header />
      <div className="container">
        <div ref={mapContainerRef} style={{ width: "100%", height: "100vh" }} />
        <div className="backArea">
          <img
            src={backArrowIcon}
            alt="뒤로가기"
            className="back-icon"
            onClick={handleBackClick}
          />
        </div>
        <div className={getPinAreaClassName()}>
          <img
            src={getIconSource("pin1")}
            alt="핀1"
            className="pin-icon"
            onClick={() => handlePinClick("pin1")}
          />
          <img
            src={getIconSource("pin2")}
            alt="핀2"
            className="pin-icon"
            onClick={() => handlePinClick("pin2")}
          />
        </div>

        {/* Pin1 Modal */}
        {isPin1ModalOpen && currentCase && (
          <div className="pin1_modal_container">
            <div
              className="pin1_modal_overlay"
              onClick={() => setIsPin1ModalOpen(false)}
            />
            <div
              className={`pin1_modal_content ${
                isPin1ModalOpen ? "active" : ""
              }`}
            >
              <div className="pin1_modal_handle">
                <div className="handle_bar" />
              </div>
              <div className="pin1_modal_inner">
                <div className="modal_header">
                  <h2>건물명 : {currentCase.bldg_nm}</h2>
                  <Link
                    to={`/map/${currentCase.bldg_id}`}
                    // state={{ caseData: caseData, fs_code: fs_code }}
                    className="more_details"
                  >
                    <p className="more_icon_text">더보기</p>
                    <img
                      src={leftArrowIcon}
                      alt="더보기"
                      className="more_icon"
                    />
                  </Link>
                </div>
                <p>{currentCase.road_nm_addr}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer
        ref={footerRef}
        onStateChange={handleModalOrSearchChange}
        isPin1Active={isPin1ModalOpen}
        onLoadWaterJson={handleWaterJson}
        onLoadDangerJson={handleDangerJson}
        onLoadGeoJson={handleLoadGeoJson}
        onremovePointLayers={handleRemovePointLayers}
        map={map}
        removeCaseMarker={removeCaseMarker} // footer 에 마커 제거함수 전달 (찬진)
        fs_code={fs_code} // 소방서 코드 전달
      />
    </>
  );
}

export default Map;
