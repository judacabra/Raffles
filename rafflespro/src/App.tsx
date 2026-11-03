import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";

import { useAppSelector } from "./store/hooks";
import { Theme } from "./store/slices/uiSlice";

import AppRouter from "./router/AppRouter";
import ToastContainer from "./components/ToastContainer";

import { CONFIG } from "../config-global";

export default function App() {
  const theme: Theme = useAppSelector((s) => s.ui.theme);
  const { appName } = CONFIG;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    document.title = appName;
  }, [appName]);

  return (
    <BrowserRouter>
      <AppRouter />
      <ToastContainer />
    </BrowserRouter>
  );
}