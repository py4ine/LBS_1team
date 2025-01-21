import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Layout/Header";
import "../../assets/css/casedetail.css";
import { useDispatch, useSelector } from "react-redux";
import { setBldgDetail } from "../../store/slice/caseSlice";

function CaseDetail() {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const { bldgId } = useParams(); // useParams로 caseId 가져오기 (찬진)
  const dispatch = useDispatch();
  // const location = useLocation(); // (찬진)
  // const caseData = location.state?.caseData;
  // const fs_code = location.state.fs_code; // (찬진)

  // redux store에서 현재 사건 정보와 인증정보 가져오기
  const currentCase = useSelector((state) => state.cases.currentCase);
  const { fs_code } = useSelector((state) => state.auth);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 사건정보 상태 저장소
  // const [caseData, setCaseData] = useState(null); // 사건정보 데이터 저장소 (찬진)
  // const [caseError, setCaseError] = useState(null);
  // const [caseLoading, setCaseLoading] = useState(true);

  useEffect(() => {
    // redux store에서 현재 사건 데이터가 없으면 메인으로
    // if (!currentCase) {
    //   navigate("/main");
    //   return;
    // }

    const fetchData = async () => {
      try {
        const response = await fetch(
          // `https://node-kimhojun-dot-winged-woods-442503-f1.du.r.appspot.com/details/${bldgId}`
          `https://lbsteam1.duckdns.org/api//details/${bldgId}`
        );
        // const responseimg = await fetch(
        //   `https://node-kimhojun-dot-winged-woods-442503-f1.du.r.appspot.com/images/${bldgId}`
        // );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        // const resultimg = await responseimg.json();

        setData(result.data[0]);
        // redux store에 저장
        dispatch(setBldgDetail(result.data[0]));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // const preloadImages = [
    //   "https://storage.cloud.google.com/lbsteam1/image%203.png",
    //   "https://storage.cloud.google.com/lbsteam1/images.png",
    //   "https://storage.cloud.google.com/lbsteam1/png-clipart-pokemon-pikachu-pikachu-pokemon-games-pokemon-thumbnail.png",
    //   "https://storage.cloud.google.com/lbsteam1/png-transparent-doraemon-miffy-desktop-doraemon-thumbnail.png",
    //   "https://storage.cloud.google.com/lbsteam1/png-transparent-ghibli-museum-studio-ghibli-animation-animation-food-studio-head-thumbnail.png",
    //   "https://storage.cloud.google.com/lbsteam1/png-transparent-computer-icons-test-event-miscellaneous-text-logo.png",
    //   "https://storage.cloud.google.com/lbsteam1/image.png",
    // ];

    // // 이미지 객체를 만들어 브라우저가 캐싱하도록 함
    // preloadImages.forEach((src) => {
    //   const img = new Image();
    //   img.src = src;
    // });
  }, [bldgId, currentCase, navigate]);

  const handleClick = () => {
    navigate(`/map/${bldgId}/1`); // 이동할 경로
  };
  // const handleClick = () => {
  //   navigate(`/map/${bldgId}/1`, {
  //     state: {
  //       caseData: caseData,
  //       gro_flo_co: data.gro_flo_co,
  //       und_flo_co: data.und_flo_co,
  //       fs_code: fs_code,
  //     }, // 데이터 같이 이동 (찬진)
  //   }); // 이동할 경로
  // };

  // 닫기 버튼 클릭시 이전 데이터 다시 반환
  const handleClick2 = () => {
    navigate("/map");
  };
  // const handleClick2 = () => {
  //   navigate("/map", {
  //     state: {
  //       caseData: caseData,
  //       fs_code: fs_code,
  //     },
  //     // state: {
  //     //   gro_flo_co: data.gro_flo_co,
  //     //   und_flo_co: data.und_flo_co,
  //     // },
  //   });
  // };

  //   사건정보 내용 useEffect (찬진)
  // useEffect(() => {
  //   const fetchCaseData = async () => {
  //     try {
  //       const res = await fetch(
  //         `http://localhost:8080/cases/?dispatch_fire_station=101`
  //       );
  //       if (!res.ok) {
  //         throw new Error("Failed to fetch caseData");
  //       }
  //       const caseResult = await res.json();
  //       setCaseData(caseResult);
  //     } catch (error) {
  //       setCaseError(error.message);
  //     } finally {
  //       setCaseLoading(false);
  //     }
  //   };

  //   fetchCaseData();
  // }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data found</div>;

  return (
    <>
      <Header />
      <div className="main_container case_detail_All">
        <div className="case_detail_container">
          <div className="css-x-button1" onClick={handleClick2}></div>
          <h2>
            <strong>출동 정보</strong>
          </h2>
          <div className="case_detail_wrap">
            <div className="flex-container">
              <div className="flex-container1">
                <p>
                  <strong>건물명:</strong>
                </p>
              </div>
              <div>
                <p>{data.bldg_nm}</p>
              </div>
            </div>

            <div className="flex-container">
              <div className="flex-container1">
                <p>
                  <strong>도로명 주소:</strong>
                </p>
              </div>
              <div>
                <p>{data.road_nm_addr}</p>
              </div>
            </div>

            <div className="flex-container">
              <div className="flex-container1">
                <p>
                  <strong>지번 주소:</strong>
                </p>
              </div>
              <div>
                <p>{data.lotno_addr}</p>
              </div>
            </div>

            <div className="flex-container">
              <div className="flex-container1">
                <p>
                  <strong>지상 층수:</strong>
                </p>
              </div>
              <div>
                <p>{data.gro_flo_co}층</p>
              </div>
            </div>

            <div className="flex-container">
              <div className="flex-container1">
                <p>
                  <strong>지하 층수:</strong>
                </p>
              </div>
              <div>
                <p>{data.und_flo_co}층</p>
              </div>
            </div>

            <div className="flex-container">
              <div className="flex-container1">
                <p>
                  <strong>건물 용도:</strong>
                </p>
              </div>
              <div>
                <p>{data.bdtyp}</p>
              </div>
            </div>

            <div className="flex-container">
              <div className="flex-container1">
                <p>
                  <strong>건축물 구조:</strong>
                </p>
              </div>
              <div>
                <p>{data.bdst}</p>
              </div>
            </div>

            <div className="flex-container">
              <div className="flex-container1">
                <p>
                  <strong>내진 설계 여부:</strong>
                </p>
              </div>
              <div>
                <p>{data.bd_seismic === 1 ? "O" : "X"}</p>
              </div>
            </div>

            <div className="flex-container">
              <div className="flex-container1">
                <p>
                  <strong>건축 년도:</strong>
                </p>
              </div>
              <div>
                <p>{data.bd_old}</p>
              </div>
            </div>

            <div className="flex-container">
              <div className="flex-container1">
                <p>
                  <strong>현재 인원 수:</strong>
                </p>
              </div>
              <div>
                <p>준비중</p>
              </div>
            </div>

            <div className="case_detail_button">
              <button className="detail-button" onClick={handleClick}>
                <strong>건물 설계 상세 도면보기</strong>
              </button>
            </div>
          </div>

          <h2>
            <strong className="stronger">신고 내용</strong>
          </h2>

          <div className="flex-container flex-wrap">
            <div className="flex-container1">
              <p>
                <strong>신고자 전화번호:</strong>
              </p>
            </div>
            <div>
              <p>{currentCase.report_phone}</p>
            </div>
          </div>

          <div className="flex-container flex-wrap">
            <div className="flex-container1">
              <p>
                <strong>신고 내용:</strong>
              </p>
            </div>
            <div>
              <p>{currentCase.report_type}</p>
            </div>
          </div>

          <div className="flex-container flex-wrap">
            <div className="flex-container1">
              <p>
                <strong>장애 여부:</strong>
              </p>
            </div>
            <div>
              <p>{currentCase.disabled_person}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CaseDetail;
