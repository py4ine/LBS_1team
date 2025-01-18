import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentCase: null, // 현재 선택된 사건
  cases: [], // 모든 사건 목록
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
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setCases, setCurrentCase, setLoading, setError } =
  caseSlice.actions;
export default caseSlice.reducer;
