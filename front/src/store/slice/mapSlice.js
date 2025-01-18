import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  center: null, // 지도 중심 좌표
  zoom: 15, // 줌 레벨
  markers: [], // 마커들
  waterFacilities: [], // 용수시설 목록
  dangerFacilities: [], // 위험시설 목록
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setMapCenter: (state, action) => {
      state.center = action.payload;
    },
    setMapZoom: (state, action) => {
      state.zoom = action.payload;
    },
    setMarkers: (state, action) => {
      state.markers = action.payload;
    },
    setWaterFacilities: (state, action) => {
      state.waterFacilities = action.payload;
    },
    setDangerFacilities: (state, action) => {
      state.dangerFacilities = action.payload;
    },
  },
});

export const {
  setMapCenter,
  setMapZoom,
  setMarkers,
  setWaterFacilities,
  setDangerFacilities,
} = mapSlice.actions;

export default mapSlice.reducer;
