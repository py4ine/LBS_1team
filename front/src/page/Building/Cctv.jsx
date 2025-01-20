import React, { useRef, useState, useEffect } from "react";
import { setActivePage } from "../websocketManager";

function Cctv() {
    const videoRef = useRef(null);  // 비디오를 렌더링할 <img> 태그 참조
    const [count, setCount] = useState(0);

    useEffect(() => {

        setActivePage("cctv");
        
        const handleCctvUpdate = (event) => {
            const { frame, source } = event.detail;
            if (source === 'cctv') {
                const blob = new Blob([frame], { type: "image/jpeg" });
                const url = URL.createObjectURL(blob);
                if (videoRef.current) {
                    videoRef.current.src = url;
                }
            }
            
            // const blob = new Blob([event.detail.frame], { type: "image/jpeg" });
            // const url = URL.createObjectURL(blob);
            // if (videoRef.current) {
            //     videoRef.current.src = url; // 이미지 URL로 비디오 프레임 업데이트
            // }
        };

        const handleTextUpdate = (event) => {
            const { count: newCount, source } = event.detail;
            if (source === 'cctv') {
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
            <h1>Live Video Stream</h1>
            <img ref={videoRef} alt="Live Stream" style={{ width: '100%', height: 'auto' }} />
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Count: {count}</p>
        </div>
    )
}

export default Cctv;