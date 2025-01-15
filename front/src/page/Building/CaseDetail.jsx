// import React from "react";
// import Header from "../../components/Layout/Header";

// function CaseDetail() {
//   return (
//     <>
//       <Header />
//       <div className="main_container">CaseDetail</div>
//     </>
//   );
// }

// export default CaseDetail;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Layout/Header";
import "../../assets/css/casedetail.css";

function CaseDetail() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // useNavigate 훅 사용
  const { bldgId } = useParams(); // useParams로 caseId 가져오기 (찬진)

  const handleClick = () => {
    navigate(`/map/${bldgId}/1`, {
      state: {
        gro_flo_co: data.gro_flo_co,
        und_flo_co: data.und_flo_co,
      }, // 데이터 같이 이동 (찬진)
    }); // 이동할 경로
  };
  const handleClick2 = () => {
    navigate("/map", {
      state: {
        gro_flo_co: data.gro_flo_co,
        und_flo_co: data.und_flo_co,
      },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://node-kimhojun-dot-winged-woods-442503-f1.du.r.appspot.com/details/${bldgId}`);
        const responseimg = await fetch(`https://node-kimhojun-dot-winged-woods-442503-f1.du.r.appspot.com/images/${bldgId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        const resultimg = await response.json();

        setData(result.data[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const preloadImages = [
      resultimg.flo_pl,
      "https://storage.cloud.google.com/lbsteam1/images.png",
      "https://storage.cloud.google.com/lbsteam1/png-clipart-pokemon-pikachu-pikachu-pokemon-games-pokemon-thumbnail.png",
      "https://storage.cloud.google.com/lbsteam1/png-transparent-doraemon-miffy-desktop-doraemon-thumbnail.png",
      "https://storage.cloud.google.com/lbsteam1/png-transparent-ghibli-museum-studio-ghibli-animation-animation-food-studio-head-thumbnail.png",
      "https://storage.cloud.google.com/lbsteam1/png-transparent-computer-icons-test-event-miscellaneous-text-logo.png",
      "https://storage.cloud.google.com/lbsteam1/image.png",
    ];

    // 이미지 객체를 만들어 브라우저가 캐싱하도록 함
    preloadImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data found</div>;

  return (
    <>
      <Header />
      <div className="main_container">
        <div className="case_detail_container">
          <div className="css-x-button" onClick={handleClick2}></div>
          <h2>
            <strong>출동 정보</strong>
          </h2>
          <div className="case_detail_container2">
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

          <div className="flex-container">
            <div className="flex-container1">
              <p>
                <strong>신고자 전화번호:</strong>
              </p>
            </div>
            <div>
              <p>010-1234 5678</p>
            </div>
          </div>

          <div className="flex-container">
            <div className="flex-container1">
              <p>
                <strong>신고 내용:</strong>
              </p>
            </div>

            <div>
              <p>
                21층 강의실 안에서 탄내가 나서 복도를 나와보니 연기가 난다고 함.
                화재 의심이 되고, 사람들이 건물 밖으로 여러 명이 이동 중이라고
                함. 건물 불이 번지는 것으로 추정.
              </p>
            </div>
          </div>

          <div className="flex-container">
            <div className="flex-container1">
              <p>
                <strong>장애 여부:</strong>
              </p>
            </div>
            <div>
              <p>1명/청각 장애 2급/남자</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CaseDetail;
