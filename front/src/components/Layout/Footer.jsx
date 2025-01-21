import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
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
import fullPinIcon from "../../assets/images/map_icons/icon_pullfin.png";
import "../../assets/css/footer.css";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";

const Footer = forwardRef(
  (
    {
      onStateChange,
      onLoadGeoJson,
      onLoadWaterJson,
      onLoadDangerJson,
      onremovePointLayers,
      longitude,
      latitude,
      isPin1Active,
      removeCaseMarker,
      map,
      fs_code,
    },
    ref
  ) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeModal, setActiveModal] = useState(null);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [modalPosition, setModalPosition] = useState(0);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [text, setText] = useState("");
    const [activeIcon, setActiveIcon] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [currentMarker, setCurrentMarker] = useState(null);
    const [isFirstClickAfterPin1, setIsFirstClickAfterPin1] = useState(false);
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState("");
    const API_KEY = "409e846b281cf5d9778aa237b0136e6b";

    useEffect(() => {
      if (isPin1Active) {
        setIsFirstClickAfterPin1(true);
      }
    }, [isPin1Active]);
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
      { id: 1, src: waterIcon1, alt: "1", title: ": 지상식 소화전" },
      { id: 2, src: waterIcon2, alt: "2", title: ": 지하식 소화전" },
      { id: 3, src: waterIcon3, alt: "3", title: ": 급수탑" },
      { id: 4, src: waterIcon4, alt: "4", title: ": 저수조" },
      { id: 5, src: waterIcon5, alt: "5", title: ": 승하강식" },
      { id: 6, src: waterIcon6, alt: "5", title: ": 비상소화장치" },
    ];
    const harmfulnessArea = [
      { id: 1, src: harmfulnessIcon1, alt: "1", title: ": 유해화학시설" },
      { id: 2, src: harmfulnessIcon2, alt: "2", title: ": 주유소" },
    ];

    const handleWeatherClick = () => {
      if (isDangerVisible) {
        // 데이터 제거
        onremovePointLayers("points");
        setIsDangerVisible(false); // 상태 초기화
      } else if (isWaterVisible) {
        onremovePointLayers("points");
        setIsWaterVisible(false);
        // 데이터 로드
      }

      if (map) {
        const center = map.getCenter(); // map 객체로 중심 좌표 가져오기
        const latitude = center.lat;
        const longitude = center.lng;

        console.log("현재 지도 중심:", { latitude, longitude });
        fetchWeatherData(latitude, longitude); // 날씨 데이터 가져오기
      } else {
        console.error("map 객체가 전달되지 않았습니다.");
      }
    };

    // 날씨 데이터 가져오기 함수
    const fetchWeatherData = async (latitude, longitude) => {
      try {
        setError(""); // 기존 에러 상태 초기화
        const response = await axios.get(
          "https://api.openweathermap.org/data/2.5/weather",
          {
            params: {
              lat: latitude,
              lon: longitude,
              appid: API_KEY,
            },
          }
        );

        const kelvinTemperature = response.data.main.temp;
        const celsiusTemperature = kelvinTemperature - 273.15;

        setWeatherData({
          temperature: celsiusTemperature.toFixed(2),
          humidity: response.data.main.humidity,
          windSpeed: response.data.wind.speed,
          windDirection: response.data.wind.deg || "N/A",
        });

        console.log("Weather Data:", {
          temperature: celsiusTemperature.toFixed(2),
          humidity: response.data.main.humidity,
          windSpeed: response.data.wind.speed,
          windDirection: response.data.wind.deg || "N/A",
        });
      } catch (err) {
        setError("날씨 정보를 가져오는 데 실패했습니다.");
        console.error(err);
      }
    };

    // 날씨 정보 버튼 클릭 핸들러

    const getWindDirection = (degree) => {
      const directions = [
        "북",
        "북동",
        "동",
        "남동",
        "남",
        "남서",
        "서",
        "북서",
      ];
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
        if (isDangerVisible) {
          // 데이터 제거
          onremovePointLayers("points");
          setIsDangerVisible(false); // 상태 초기화
        } else if (isWaterVisible) {
          onremovePointLayers("points");
          setIsWaterVisible(false);
          // 데이터 로드
        }
      } else {
        setModalPosition(0);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    const getModalType = (modalId) => {
      switch (modalId) {
        case 1:
          return "water";
        case 2:
          return "harmfulness";
        case 4:
          return "weather";
        default:
          return null;
      }
    };

    const openModal = (modalId) => {
      if (activeModal === modalId) {
        closeModal();
      } else {
        if (isSearchVisible) {
          setIsSearchVisible(false);
        }

        setIsModalOpen(true);
        setActiveModal(modalId);
        setActiveIcon(modalId);
        onStateChange(true, getModalType(modalId));
      }
    };
    // 검색 모달 토글(서현)
    const toggleSearch = () => {
      const newSearchState = !isSearchVisible;
      // 검색창이 닫힐 때 (newSearchState가 false일 때)
      if (!newSearchState) {
      // 폴리곤 레이어들 제거
      if (window.mapInstance) {
        // 모든 팝업 제거 전에 포커스 제거
        const closeButtons = document.getElementsByClassName('mapboxgl-popup-close-button');
        Array.from(closeButtons).forEach(button => {
          button.blur(); // 포커스 제거
        });
        // 모든 팝업 제거(폴리곤을 누르면 나오는 건물정보 팝업 숨김)
        const popups = document.getElementsByClassName('mapboxgl-popup');
        while(popups[0]) {
          popups[0].remove();
        }
        // 폴리곤 레이어와 소스 제거(폴리곤 스타일 숨김)
        if (window.mapInstance.getLayer("polygon-layer")) {
          window.mapInstance.removeLayer("polygon-layer");
        }
        if (window.mapInstance.getLayer("polygon-outline-layer")) {
          window.mapInstance.removeLayer("polygon-outline-layer");
        }
        if (window.mapInstance.getSource("polygons")) {
          window.mapInstance.removeSource("polygons");
        }
    }
  }
      // 데이터 제거
      if (isDangerVisible) {
        onremovePointLayers("points");
        setIsDangerVisible(false); // 상태 초기화
      } else if (isWaterVisible) {
        onremovePointLayers("points");
        setIsWaterVisible(false);
        // 데이터 로드
      }
      // 모달 닫기(서현)
      if (isModalOpen) {
        setIsModalOpen(false);
        setActiveModal(null);
      }
      // 검색 모달 토글(서현)
      setIsSearchVisible(newSearchState);
      setActiveIcon(newSearchState ? 5 : null);
      onStateChange(newSearchState, null);
    };

    // 모달 닫기(서현)
    const closeModal = () => {
      setIsModalOpen(false);
      setActiveModal(null);
      setActiveIcon(null);
      setModalPosition(0);
      onStateChange(false, null);
    };

    // 검색 입력 핸들러(서현)
    const handleChange = async (e) => {
      setText(e.target.value);
      // 검색 입력 값이 비어있지 않은 경우에만 검색 결과를 초기화(서현)
      if (!e.target.value.trim()) {
        setSearchResults([]);
        return;
      }
      // 카카오 API 키 가져오기(서현)
      try {
        const kakaoApiKey = import.meta.env.VITE_KAKAO_REST_API_KEY;

        const keywordResponse = await fetch(
          `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(
            e.target.value.trim()
          )}&size=5`,
          {
            headers: {
              Authorization: `KakaoAK ${kakaoApiKey}`,
            },
          }
        );
        // 주소 검색 API 호출(서현)
        const addressResponse = await fetch(
          `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
            e.target.value.trim()
          )}&size=5`,
          {
            headers: {
              Authorization: `KakaoAK ${kakaoApiKey}`,
            },
          }
        );

        const [keywordData, addressData] = await Promise.all([
          keywordResponse.json(),
          addressResponse.json(),
        ]);

        let processedResults = [];

        // 키워드 검색 API 호출(서현)
        if (keywordData && keywordData.documents) {
          const keywordResults = keywordData.documents.map((place) => ({
            center: [parseFloat(place.x), parseFloat(place.y)],
            place_name: place.place_name,
            address: place.road_address_name || place.address_name,
            type: "place",
            original: place,
          }));
          processedResults = [...processedResults, ...keywordResults];
        }
        // 주소 검색 API 호출(서현)
        if (addressData && addressData.documents) {
          const addressResults = addressData.documents.map((place) => ({
            center: [parseFloat(place.x), parseFloat(place.y)],
            place_name: place.address_name,
            type: "address",
            original: place,
          }));
          processedResults = [...processedResults, ...addressResults];
        }
        // 검색 입력 값 처리(서현)
        const query = e.target.value.trim().toLowerCase();
        const isAddressQuery =
          query.includes("동") || query.includes("로") || query.includes("길");
        // 검색 결과 업데이트(서현)
        const filteredResults = isAddressQuery
          ? processedResults.filter((result) => result.type === "address")
          : processedResults.filter((result) => result.type === "place");

        setSearchResults(filteredResults);
      } catch (error) {
        // 검색 오류 처리(서현)
        console.error("Search error details:", error);
        setSearchResults([]);
      }
    };
    // 검색 제출 핸들러(서현)
    const handleSubmit = (e) => {
      e.preventDefault();
      if (searchResults.length > 0) {
        handleResultClick(searchResults[0]);
      }
    };

    // 검색 핸들러
    const handleResultClick = (result) => {
      if (!window.mapInstance) {
        console.error("Map instance not found");
        return;
      }

      // 기존 검색 마커 제거
      if (currentMarker) {
        currentMarker.remove();
      }

      // 사건 위치 마커 제거
      // props.removeCaseMarker();
      if (removeCaseMarker) {
        removeCaseMarker();
      }

      const el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundImage = `url(${fullPinIcon})`;
      el.style.width = "26px";
      el.style.height = "26px";
      el.style.backgroundSize = "contain";
      el.style.backgroundPosition = "center";
      el.style.backgroundRepeat = "no-repeat";

      const marker = new mapboxgl.Marker({
        element: el,
        anchor: "bottom",
      })
        .setLngLat(result.center)
        .addTo(window.mapInstance);

      setCurrentMarker(marker);

      window.mapInstance.flyTo({
        center: result.center,
        zoom: 15,
        essential: true,
      });

      setSearchResults([]);
      setText(result.place_name);
    };

    const handleSearchInputClick = () => {
      setText("");
      setSearchResults([]);
      if (currentMarker) {
        currentMarker.remove();
        setCurrentMarker(null);
      }
    };
    // 모달 상태 초기화(서현)
    const resetState = () => {
      setIsModalOpen(false);
      setActiveModal(null);
      setActiveIcon(null);
      setModalPosition(0);
      setIsSearchVisible(false);
    };

    //  footer에서 ref를 통해 접근할수 있는 함수 추가
    useImperativeHandle(ref, () => ({
      resetState,

      // 검색 마커 제거 (찬진)
      removeSearchMarker: () => {
        if (currentMarker) {
          currentMarker.remove();
          setCurrentMarker(null);
        }
      },
    }));

    // 아이콘 클래스 가져오기(서현)
    const getIconClass = (iconId) => {
      return `footer_icon ${activeIcon === iconId ? "active" : ""}`;
    };

    // 용수시설 클릭 핸들러(서현)
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
    // 주변 건물 조회 핸들러(서현)
    const handleNearbyBuildings = () => {
      // const longitude = 126.87942186751448; // 테스트용 경도
      // const latitude = 37.48095295527662; // 테스트용 위도
      // GeoJSON 로드 함수(서현)
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
              className={`modal_content active ${
                modalPosition > 0 ? "dragging" : ""
              }`}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                transform: `translateX(-50%) translateY(${modalPosition}px)`,
              }}
              tabIndex="-1"
            >
              <div className="modal_handle">
                <div className="handle_bar" />
              </div>
              <div className="modal_inner">
                {activeModal === 1 ? (
                  <div className="water-icons-container">
                    <h2 id={`modal-title-${activeModal}`} className="sr-only">
                      용수시설 정보
                    </h2>
                    {waterArea.map((water) => (
                      <div key={water.id} className="water-icon-item">
                        <img src={water.src} alt="" aria-hidden="true" />
                        <span role="text">{water.title}</span>
                      </div>
                    ))}
                  </div>
                ) : activeModal === 2 ? (
                  <div className="harmfulness-icons-container">
                    <h2 id={`modal-title-${activeModal}`} className="sr-only">
                      유해시설 정보
                    </h2>
                    {harmfulnessArea.map((harmfulness) => (
                      <div
                        key={harmfulness.id}
                        className="harmfulness-icon-item"
                      >
                        <img src={harmfulness.src} alt="" aria-hidden="true" />
                        <span role="text">{harmfulness.title}</span>
                      </div>
                    ))}
                  </div>
                ) : weatherData ? ( // weatherData가 null이 아닌 경우에만 렌더링
                  <>
                    <h2 id={`modal-title-${activeModal}`} className="sr-only">
                      {icons.find((icon) => icon.id === activeModal)?.title}
                    </h2>
                    <div className="weather">
                      <p>
                        <strong>습도:</strong> {weatherData.humidity}%
                      </p>
                      <p>
                        <strong>풍속:</strong> {weatherData.windSpeed} m/s
                      </p>
                      <p>
                        <strong>온도:</strong> {weatherData.temperature}°C
                      </p>
                      <p>
                        <strong>풍향:</strong>{" "}
                        {getWindDirection(weatherData.windDirection)}
                      </p>
                    </div>
                  </>
                ) : (
                  <p>날씨 데이터를 불러오는 중입니다...</p> // weatherData가 null일 때 표시
                )}
              </div>
            </div>
          </div>
        )}

        {isSearchVisible && (
          <>
            <div className="search-form-container">
              <form className="search-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="주소,건물명을 검색하세요"
                  value={text}
                  onChange={handleChange}
                  onClick={handleSearchInputClick}
                  className="search-input"
                />
                <button type="submit" className="search-submit">
                  <img src={searchIcon} alt="검색" />
                </button>
              </form>
              {searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="search-result-item"
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="result-name">{result.place_name}</div>
                      {result.type === "place" && result.address && (
                        <div className="result-address">{result.address}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
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

                  // 아이콘 클래스를 가져오는 로직 유지
                  const iconClass = getIconClass(icon.id);

                  if (icon.id === 1) {
                    content = (
                      <button
                        className="footer_link"
                        onClick={() => {
                          openModal(icon.id);
                          handleWaterClick();
                        }}
                      >
                        <div className={iconClass}>
                          <img src={icon.src} alt={icon.alt} />
                          <p className="footer_text">{icon.title}</p>
                        </div>
                      </button>
                    );
                  } else if (icon.id === 2) {
                    content = (
                      <button
                        className="footer_link"
                        onClick={() => {
                          openModal(icon.id);
                          handleDangerClick();
                        }}
                      >
                        <div className={iconClass}>
                          <img src={icon.src} alt={icon.alt} />
                          <p className="footer_text">{icon.title}</p>
                        </div>
                      </button>
                    );
                  } else if (icon.id === 3) {
                    content = (
                      <Link
                        to="/main"
                        state={{ fs_code: fs_code }}
                        className="footer_link"
                      >
                        <div className={iconClass}>
                          <img src={icon.src} alt={icon.alt} />
                          <p className="footer_text">{icon.title}</p>
                        </div>
                      </Link>
                    );
                  } else if (icon.id === 4) {
                    content = (
                      <button
                        className="footer_link"
                        onClick={() => {
                          openModal(icon.id);
                          handleWeatherClick();
                        }}
                      >
                        <div className={iconClass}>
                          <img src={icon.src} alt={icon.alt} />
                          <p className="footer_text">{icon.title}</p>
                        </div>
                      </button>
                    );
                  } else if (icon.id === 5) {
                    content = (
                      <button className="footer_link" onClick={toggleSearch}>
                        <div className={iconClass}>
                          <img src={icon.src} alt={icon.alt} />
                          <p className="footer_text">{icon.title}</p>
                        </div>
                      </button>
                    );
                  } else {
                    content = (
                      <button
                        className="footer_link"
                        onClick={() => openModal(icon.id)}
                      >
                        <div className={iconClass}>
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
);

export default Footer;
