import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { setActiveView } from "./store/slices/uiSlice";

import LoginPage from "./pages/admin/LoginPage";
import CompanySelect from "./pages/admin/CompanySelect";
import Dashboard from "./pages/admin/Dashboard";
import RafflesPage from "./pages/admin/RafflesPage";
import RaffleEditor from "./pages/admin/RaffleEditor";
import NumberBoard from "./pages/admin/NumberBoard";
import UsersPage from "./pages/admin/UsersPage";
import LogsPage from "./pages/admin/LogsPage";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ToastContainer from "./components/ToastContainer";
import CompaniesPage from "./pages/admin/CompanyPage";

function AppShell() {
  const activeView = useAppSelector((s) => s.ui.activeView);
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);

  const views: Record<string, React.ReactNode> = {
    dashboard: <Dashboard />,
    companies: <CompaniesPage />,
    raffles:   <RafflesPage />,
    editor:    <RaffleEditor />,
    board:     <NumberBoard />,
    users:     <UsersPage />,
    logs:      <LogsPage />,
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg)", overflow: "hidden" }}>
      <Sidebar open={sidebarOpen} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Header />
        <main style={{ flex: 1, overflow: "auto" }}>
          {views[activeView] ?? <Dashboard />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const theme = useAppSelector((s) => s.ui.theme);
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const activeCompany = useAppSelector((s) => s.auth.activeCompany);
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();

  // Apply dark mode to document root
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Reset to dashboard when company changes
  useEffect(() => {
    if (activeCompany) dispatch(setActiveView("dashboard"));
  }, [activeCompany?.id]);

  if (!isAuthenticated) return (
    <>
      <LoginPage />
      <ToastContainer />
    </>
  );

  if (!activeCompany && user && user.companies.length > 1) return (
    <>
      <CompanySelect />
      <ToastContainer />
    </>
  );

  return (
    <>
      <AppShell />
      <ToastContainer />
    </>
  );
}
