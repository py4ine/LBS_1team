import React, { useEffect, useState } from "react";
import "../assets/css/main.css";
import Header from "../components/Layout/Header";
import main_img from "../assets/images/img/main.png";
import arrow_G from "../assets/images/button_icons/icon_leftarrow_G.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCases, setCurrentCase, setError } from "../store/slice/caseSlice";

function Main() {
  const navigate = useNavigate(); // 네비게이션 훅
  const dispatch = useDispatch();
  const { cases, loading, error } = useSelector((state) => state.cases);
  const { fs_code, isAuthenticated } = useSelector((state) => state.auth);

  // const [caseData, setCaseData] = useState(); // 사건 데이터 저장
  // const [loading, setLoading] = useState(true); // 로딩 상태 관리
  // const [error, setError] = useState(null); // 에러 상태 관리
  // const location = useLocation();
  // const fs_code = location.state?.fs_code; // 소방서 코드

  // useEffect
  useEffect(() => {
    console.log(fs_code);

    // 소방서 코드 없을때 로그인페이지 이동 (전)
    // if (!fs_code) {
    //   navigate("/login");
    //   return;
    // }

    // 소방서 코드 없을때 로그인페이지 이동 (후)
    // if (!isAuthenticated) {
    //   navigate("/login");
    //   return;
    // }

    const fetchCaseData = async () => {
      try {
        // API 호출
        const res = await fetch(
          // `http://localhost:8080/api/cases?dispatch_fire_station=${fs_code}`
          `https://node-kimhojun-dot-winged-woods-442503-f1.du.r.appspot.com/cases?dispatch_fire_station=${fs_code}`
          // `https://lbsteam1.duckdns.org/api//cases?dispatch_fire_station=${fs_code}`
        );

        // 응답 상태 확인
        if (!res.ok) {
          throw new Error("Network res was not ok");
        }

        // JSON 데이터
        const data = await res.json();
        dispatch(setCases(data.data)); // 데이터 저장 (후)

        // 백엔드 데이터 저장 (전)
        // setCaseData(data.data);
      } catch (error) {
        // setError(error.message); (전)
        dispatch(setError(error.message)); // 에러 상태 저장
        console.error("Error fetching case data:", err);
      }
      // finally {
      //   setLoading(false);
      // } // (전)
    };

    fetchCaseData();
  }, [dispatch, fs_code, isAuthenticated, navigate]);

  // 사건 클릭시 지도페이지 이동 (전)
  // const handleCaseClick = (data) => {
  //   navigate("/map", {
  //     state: {
  //       caseData: data,
  //       fs_code: fs_code,

  //       // coordinates: {
  //       //   lat: data.latitude,
  //       //   lng: data.longitude,
  //       // },
  //     },
  //   });
  // };

  // 사건 클릭시 지도페이지 이동 (후)
  const handleCaseClick = (data) => {
    dispatch(setCurrentCase(data)); // 선택된 사건 정보 저장
    navigate("/map");
  };

  // 출동 현장 데이터
  // const caseData = [
  //   {
  //     id: 1,
  //     type: "화재", // 사건 분류
  //     bldgName: "가산 현대테라타워", //건물명
  //     address: "서울특별시 금천구 가산디지털로", // 주소
  //     incidentNumber: "63418", // 신고 사건 번호
  //   },

  //   {
  //     id: 2,
  //     type: "구급", // 사건 분류
  //     bldgName: "가산 현대SK타워", //건물명
  //     address: "서울특별시 금천구 가산디지털로", // 주소
  //     incidentNumber: "85234", // 신고 사건 번호
  //   },

  //   {
  //     id: 3,
  //     type: "화재", // 사건 분류
  //     bldgName: "LG 가산 디지털센터", //건물명
  //     address: "서울특별시 금천구 가산디지털로", // 주소
  //     incidentNumber: "23882", // 신고 사건 번호
  //   },
  // ];

  //  사건 번호 타입별 이름 -> 구조 / 화재 / 구급 / 생활안전
  const getIncidentTypeName = (type) => {
    switch (type) {
      case 1:
        return "구조";
      case 2:
        return "화재";
      case 3:
        return "구급";
      case 4:
        return "생활안전";
      default:
        return "기타";
    }
  };

  const CaseItem = ({ data }) => (
    <button className="caseItemBtn" onClick={() => handleCaseClick(data)}>
      <div className="caseItemWrap">
        <div className="caseItemContent">
          <p>사건 분류 : {getIncidentTypeName(data.incident_type)}</p>
          <p>건물명 : {data.bldg_nm}</p>
          <p>주소 : {data.road_nm_addr}</p>
          <p>신고 사건 번호 : {data.incident_number}</p>
        </div>
        <div>
          <img src={arrow_G} />
        </div>
      </div>
    </button>
  );

  // 로딩중 표시할 내용
  if (loading) return <div>Loading...</div>;

  // 에러 발생시 표시할 내용
  // if (error) return <div>Error: {error}</div>;

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
            {/* (전) */}
            {/* {caseData.map((item) => (
              <CaseItem key={item.case_id} data={item} />
            ))} */}
            {cases &&
              cases.map((item) => <CaseItem key={item.case_id} data={item} />)}
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
