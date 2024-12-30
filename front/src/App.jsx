import React from "react";
import { Route, Routes } from "react-router-dom";
import Main from "./page/Main.jsx";
import Style from "./Style.jsx";
import BuildingDetail from "./page/Building/BuildingDetail.jsx";
import Menu from "./page/Menu/Menu.jsx";
import CaseList from "./page/Menu/CaseList.jsx";
import FloorPlan from "./page/Building/FloorPlan.jsx";

import "./assets/css/index.css";
import Login from "./page/Login.jsx";
import Cctv from "./page/Building/Cctv.jsx";

function App() {
  return (
    <>
      <Routes>
        {/* 스타일 가이드 */}
        <Route path="/style" element={<Style />}></Route>

        {/* 로그인 페이지 */}
        <Route path="/login" element={<Login />}></Route>

        {/* 메인 페이지 */}
        <Route path="/" element={<Main />}></Route>

        {/* 메뉴 페이지 */}
        <Route path="/menu" element={<Menu />}></Route>

        {/* 사건관련 페이지 */}
        <Route path="/case" element={<CaseList />}></Route>
        <Route path="/case/:caseId" element={<BuildingDetail />}></Route>
        <Route path="/case/:caseId/:flplanId" element={<FloorPlan />}></Route>

        {/* CCTV 페이지 */}
        <Route path="/case/:caseId/:flplanId/cctv" element={<Cctv />}></Route>
      </Routes>
    </>
  );
}

export default App;
