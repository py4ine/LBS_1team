import PropTypes from "prop-types";
import React, { useState } from "react";
import "../../assets/css/floorPlanBtn.css";
import downArrow from "../../assets/images/button_icons/icon_downarrow_B.png";

function FloorPlanBtn({ gro_flo_co, und_flo_co, onFloorSelect, currentFloor }) {
  const [btnOpen, setBtnOpen] = useState(false); // 층별 설계도 버튼 상태 저장소

  // 지하층 배열 생성
  const belowFloors = Array.from(
    { length: und_flo_co },
    (_, i) => -(i + 1)
  ).reverse();

  // 지상층 배열 생성
  const aboveFloors = Array.from({ length: gro_flo_co }, (_, i) => i + 1);

  // 전체 층수 배열 생성
  const floors = [...belowFloors, ...aboveFloors];

  /**
   * 층수 표시 형식을 변환하는 함수
   * @param {number} floor - 층수
   * @returns {string} 포맷팅된 층수 문자열
   */

  const formatFloorLabel = (floor) => {
    if (floor < 0) return `지하${Math.abs(floor)}층`; // 지하층인 경우 (예: -1 -> B1F)
    return `${floor}층`; // 지상층인 경우 (예: 1 -> 1F)
  };

  /**
   * 층수 선택 시 실행되는 핸들러
   * @param {number} selectedFloor - 선택된 층수
   */
  // const handleFloorSelect = (selectedFloor) => {
  //   onFloorSelect(selectedFloor); // 부모 컴포넌트로 선택된 층수 전달
  //   setBtnOpen(false); // 층수 선택 후 버튼 메뉴 닫기
  // };

  const handleBtnClick = (selectedFloor) => {
    if (onFloorSelect && typeof onFloorSelect === "function") {
      onFloorSelect(selectedFloor);
      setBtnOpen(false);
    }
  };

  // 현재 층수 레이블 생성
  const getCurrentFloorLabel = () => {
    const floorLabel = formatFloorLabel(currentFloor);
    return `${floorLabel} 설계도`;
  };

  return (
    <>
      <div className="floorBtn_Wrap">
        {/* 층수 선택 토글 버튼 */}
        <button
          className={`floor_toggleBtn ${btnOpen ? "open" : ""}`}
          onClick={() => setBtnOpen(!btnOpen)}
        >
          {getCurrentFloorLabel()}
          <div>
            <img src={downArrow} alt="아래 화살표" />
          </div>
        </button>

        {/* 층수 선택 버튼 목록 */}
        {btnOpen && (
          <div className={`floorBtnWrap ${btnOpen ? "open" : ""}`}>
            {/* 지하층 */}
            {belowFloors.length > 0 && (
              <div className="flPlanBtn_section">
                {belowFloors.map((floor) => (
                  <button
                    key={`below-${floor}`}
                    onClick={() => handleBtnClick(floor)}
                    className="floorBtn"
                  >
                    {formatFloorLabel(floor)}
                  </button>
                ))}
              </div>
            )}

            {/* 지상층 */}
            {aboveFloors.length > 0 && (
              <div className="flPlanBtn_section">
                {/* <div className="flPlanBtn_label"></div> */}
                {aboveFloors.map((floor) => (
                  <button
                    key={`above-${floor}`}
                    onClick={() => handleBtnClick(floor)}
                    className="floorBtn"
                  >
                    {formatFloorLabel(floor)}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* {btnOpen && (
          <div className="floorBtnWrap">
            {floors.map((floor) => (
              <button
                key={floor}
                onClick={() => handleFloorSelect(floor)}
                className="floorBtn"
              >
                {formatFloorLabel(floor)}
                지상/지하 표시
                {floor === 1 && <div>지상</div>}
                {floor === -1 && <div>지하</div>}
              </button>
            ))}
          </div>
        )} */}
      </div>
    </>
  );
}

// Props 타입 검증 설정
FloorPlanBtn.propTypes = {
  gro_flo_co: PropTypes.number.isRequired, // 지상층 수
  und_flo_co: PropTypes.number.isRequired, // 지하층 수
  onFloorSelect: PropTypes.func.isRequired, // 층수 선택 핸들러
};

export default FloorPlanBtn;
