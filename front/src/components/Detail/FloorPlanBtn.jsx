import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function FloorPlanBtn() {
  const { caseId, flplanId } = useParams(); // 층수 useparams
  const navigate = useNavigate(); // useNavigate
  const [btnOpen, setBtnOpen] = useState(false); // 층별 설계도 버튼 상태 저장소
  const [floors, setFloors] = useState([]); // API 층수 배열 저장

  useEffect(() => {
    fetchBldgData = async () => {
      try {
        // API 호출
        const res = await fetch(`/api 호출 주소`);
        const data = await res.json();

        // 지하 층수 배열
        const belowFloors = Array.from(
          { length: data.belowFloors }, // 데이터 가져오는것
          (_, i) => -(i + 1)
        ).reverse();

        // 지상 층수 배열
        const aboveFloors = Array.from(
          { length: data.aboveFloors }, // 데이터 가져오는것
          (_, i) => i + 1
        );

        // 모든 총 층수 배열
        setFloors([...belowFloors, ...aboveFloors]);
      } catch (error) {
        console.error("Error Fetching Bldg data", error);
      }
    };

    fetchBldgData();
  }, [caseId]);

  const formatFloorLabel = (floor) => {
    if (floor < 0) return `B${Math.abs(floor)}F`;
    return `${floor}F`;
  };

  // 층수 선택 핸들러
  const handleFloorSelect = (selectedFloor) => {
    navigate("./${selectedFloor}");
    setBtnOpen(false);
  };

  return <>{btnOpen && <div>floors.map</div>}</>;
}

export default FloorPlanBtn;
