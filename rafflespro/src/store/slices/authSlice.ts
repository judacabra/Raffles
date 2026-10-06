import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Company {
  id: string;
  name: string;
  taxId: string;
  logoURL: string;
  plan: "starter" | "pro" | "enterprise";
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "superadmin" | "admin" | "seller" | "viewer";
  companies: Company[];
}

interface AuthState {
  user: User | null;
  activeCompany: Company | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
}

// const MOCK_COMPANIES: Company[] = [
//   { id: "c1", name: "Rifas El Dorado", logo: "🏆", plan: "pro", color: "#F6AD55" },
//   { id: "c2", name: "Sorteos Express", logo: "🎯", plan: "starter", color: "#48BB78" },
//   { id: "c3", name: "Premios del Norte", logo: "⭐", plan: "enterprise", color: "#1A365D" },
// ];

// const MOCK_USER: User = {
//   id: "u1",
//   name: "Carlos Mendoza",
//   email: "carlos@rifasdorado.com",
//   avatar: "CM",
//   role: "admin",
//   companies: MOCK_COMPANIES,
// };

function loadFromStorage() {
  try {
    const raw = localStorage.getItem("auth");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const stored = loadFromStorage();

const initialState: AuthState = stored ?? {
  user: null,
  activeCompany: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  rememberMe: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ user: any, email: string; password: string; rememberMe: boolean }>) {
      state.user = action.payload.user;
      state.accessToken = "mock-access-token-" + Date.now();
      state.refreshToken = "mock-refresh-token";
      state.isAuthenticated = true;
      state.rememberMe = action.payload.rememberMe;
      if (action.payload.rememberMe) {
        localStorage.setItem("auth", JSON.stringify(state));
      }
    },
    updateUser(state, action: PayloadAction<{ user: any }>) {
      state.user = action.payload.user;
      localStorage.setItem("auth", JSON.stringify(state));
    },
    selectCompany(state, action: PayloadAction<Company>) {
      state.activeCompany = action.payload;
      localStorage.setItem("auth", JSON.stringify(state));
    },
    logout(state) {
      state.user = null;
      state.activeCompany = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("auth");
    },
    refreshTokens(state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
  },
});

export const { login, updateUser, selectCompany, logout, refreshTokens } = authSlice.actions;
export default authSlice.reducer;
