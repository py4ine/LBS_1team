import React, { useRef, useState, useEffect } from "react";
import { setActivePage } from "../websocketManager";

function Cctv_2() {
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
                    <h1>Live Video Stream</h1>
                    <img ref={videoRef} alt="Live Stream" style={{ width: '100%', height: 'auto' }} />
                    <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Count: {count}</p>
                </div>
            )
        }

export default Cctv_2;