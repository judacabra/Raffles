import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

import { logout, User } from "../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleTheme, toggleLanguage, toggleSidebar, Language, Theme, } from "../store/slices/uiSlice";

import { tr } from "../i18n/translations";

import { appConfig } from "../config";

import Notification from "./Notification";
import { useAlert } from "../utils/useAlert";

export default function Header() {
  const { sConfirm, } = useAlert();

  const dispatch = useAppDispatch();

  const navigate: NavigateFunction = useNavigate();

  const { uploadsFolder } = appConfig;

  const lang: Language = useAppSelector((s) => s.ui.language);
  const theme: Theme = useAppSelector((s) => s.ui.theme);
  const user: User | null = useAppSelector((s) => s.auth.user);

  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const [text, setText] = useState<string>("");

  const handleSearch = (txt: string): void => {
    const text: string = encodeURIComponent(txt);
    setText(text);
  };

  const goToSearch = (): void => {
    navigate(`search?text=${text}`, { replace: true });
    setText("");
  };

  const handleLogout = (): void => {
    setMenuOpen(false);

    const sProps: any = {
      html: `¿Estás seguro de cerrar la sesión?`,
      icon: 'question',
      confirmButtonText: 'Si, salir',
    }

    sConfirm(sProps, () => {
      dispatch(logout());
      navigate("/login", { replace: true });
    });
  };

  return (
    <header style={{
      height: 64, flexShrink: 0,
      background: "var(--bg-header)",
      borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px", position: "sticky", top: 0, zIndex: 40,
      boxShadow: "0 1px 3px #0000000A",
    }}>
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button
          onClick={() => dispatch(toggleSidebar())}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: 8, color: "var(--text-secondary)", fontSize: 18 }}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
        <div style={{ position: "relative" }}>
          <input
            value={text}
            placeholder={tr("search", lang)}
            aria-label={tr("search", lang)}
            style={{
              padding: "8px 16px 8px 36px", borderRadius: 8,
              border: "1px solid var(--border)", background: "var(--bg)",
              color: "var(--text-primary)", fontSize: 14, outline: "none", width: 260,
              fontFamily: "var(--font-sans)", marginLeft: 5,
            }}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") goToSearch() }}
          />
          {text && 
            <button 
              style={{ 
                position: "absolute", right: 10, top: 5, border: "solid .5px #c2c2c2", 
                padding: "1px 7px 2px", borderRadius: 20, marginBottom: 5, color: "#c2c2c2",
                cursor: "pointer", 
              }}
              title={tr("send", lang)}
              onClick={goToSearch}
              onMouseEnter={(e) => ([e.currentTarget.style.borderColor = "#5272db", e.currentTarget.style.color = "#5272db",] )}
              onMouseLeave={(e) => ([e.currentTarget.style.borderColor = "#c2c2c2", e.currentTarget.style.color = "#c2c2c2", ])}
            > ➤ </button>}
          <span 
            style={{ 
              position: "absolute", left: 12, top: "50%", 
              transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none", 
            }}
          > 🔍 </span>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          onClick={() => dispatch(toggleLanguage())}
          style={{
            padding: "7.5px 10px", borderRadius: 6, border: "1px solid var(--border)",
            background: "var(--bg)", color: "var(--text-secondary)", cursor: "pointer",
            fontSize: 12, fontWeight: 700, fontFamily: "var(--font-mono)", letterSpacing: "0.05em",
          }}
          title={tr("language_switch", lang)}
        >
          {lang.toUpperCase()}
        </button>

        {/* Theme toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          style={{
            width: 36, height: 36, borderRadius: 8, border: "1px solid var(--border)",
            background: "var(--bg)", cursor: "pointer", fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Modo Claro" : "Modo Oscuro"}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        {(user && user.companies.length > 1) && (
          <button
            onClick={() => navigate("/select-company", { replace: true })}
            style={{
              padding: "5px 8px", borderRadius: 6, border: "1px solid var(--border)",
              background: "var(--bg)", color: "var(--text-secondary)", cursor: "pointer",
              fontSize: 15, fontWeight: 700, fontFamily: "var(--font-mono)", letterSpacing: "0.05em",
            }}
            title={tr("language_switch", lang)}
          >
            🏢
          </button>
        )}

        {/* Notifications */}
        <Notification />

        {/* User menu */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: "flex", alignItems: "center", gap: 10, padding: "6px 12px",
              borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)",
              cursor: "pointer", fontFamily: "var(--font-sans)",
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "linear-gradient(135deg, #1A365D, #F6AD55)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 11, fontWeight: 700,
            }}>
              {user?.avatar.startsWith("uploads/") ? (
                <img src={uploadsFolder + "/" + user?.avatar} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", }} />
              ) : (
                user?.avatar
              )}
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.name}
            </span>
            <span style={{ color: "var(--text-muted)", fontSize: 10 }}>▾</span>
          </button>

          {menuOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", right: 0, width: 200,
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: 12, boxShadow: "0 8px 24px #0000001A", zIndex: 100, overflow: "hidden",
            }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{user?.name}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{user?.email}</div>
              </div>
              {[
                { label: tr("my_profile", lang), icon: "👤", url: "profile" },
                { label: tr("settings", lang), icon: "⚙", url: "settings" },
              ].map((item) => (
                <button 
                  key={item.label} 
                  style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%",
                    padding: "10px 16px", border: "none", background: "none", cursor: "pointer",
                    fontSize: 13, color: "var(--text-primary)", fontFamily: "var(--font-sans)", textAlign: "left",
                  }}
                  onClick={() => {
                    navigate(`/${item.url}`, { replace: true });
                    setMenuOpen(false);
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                >
                  <span>{item.icon}</span> {item.label}
                </button>
              ))}
              <div style={{ borderTop: "1px solid var(--border)" }}>
                <button
                  onClick={handleLogout}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%",
                    padding: "10px 16px", border: "none", background: "none", cursor: "pointer",
                    fontSize: 13, color: "#FC8181", fontFamily: "var(--font-sans)", textAlign: "left",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#FFF5F5")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                >
                  <span>🚪</span> {tr("logout", lang)}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
