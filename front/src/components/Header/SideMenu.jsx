import React from "react";
import profileImg from "../../assets/images/img/profile.png";
import "../../assets/css/sideMenu.css";
import arrow from "../../assets/images/button_icons/icon_leftarrow_G.png";

function SideMenu({ isOpen, onClose }) {
  return (
    <>
      <div className={`contentWrap ${isOpen ? "open" : ""}`}>
        {/* 프로필 */}
        <div className="profileWrap">
          <img src={profileImg} alt="소방청 프로필" />
          구로 소방서
        </div>

        {/* 메뉴 리스트 */}
        <ul className="menu_list">
          <li>
            <button>
              <span>사용가이드</span>
              <img src={arrow} />
            </button>
          </li>
          <li>
            <button>
              <span>공지사항</span>
              <img src={arrow} />
            </button>
          </li>
          <li>
            <button>
              <span>버전 정보</span>
              <img src={arrow} />
            </button>
          </li>
          <li>
            <button>
              <span>로그아웃</span>
              <img src={arrow} />
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}

export default SideMenu;
