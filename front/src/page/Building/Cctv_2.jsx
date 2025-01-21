import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Layout/Header";
import backArrowIcon from "../../assets/images/map_icons/bg/icon_backarrow_BG.png";
import "../../assets/css/cctv.css";
import { setActivePage } from "../websocketManager";


function Cctv_2() {

    const navigate = useNavigate();
    const { bldgId, flplanId } = useParams();
    const location = useLocation(); // 이전 페이지에서 전달된 데이터(state) 가져오기 (찬진)
    const caseData = location.state?.caseData; // (찬진)
    const fs_code = location.state.fs_code; // (찬진)
    const handleBackClick = () => {
    navigate(`/map/${bldgId}/${flplanId}`, {
        state: {
            caseData: caseData,
            fs_code: fs_code,
        },
    });
    };
    const videoRef = useRef(null);  // 비디오를 렌더링할 <img> 태그 참조
    const [count, setCount] = useState(0);

    useEffect(() => {

        setActivePage("cctv_2");
        
        const handleCctvUpdate = (event) => {
                    const { frame, source } = event.detail;
                    if (source === 'cctv_2') {
                        const blob = new Blob([frame], { type: "image/jpeg" });
                        const url = URL.createObjectURL(blob);
                        if (videoRef.current) {
                            videoRef.current.src = url;
                        }
                    }
                };
        
        const handleTextUpdate = (event) => {
            const { count: newCount, source } = event.detail;
            if (source === 'cctv_2') {
                setCount(newCount);
            }
        };

        window.addEventListener("cctvUpdate", handleCctvUpdate);
        window.addEventListener("countingUpdate", handleTextUpdate)

        return () => {
            setActivePage(null);  // 페이지 비활성화
            window.removeEventListener("cctvUpdate", handleCctvUpdate);
            window.removeEventListener("countingUpdate", handleTextUpdate);
        };
    }, []);

    return (
        <div>
            <Header />
            <div>
            <div className="backArea">
                <img
                src={backArrowIcon}
                alt="뒤로가기"
                className="back-icon"
                onClick={handleBackClick}
                />
            </div>
            <div className="streaming">
                <h1>Live Video Stream</h1>
                <img
                ref={videoRef}
                alt="Live Stream"
                style={{ width: "100%", height: "auto" }}
                />
                <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Count: {count}</p>
            </div>
            </div>
        </div>
    );
}

export default Cctv_2;