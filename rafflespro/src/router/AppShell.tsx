import { Location, Outlet, useLocation } from "react-router-dom";

import { useAppSelector } from "../store/hooks";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const AppShell = () => {
  const sidebarOpen: boolean = useAppSelector((s) => s.ui.sidebarOpen);
  
  const location: Location = useLocation();
  const isSelectCompany: boolean = location.pathname === "/select-company";

  return (
    <div
      style={{
        display: "flex", height: "100vh",
        background: "var(--bg)", overflow: "hidden",
      }}
    >
      {!isSelectCompany && <Sidebar open={sidebarOpen} />}

      <div
        style={{
          flex: 1, flexDirection: "column",
          display: "flex", overflow: "hidden",
        }}
      >
        {!isSelectCompany && <Header />}

        <main style={{ flex: 1, overflow: "auto", }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppShell;