import React, { useState } from "react";
import "../../assets/css/header.css";
import header_logo from "../../assets/images/logo/header_logo.png";
import SideMenu from "../Header/SideMenu";

function Header() {
  // 클릭 여부 체크
  const [isOpen, setIsOpen] = useState(false);

  // 사이드 메뉴 핸들러
  const handleMenu = () => {
    setIsOpen(!isOpen);

    // 사이드메뉴가 열릴 때 body에 overflow: hidden 추가
    // document.body.style.overflow = isOpen ? "auto" : "hidden";
  };

  return (
    <>
      <div className="header_bgc">
        <div className="headerWrap">
          <img src={header_logo} alt="소방RG 로고" />

          {/* 햄버거 버튼 */}
          <button
            className={`hamburger ${isOpen ? "click" : ""}`}
            onClick={handleMenu}
          >
            <span></span>
          </button>
        </div>
      </div>

      {/* 사이드 메뉴 컴포넌트 */}
      <SideMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

export default Header;
