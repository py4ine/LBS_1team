import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentCase: null, // 현재 선택된 사건
  cases: [], // 모든 사건 목록
  bldgDetail: null, // 빌딩 정보
  loading: false, // 로딩상태
  error: null, // 에러상태
};

const caseSlice = createSlice({
  name: "cases",
  initialState,
  reducers: {
    setCases: (state, action) => {
      state.cases = action.payload;
      state.loading = false;
    },
    setCurrentCase: (state, action) => {
      state.currentCase = action.payload;
    },
    setBldgDetail: (state, action) => {
      state.bldgDetail = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setCases, setCurrentCase, setBldgDetail, setLoading, setError } =
  caseSlice.actions;
export default caseSlice.reducer;
