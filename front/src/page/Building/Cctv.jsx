import React, { useRef, useState, useEffect } from "react";
import { setActivePage } from "../websocketManager";

function Cctv() {
  const videoRef = useRef(null); // 비디오를 렌더링할 <img> 태그 참조
  const [count, setCount] = useState(0);

  useEffect(() => {
    setActivePage("cctv");

    const handleCctvUpdate = (event) => {
      const blob = new Blob([event.detail.frame], { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);
      if (videoRef.current) {
        videoRef.current.src = url; // 이미지 URL로 비디오 프레임 업데이트
      }
    };

    window.addEventListener("cctvUpdate", handleCctvUpdate);

    return () => {
      setActivePage(null); // 페이지 비활성화
      window.removeEventListener("cctvUpdate", handleCctvUpdate);
    };
  }, []);

  return (
    <div>
      <h1>Live Video Stream</h1>
      <img
        ref={videoRef}
        alt="Live Stream"
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );
  // return (
  //   <div>
  //     <h1>Live CCTV Stream (YouTube)</h1>
  //     <iframe
  //       width="100%"
  //       height="500px"
  //       src="https://www.youtube.com/embed/FjcBF96anS4"
  //       title="YouTube video player"
  //       frameBorder="0"
  //       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  //       allowFullScreen
  //     ></iframe>
  //   </div>
  // );
}

export default Cctv;
