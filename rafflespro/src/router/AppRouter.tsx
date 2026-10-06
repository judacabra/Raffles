import { Navigate, Route, Routes } from "react-router-dom";

import LoginPage from "../pages/admin/LoginPage";
import CompanySelect from "../pages/admin/CompanySelect";
import Dashboard from "../pages/admin/Dashboard";
import RafflesPage from "../pages/admin/RafflesPage";
import RaffleEditor from "../pages/admin/RaffleEditor";
import NumberBoard from "../pages/admin/NumberBoard";
import UsersPage from "../pages/admin/UsersPage";
import LogsPage from "../pages/admin/LogsPage";
import CompaniesPage from "../pages/admin/CompanyPage";
import ProfilePage from "../pages/admin/ProfilePage";
import SearchPage from "../pages/admin/SearchPage";

import ProtectedRoute from "./ProtectedRouted";
import AppShell from "./AppShell";
import NotFoundRedirect from "./NotFoundRedirect";

export default function AppRouter() {
  return (
    <Routes>

      {/* PUBLICS */}
      <Route path="/login" element={<LoginPage />} />


      {/* PRIVATES */}
      <Route element={<ProtectedRoute />}>

        {/* El layout SOLO existe en rutas privadas */}
        <Route element={<AppShell />}>
          <Route path="/select-company" element={ <CompanySelect /> } />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/raffles" element={<RafflesPage />} />
          <Route path="/raffles/editor" element={<RaffleEditor />} />
          <Route path="/board" element={<NumberBoard />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/logs" element={<LogsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/search" element={<SearchPage />} />
        </Route>
      </Route>

      {/* ROOT / 404 */}
      <Route path="/" element={<NotFoundRedirect />} />
      <Route path="*" element={<NotFoundRedirect />} />
    </Routes>
  );
}