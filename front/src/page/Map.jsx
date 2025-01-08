<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta> 
import React, {useRef, useState, useEffect} from "react";
import { Link, useLocation } from "react-router-dom";
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
import leftArrowIcon from "../assets/images/button_icons/icon_leftarrow_G.png";
import pullfinIcon from "../assets/images/map_icons/icon_pullfin.png";


function Map() {
  const mapContainerRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [isElementsShifted, setIsElementsShifted] = useState(false);
  const [activeModalType, setActiveModalType] = useState(null);
  const [activePin, setActivePin] = useState(null);
  const [isPin1ModalOpen, setIsPin1ModalOpen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const footerRef = useRef(null);
  const [currentLocationMarker, setCurrentLocationMarker] = useState(null);
  const [watchId, setWatchId] = useState(null);
  
  const location = useLocation();
  
  // localStorage를 사용하여 caseData 관리
  const [caseData, setCaseData] = useState(() => {
    const savedData = localStorage.getItem('caseData');
    return savedData ? JSON.parse(savedData) : location.state?.caseData;
  });

  // location.state가 변경될 때 localStorage 업데이트
  useEffect(() => {
    if (location.state?.caseData) {
      localStorage.setItem('caseData', JSON.stringify(location.state.caseData));
      setCaseData(location.state.caseData);
    }
  }, [location.state]);

  // console.log("location state:", location.state); // (찬진)

  // console.log("caseData: ", caseData); //(찬진)

  // useMap hook 사용
  const {map,mapboxgl} = useMap(mapContainerRef, mapConfig.defaultStyle, mapConfig);

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

  // map 로드 완료 감지
  useEffect(() => {
    if (map) {
      map.on('load', () => {
        setMapLoaded(true);
      });
    }
  }, [map]);

  // 마커 생성을 위한 useEffect
  useEffect(() => {
    if (!map || !mapLoaded || !caseData || !mapboxgl) {
      return; // 필요한 모든 의존성이 준비되지 않았다면 실행하지 않음
    }

    try {
      console.log("Creating marker with data:", caseData);
      
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = `url(${pullfinIcon})`;
      el.style.width = '40px';
      el.style.height = '40px';
      // el.style.backgroundSize = 'cover'; // 100% 대신 cover 사용
      el.style.backgroundRepeat = 'no-repeat';
      el.style.backgroundPosition = 'center';

      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'bottom' // 마커의 아래쪽 끝이 좌표에 위치하도록 설정
      })
        .setLngLat([caseData.longitude, caseData.latitude])
        .addTo(map);

      map.flyTo({
        center: [caseData.longitude, caseData.latitude],
        zoom: 15,
        essential: true // 애니메이션이 중단되지 않도록 설정
      });

      // cleanup function
      return () => {
        if (marker) {
          marker.remove();
        }
      };
    } catch (error) {
      console.error("Error creating marker:", error);
    }
  }, [mapLoaded, map, caseData, mapboxgl]);

  // Footer 모달 상태를 관리하는 함수
  const handleModalOrSearchChange = (isOpen, modalType = null) => {
    // Pin1 모달이 열려있을 때 Footer 모달을 열려고 하면 Pin1 모달 닫기
    if (isOpen && isPin1ModalOpen) {
      setIsPin1ModalOpen(false);
      setActivePin(null);
    }
    
    setIsElementsShifted(isOpen);
    setActiveModalType(modalType);
  };

  // Pin1 클릭을 관리하는 함수
  const handlePinClick = (pinType) => {
    if (pinType === "pin1") {
      const newModalState = !isPin1ModalOpen;
      
      // Footer 모달이 열려있을 때 Pin1을 열려고 하면 Footer 모달 닫기
      if (isElementsShifted) {
        setIsElementsShifted(false);
        setActiveModalType(null);
        
        // Footer 컴포넌트의 상태도 리셋
        if (footerRef.current) {
          footerRef.current.resetState();
        }
      }
      
      setIsPin1ModalOpen(newModalState);
      handleModalOrSearchChange(newModalState, 'pin1');
    }
    if (pinType === "pin2") {
      // 이미 마커가 있다면 제거하고 위치 추적 중지
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

      // 실시간 위치 추적 시작
      if (navigator.geolocation) {
        // 최초 위치 확인
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            if (map) {
              // 최초 위치로 지도 이동
              map.flyTo({
                center: [lng, lat],
                zoom: 15,
                essential: true
              });

              // 현재 위치 마커 생성
              const el = document.createElement('div');
              el.className = 'current-location-marker';
              el.style.width = '20px';
              el.style.height = '20px';
              el.style.borderRadius = '50%';
              el.style.backgroundColor = 'var(--textColor)';
              el.style.border = '2px solid white';
              el.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';

              const marker = new mapboxgl.Marker({
                element: el,
                anchor: 'center',
                offset: [0, 0],
                // 마커의 움직�을 부드럽게 하지 않음
                animate: false
              })
                .setLngLat([lng, lat])
                .addTo(map);

              setCurrentLocationMarker(marker);

              // 실시간 위치 추적 시작 (뷰포트 이동 없이)
              const id = navigator.geolocation.watchPosition(
                (newPosition) => {
                  const newLat = newPosition.coords.latitude;
                  const newLng = newPosition.coords.longitude;
                  
                  // 마커의 위치 조용히 업데이트
                  marker.setLngLat([newLng, newLat]);
                },
                (error) => {
                  console.error('Error tracking location:', error);
                  alert('위치 추적을 할 수 없습니다.');
                  setActivePin(null);
                },
                {
                  enableHighAccuracy: true,
                  maximumAge: 0,
                  timeout: 5000
                }
              );

              setWatchId(id);
            }
          },
          (error) => {
            console.error('Error getting initial location:', error);
            alert('초기 위치를 가져올 수 없습니다.');
            setActivePin(null);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
          }
        );
      } else {
        alert('이 브라우저에서는 위치 정보를 사용할 수 없습니다.');
        setActivePin(null);
      }
    }
    
    setActivePin(activePin === pinType ? null : pinType);
  };

  const getPinAreaClassName = () => {
    // Pin1 모달이 활성화되어 있으면 항상 pin1-modal-active 클래스 반환
    if (isPin1ModalOpen) {
      return 'pinArea pin1-modal-active';
    }
    // 그 외의 경우 기존 로직 유지
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
        
        {/* Pin1 Modal */}
        {isPin1ModalOpen && caseData && (
          <div className="pin1_modal_container">
            <div 
              className="pin1_modal_overlay" 
              onClick={() => setIsPin1ModalOpen(false)}
            />
            <div className={`pin1_modal_content ${isPin1ModalOpen ? 'active' : ''}`}>
              <div className="pin1_modal_handle">
                <div className="handle_bar" />
              </div>
              <div className="pin1_modal_inner">
                <div className="modal_header">
                  <h2>건물명 : {caseData.bldg_nm}</h2>
                  <Link 
                    to="/map/1" 
                    state={{ caseData: caseData }} // CaseData 전달->CaseDetail 페이지로 이동
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
                <p>{caseData.road_nm_addr}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer 
        ref={footerRef}
        onStateChange={handleModalOrSearchChange} 
        isPin1Active={isPin1ModalOpen}
      />
    </>
  );
}

export default Map;
