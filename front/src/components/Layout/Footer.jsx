import React, { useState } from "react";
import { Link } from "react-router-dom";
import waterIcon from "../../assets/images/map_icons/footer/icon_water.png";
import harmfulnessIcon from "../../assets/images/map_icons/footer/icon_harmfulness.png";
import homeIcon from "../../assets/images/map_icons/footer/icon_home.png";
import weatherIcon from "../../assets/images/map_icons/footer/icon_weather.png";
import searchIcon from "../../assets/images/map_icons/footer/icon_search.png";
import "../../assets/css/footer.css";


function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [modalPosition, setModalPosition] = useState(0);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const icons = [
    { id: 1, src: waterIcon, alt: "용수시설", title: "용수시설" },
    { id: 2, src: harmfulnessIcon, alt: "유해시설", title: "유해시설" },
    { id: 3, src: homeIcon, alt: "홈", title: "홈" },
    { id: 4, src: weatherIcon, alt: "날씨정보", title: "날씨정보" },
    { id: 5, src: searchIcon, alt: "검색", title: "검색" },
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

  const openModal = (modalId) => {
    setIsModalOpen(true);
    setActiveModal(modalId);
    setModalPosition(0);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveModal(null);
    setModalPosition(0);
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  return (
    <div className="footer_mainWrap">
      {isModalOpen && activeModal !== 3 && (
        <div className="modal_container">
          <div className="modal_overlay" onClick={closeModal} />
          <div 
            className={`modal_content active ${modalPosition > 0 ? 'dragging' : ''}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              transform: `translateX(-50%) translateY(${modalPosition}px)`
            }}
          >
            <div className="modal_handle">
              <div className="handle_bar" />
            </div>
            <div className="modal_inner">
              <h2>{icons.find(icon => icon.id === activeModal)?.title}</h2>
              <p>{icons.find(icon => icon.id === activeModal)?.title} 모달 내용입니다!</p>
            </div>
          </div>
        </div>
      )}
      
      {isSearchVisible && (
        <div className="search-button-container">
          <button className="search-button">
            주변 건물 조회
          </button>
        </div>
      )}

      <div className="footer_wrap">
        <div className="footer_container">
          <div className="footer_bg">
            <ul className="footer_list">
              {icons.map((icon) => (
                <li key={icon.id} className="footer_item">
                  {icon.id === 3 ? (
                    <Link to="/" className="footer_link">
                      <div className="footer_icon">
                        <img src={icon.src} alt={icon.alt} />
                        <p className="footer_text">{icon.title}</p>
                      </div>
                    </Link>
                  ) : icon.id === 5 ? (
                    <button className="footer_link" onClick={toggleSearch}>
                      <div className="footer_icon">
                        <img src={icon.src} alt={icon.alt} />
                        <p className="footer_text">{icon.title}</p>
                      </div>
                    </button>
                  ) : (
                    <button className="footer_link" onClick={() => openModal(icon.id)}>
                      <div className="footer_icon">
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
}

export default Footer;