import { ReactNode } from "react";
import { Location, Navigate, Route, Routes, useLocation } from "react-router-dom";

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
import FirstLoginPage from "../pages/admin/FirstLoginPage";

import ProtectedRoute from "./ProtectedRouted";
import AppShell from "./AppShell";
import NotFoundRedirect from "./NotFoundRedirect";

import { User } from "../store/slices/authSlice";
import { useAppSelector } from "../store/hooks";

const ALWAYS_ALLOWED_PATHS: string[] = [
  "/login",
  "/first-login",
  "/select-company",
  "/search",
  "/profile",
  "/raffles",
  "/board",
];

const normalize = (p: string): string => p.replace(/^\/+|\/+$/g, "");

function RoleRoute({ children }: { children: ReactNode }) {
  const user: User | null = useAppSelector((s) => s.auth.user);
  
  const location: Location = useLocation();

  const permissions: string[] = user?.rolePermissions ?? [];

  const currentPath: string = normalize(location.pathname);

  const isAlwaysAllowed: boolean = ALWAYS_ALLOWED_PATHS.some(
    (p) => normalize(p) === currentPath
  );

  const hasPermission = permissions.some(
    (permission) =>
      normalize(permission) === currentPath ||
      currentPath.startsWith(normalize(permission) + "/") // subrutas
  );

  if (isAlwaysAllowed || hasPermission) {
    return <>{children}</>;
  }

  if (user && user.companies.length > 1) {
    return <Navigate to={`/select-company`} replace />;
  } 

  if (user && user.id) {
    return <Navigate to={`/${permissions[0]}`} replace />;
  } 
  
  return <Navigate to="/login" replace />;
}

export default function AppRouter() {
  return (
    <Routes>
      {/* PUBLICS */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/first-login" element={<FirstLoginPage />} />

      {/* PRIVATES */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          {/* Rutas protegidas por rol */}
          <Route 
            path="/raffles" 
            element={ 
              <RoleRoute>
                <RafflesPage />
              </RoleRoute>
            }
          />
          <Route 
            path="/dashboard" 
            element={
              <RoleRoute>
                <Dashboard />
              </RoleRoute>
            }  
          />
          <Route 
            path="/companies" 
            element={
              <RoleRoute>
                <CompaniesPage />
              </RoleRoute>
            } 
          />
          <Route 
            path="/raffles/editor" 
            element={
              <RoleRoute>
                <RaffleEditor />
              </RoleRoute>
            } 
          />
          <Route 
            path="/board" 
            element={
              <RoleRoute>
                <NumberBoard />
              </RoleRoute>
            } 
          />
          <Route 
            path="/users" 
            element={
              <RoleRoute>
                <UsersPage />
              </RoleRoute>
            } 
          />
          <Route 
            path="/logs" 
            element={
              <RoleRoute>
                <LogsPage />
              </RoleRoute>
            } 
          />
          <Route 
            path="/select-company" 
            element={
              <RoleRoute>
                <CompanySelect />
              </RoleRoute>
            } 
          />

          {/* Siempre permitidas (aunque igual pasan por RoleRoute) */}
          <Route 
            path="/profile" 
            element={
              <RoleRoute>
                <ProfilePage />
              </RoleRoute>
            } 
          />
          <Route 
            path="/search" 
            element={
              <RoleRoute>
                <SearchPage />
              </RoleRoute>
            } 
          />
        </Route>
      </Route>

      {/* ROOT / 404 */}
      <Route path="/" element={<NotFoundRedirect />} />
      <Route path="*" element={<NotFoundRedirect />} />
    </Routes>
  );
}