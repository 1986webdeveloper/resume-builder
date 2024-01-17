import { createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  value: boolean;
}

const initialState: AuthState = {
  value: localStorage.getItem("token") ? true : false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state) => {
      state.value = true;
    },
    logout: (state) => {
      state.value = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
