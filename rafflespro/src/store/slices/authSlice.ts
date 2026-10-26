import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Company {
  id: number;
  name: string;
  taxId: string;
  logoURL: string;
  plan: "starter" | "pro" | "enterprise";
  color: string;
}

export interface User {
  id: number;
  name: string;
  email?: string;
  avatar: string;
  roleId: number;
  rolePermissions?: string[];
  companies: Company[];
}

interface AuthState {
  user: User | null;
  activeCompany: Company | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
}

const initialState: AuthState = {
  user: null,
  activeCompany: null,
  accessToken: null,
  isAuthenticated: false,
  rememberMe: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ token: string; user: any }>) {
      state.accessToken = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    updateUser(state, action: PayloadAction<{ user: any }>) {
      state.user = action.payload.user;
    },
    selectCompany(state, action: PayloadAction<Company>) {
      state.activeCompany = action.payload;
    },
    logout(state) {
      state.user = null;
      state.activeCompany = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
    refreshTokens(state, action: PayloadAction<{ accessToken: string }>) {
      state.accessToken = action.payload.accessToken;
    },
  },
});

export const { login, logout, updateUser, selectCompany, refreshTokens } = authSlice.actions;
export default authSlice.reducer;