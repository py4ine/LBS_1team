import React from "react";
import "../assets/css/main.css";
import Header from "../components/Layout/Header";
import main_img from "../assets/images/img/main.png";
import arrow_G from "../assets/images/button_icons/icon_leftarrow_G.png";
import { useNavigate } from "react-router-dom";

function Main() {
  const navigate = useNavigate();

  const handleCaseClick = (data) => {
    navigate("/map" /*, { state: { caseData: data } }*/);
  };

  // 출동 현장 데이터
  const caseData = [
    {
      id: 1,
      type: "화재", // 사건 분류
      bldgName: "가산 현대테라타워", //건물명
      address: "서울특별시 금천구 가산디지털로", // 주소
      incidentNumber: "63418", // 신고 사건 번호
    },

    {
      id: 2,
      type: "구급", // 사건 분류
      bldgName: "가산 현대SK타워", //건물명
      address: "서울특별시 금천구 가산디지털로", // 주소
      incidentNumber: "85234", // 신고 사건 번호
    },

    {
      id: 3,
      type: "화재", // 사건 분류
      bldgName: "LG 가산 디지털센터", //건물명
      address: "서울특별시 금천구 가산디지털로", // 주소
      incidentNumber: "23882", // 신고 사건 번호
    },
  ];

  const CaseItem = ({ data }) => (
    <button className="caseItemBtn" onClick={() => handleCaseClick(/*data*/)}>
      <div className="caseItemWrap">
        <div className="caseItemContent">
          <p>사건 분류 : {data.type}</p>
          <p>건물명 : {data.bldgName}</p>
          <p>주소 : {data.address}</p>
          <p>신고 사건 번호 : {data.incidentNumber}</p>
        </div>
        <div>
          <img src={arrow_G} />
        </div>
      </div>
    </button>
  );

  return (
    <>
      <Header />
      <div className="main_container">
        <div className="main_Wrap">
          {/* 메인 헤더 */}
          <div className="main_header">
            <h1>출동 현장</h1>
          </div>

          {/* 메인 컨텐츠 */}
          <div className="main_contentWrap">
            {caseData.map((item) => (
              <CaseItem key={item.id} data={item} />
            ))}
          </div>

          {/* 메인 이미지 */}
          <div className="main_imgWrap">
            <img src={main_img} alt="영이 웅이 일구" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
