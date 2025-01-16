import React, { useRef, useState, useEffect } from "react";
import { setActivePage } from "../websocketManager";

function Cctv_2() {
    const videoRef = useRef(null);  // 비디오를 렌더링할 <img> 태그 참조
    const [count, setCount] = useState(0);

    useEffect(() => {

        setActivePage("cctv_2");
        
        const handleCctvUpdate = (event) => {
            const blob = new Blob([event.detail.frame], { type: "image/jpeg" });
            const url = URL.createObjectURL(blob);
            if (videoRef.current) {
                videoRef.current.src = url; // 이미지 URL로 비디오 프레임 업데이트
            }
        };

        window.addEventListener("cctvUpdate", handleCctvUpdate);

        return () => {
            setActivePage(null);  // 페이지 비활성화
            window.removeEventListener("cctvUpdate", handleCctvUpdate);
        };
    }, []);

    return (
        <div>
            <h1>Live Video Stream 2</h1>
            <img ref={videoRef} alt="Live Stream" style={{ width: '100%', height: 'auto' }} />
        </div>
    )
}

export default Cctv_2;