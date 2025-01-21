import { createSlice } from "@reduxjs/toolkit";

// 초기 상태 설정
const initialState = {
  isAuthenticated: false,
  fs_code: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth", // 슬라이스 이름
  initialState, // 초기 상태
  reducers: {
    // 로그인 성공시
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.fs_code = action.payload.fs_code;
      state.error = null;
    },

    // 로그인 실패시
    loginFail: (state, action) => {
      state.isAuthenticated = false;
      state.error = action.payload;
    },

    // 로그아웃시
    logout: (state) => {
      state.isAuthenticated = false;
      state.fs_code = null;
      state.error = null;
    },
  },
});

export const { loginSuccess, loginFail, logout } = authSlice.actions;
export default authSlice.reducer;
