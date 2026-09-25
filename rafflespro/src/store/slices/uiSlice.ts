import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Language = "es" | "en";
export type Theme = "light" | "dark";

interface UiState {
  theme: Theme;
  language: Language;
  sidebarOpen: boolean;
  activeView: string;
  toasts: Toast[];
}

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
}

const saved = {
  theme: (localStorage.getItem("theme") as Theme) || "light",
  language: (localStorage.getItem("language") as Language) || "es",
};

const initialState: UiState = {
  theme: saved.theme,
  language: saved.language,
  sidebarOpen: true,
  activeView: "dashboard",
  toasts: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.theme);
    },
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
      localStorage.setItem("theme", state.theme);
    },
    toggleLanguage(state) {
      state.language = state.language === "es" ? "en" : "es";
      localStorage.setItem("language", state.language);
    },
    setLanguage(state, action: PayloadAction<Language>) {
      state.language = action.payload;
      localStorage.setItem("language", state.language);
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setActiveView(state, action: PayloadAction<string>) {
      state.activeView = action.payload;
    },
    addToast(state, action: PayloadAction<Omit<Toast, "id">>) {
      state.toasts.push({ ...action.payload, id: Date.now().toString() });
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  toggleTheme, setTheme, toggleLanguage, setLanguage,
  toggleSidebar, setActiveView, addToast, removeToast,
} = uiSlice.actions;
export default uiSlice.reducer;
