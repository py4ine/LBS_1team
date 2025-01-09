import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
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
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';


const Footer = forwardRef(({ onStateChange, isPin1Active }, ref) => {
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

  useEffect(() => {
    if (isPin1Active) {
      setIsFirstClickAfterPin1(true);
    }
  }, [isPin1Active]);

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

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeModal();
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

  const toggleSearch = () => {
    const newSearchState = !isSearchVisible;
    
    if (isModalOpen) {
      setIsModalOpen(false);
      setActiveModal(null);
    }
    
    setIsSearchVisible(newSearchState);
    setActiveIcon(newSearchState ? 5 : null);
    onStateChange(newSearchState, null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveModal(null);
    setActiveIcon(null);
    setModalPosition(0);
    onStateChange(false, null);
  };

  const handleChange = async (e) => {
    setText(e.target.value);
    
    if (!e.target.value.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const kakaoApiKey = import.meta.env.VITE_KAKAO_REST_API_KEY;
      
      const keywordResponse = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(e.target.value.trim())}&size=5`,
        {
          headers: {
            'Authorization': `KakaoAK ${kakaoApiKey}`
          }
        }
      );

      const addressResponse = await fetch(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(e.target.value.trim())}&size=5`,
        {
          headers: {
            'Authorization': `KakaoAK ${kakaoApiKey}`
          }
        }
      );

      const [keywordData, addressData] = await Promise.all([
        keywordResponse.json(),
        addressResponse.json()
      ]);

      let processedResults = [];

      if (keywordData && keywordData.documents) {
        const keywordResults = keywordData.documents.map(place => ({
          center: [parseFloat(place.x), parseFloat(place.y)],
          place_name: place.place_name,
          address: place.road_address_name || place.address_name,
          type: 'place',
          original: place
        }));
        processedResults = [...processedResults, ...keywordResults];
      }

      if (addressData && addressData.documents) {
        const addressResults = addressData.documents.map(place => ({
          center: [parseFloat(place.x), parseFloat(place.y)],
          place_name: place.address_name,
          type: 'address',
          original: place
        }));
        processedResults = [...processedResults, ...addressResults];
      }

      const query = e.target.value.trim().toLowerCase();
      const isAddressQuery = query.includes('동') || query.includes('로') || query.includes('길');
      
      const filteredResults = isAddressQuery 
        ? processedResults.filter(result => result.type === 'address')
        : processedResults.filter(result => result.type === 'place');

      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Search error details:', error);
      setSearchResults([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      handleResultClick(searchResults[0]);
    }
  };

  const handleResultClick = (result) => {
    if (!window.mapInstance) {
      console.error('Map instance not found');
      return;
    }

    if (currentMarker) {
      currentMarker.remove();
    }

    const el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundImage = `url(${fullPinIcon})`;
    el.style.width = '26px';
    el.style.height = '26px';
    el.style.backgroundSize = 'contain';
    el.style.backgroundPosition = 'center';
    el.style.backgroundRepeat = 'no-repeat';

    const marker = new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(result.center)
      .addTo(window.mapInstance);

    setCurrentMarker(marker);
    
    window.mapInstance.flyTo({
      center: result.center,
      zoom: 15,
      essential: true
    });
    
    setSearchResults([]);
    setText(result.place_name);
  };

  const handleSearchInputClick = () => {
    setText('');
    setSearchResults([]);
    if (currentMarker) {
      currentMarker.remove();
      setCurrentMarker(null);
    }
  };

  const resetState = () => {
    setIsModalOpen(false);
    setActiveModal(null);
    setActiveIcon(null);
    setModalPosition(0);
    setIsSearchVisible(false);
  };

  useImperativeHandle(ref, () => ({
    resetState
  }));

  const getIconClass = (iconId) => {
    return `footer_icon ${activeIcon === iconId ? 'active' : ''}`;
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
                  <p role="text">
                    {icons.find(icon => icon.id === activeModal)?.title} 모달 내용입니다!
                  </p>
                </>
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
                    {result.type === 'place' && result.address && (
                      <div className="result-address">{result.address}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="search-button-container">
            <button className="search-button">
              주변 건물 조회
            </button>
          </div>
        </>
      )}

      <div className="footer_wrap">
        <div className="footer_container">
          <div className="footer_bg">
            <ul className="footer_list">
              {icons.map((icon) => (
                <li key={icon.id} className="footer_item">
                  {icon.id === 3 ? (
                    <Link to="/main" className="footer_link">
                      <div className={getIconClass(icon.id)}>
                        <img src={icon.src} alt={icon.alt} />
                        <p className="footer_text">{icon.title}</p>
                      </div>
                    </Link>
                  ) : icon.id === 5 ? (
                    <button className="footer_link" onClick={toggleSearch}>
                      <div className={getIconClass(icon.id)}>
                        <img src={icon.src} alt={icon.alt} />
                        <p className="footer_text">{icon.title}</p>
                      </div>
                    </button>
                  ) : (
                    <button className="footer_link" onClick={() => openModal(icon.id)}>
                      <div className={getIconClass(icon.id)}>
                        <img src={icon.src} alt={icon.alt} />
                        <p className="footer_text">{icon.title}</p>
                      </div>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Footer;