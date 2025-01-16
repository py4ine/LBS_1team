// // import React, { useRef, useEffect } from "react";
// // import Hls from "hls.js";

// // function Cctv() {
// //     const videoRef = useRef(null);

// //     useEffect(() => {
// //         if (Hls.isSupported()) {
// //             const hls = new Hls();
// //             hls.loadSource("http://localhost:8080/hls/output.m3u8");
// //             hls.attachMedia(videoRef.current);
// //         } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
// //             videoRef.current.src = "http://localhost:8080/hls/output.m3u8";
// //         }
// //     }, []);

// //     return (
// //         <div>
// //             <h1>Live CCTV Stream</h1>
// //             <video ref={videoRef} controls autoPlay muted style={{ width: "100%", height: "auto" }} />
// //         </div>
// //     );
// // }

// // export default Cctv;
// import React, { useEffect, useRef } from "react";
// import Hls from "hls.js";

// function Cctv() {
//   const videoRef = useRef(null);

//   useEffect(() => {
//     if (Hls.isSupported()) {
//       const hls = new Hls();
//       // hls.loadSource("http://localhost:8888/mypath/index.m3u8"); // 개인 휴대폰 ip webcam URL
//       hls.loadSource("https://www.youtube.com/watch?v=FjcBF96anS4");
//       // 도로 상황 cctv
//       hls.attachMedia(videoRef.current);
//     }
//   }, []);

//   return (
//     <div>
//       <h1>Live CCTV Stream (HLS)</h1>
//       <video
//         ref={videoRef}
//         controls
//         autoPlay
//         muted
//         style={{ width: "100%", height: "auto" }}
//       />
//     </div>
//   );
// }

// export default Cctv;

import React from "react";

function Cctv() {
  return (
    <div>
      <h1>Live CCTV Stream (YouTube)</h1>
      <iframe
        width="100%"
        height="500px"
        src="https://www.youtube.com/embed/FjcBF96anS4"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}

export default Cctv;
