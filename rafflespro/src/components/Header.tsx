import { useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

import { logout, User } from "../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleTheme, toggleLanguage, toggleSidebar, Language, Theme, } from "../store/slices/uiSlice";

import { tr } from "../i18n/translations";

import { appConfig } from "../config";

export default function Header() {
  const dispatch = useAppDispatch();

  const navigate: NavigateFunction = useNavigate();

  const { uploadsFolder } = appConfig;

  const lang: Language = useAppSelector((s) => s.ui.language);
  const theme: Theme = useAppSelector((s) => s.ui.theme);
  const user: User | null = useAppSelector((s) => s.auth.user);

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [notifOpen, setNotifOpen] = useState<boolean>(false);
  const [text, setText] = useState<string>("");

  const handleSearch = (txt: string): void => {
    const text: string = encodeURIComponent(txt);
    setText(text);
  };

  const goToSearch = (): void => {
    navigate(`search?text=${text}`, { replace: true });
    setText("");
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

        {/* Notifications */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            style={{
              width: 36, height: 36, borderRadius: 8, border: "1px solid var(--border)",
              background: "var(--bg)", cursor: "pointer", fontSize: 16, position: "relative",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
            aria-label={tr("notifications", lang)}
          >
            🔔
            <span style={{
              position: "absolute", top: 6, right: 6, width: 8, height: 8,
              borderRadius: "50%", background: "#FC8181", border: "2px solid var(--bg-header)",
            }} />
          </button>
          {notifOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", right: 0, width: 320,
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: 12, boxShadow: "0 8px 24px #0000001A", zIndex: 100,
              overflow: "hidden",
            }}>
              <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>
                {tr("notifications", lang)}
              </div>
              {[
                { icon: "🎉", msg: lang === "es" ? "Rifa Navideña vendió 47 números hoy" : "Christmas Raffle sold 47 numbers today", time: "Hace 5 min" },
                { icon: "⚠️", msg: lang === "es" ? "Número 047 en estado Reservado por 24h" : "Number 047 reserved for 24h", time: "Hace 1h" },
                { icon: "✅", msg: lang === "es" ? "Sorteo Solidario completado exitosamente" : "Solidarity Raffle completed", time: "Ayer" },
              ].map((n, i) => (
                <div key={i} style={{ padding: "12px 16px", display: "flex", gap: 12, alignItems: "flex-start", borderBottom: "1px solid var(--border)", cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span style={{ fontSize: 20 }}>{n.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "var(--text-primary)", lineHeight: 1.4 }}>{n.msg}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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
                  onClick={() => {
                    dispatch(logout());
                    navigate("/login", { replace: true });
                  }}
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
