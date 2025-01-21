import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { connectWebSocket } from "./page/websocketManager.js";

import "./assets/css/index.css";

// import Style from "./Style.jsx";
import Login from "./page/Login.jsx";
import Main from "./page/Main.jsx";
import Map from "./page/Map.jsx";
import CaseDetail from "./page/Building/CaseDetail.jsx";
import FloorPlan from "./page/Building/FloorPlan.jsx";
import Cctv from "./page/Building/Cctv.jsx";
import Cctv_2 from "./page/Building/Cctv_2.jsx";
import Counting from "./page/Building/Counting.jsx";
import { Provider } from "react-redux";
import { persistor, store } from "./store/store.js";
import { PersistGate } from "redux-persist/integration/react";

function App() {
  useEffect(() => {
    connectWebSocket(); // 컴포넌트가 마운트되면 웹소켓 연결
  }, []);

  return (
    <>
      {/* Redux를 사용하기위해 Provider 추가 */}
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Routes>
            {/* 스타일 가이드 */}
            {/* <Route path="/style" element={<Style />}></Route> */}
            {/* 초기 경로 로그인으로 연결 */}
            <Route path="/" element={<Navigate to="/login" />} />
            {/* 로그인 페이지 */}
            <Route path="/login" element={<Login />}></Route>
            {/* 메인 페이지 */}
            <Route path="/main" element={<Main />}></Route>
            {/* 지도 페이지 */}
            <Route path="/map" element={<Map />}></Route>
            {/* 상세 페이지 */}
            <Route path="/map/:bldgId" element={<CaseDetail />}></Route>
            <Route
              path="/map/:bldgId/:flplanId"
              element={<FloorPlan />}
            ></Route>
            {/* CCTV 페이지 */}
            <Route
              path="/map/:bldgId/:flplanId/cctv"
              element={<Cctv />}
            ></Route>
            {/* CCTV 페이지 */}
            <Route
              path="/map/:bldgId/:flplanId/cctv2"
              element={<Cctv_2 />}
            ></Route>
            {/* Counting 페이지 */}
            <Route path="/counting" element={<Counting />}></Route>
          </Routes>
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
