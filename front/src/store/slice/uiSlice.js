import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sideMenuOpen: false, // 사이드 메뉴 열림 상태
  activeModal: null, // 활성화된 모달
  searchVisible: false, // 검색창 표시 여부
  loading: false, // 로딩상태
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSideMenu: (state) => {
      state.sideMenuOpen = !state.sideMenuOpen;
    },
    setActiveModal: (state, action) => {
      state.activeModal = action.payload;
    },
    setSearchVisible: (state, action) => {
      state.searchVisible = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { toggleSideMenu, setActiveModal, setSearchVisible, setLoading } =
  uiSlice.actions;

export default uiSlice.reducer;
