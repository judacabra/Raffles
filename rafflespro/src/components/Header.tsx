import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

import { logout, User } from "../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleTheme, toggleLanguage, toggleSidebar, Language, Theme, } from "../store/slices/uiSlice";

import { tr } from "../i18n/translations";

import ButtonLanguage from "./buttons/ButtonLanguage";
import ButtonTheme from "./buttons/ButtonTheme";
import ButtonUserMenu from "./buttons/ButtonUserMenu";
import ButtonSelectCompany from "./buttons/ButtonSelectCompany";
import ButtonNotification from "./buttons/ButtonNotification";

export default function Header() {
  
  const dispatch = useAppDispatch();
  
  const navigate: NavigateFunction = useNavigate();

  const lang: Language = useAppSelector((s: any) => s.ui.language);
  const user: User | null = useAppSelector((s: any) => s.auth.user);
  const companies: any = useAppSelector((s: any) => s.auth.user.companies);

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [notificationOpen, setNotificationOpen] = useState<boolean>(false);
  const [lngOpen, setLngOpen] = useState<boolean>(false);

  const [text, setText] = useState<string>("");

  const handleSearch = (txt: string): void => {
    setText(txt);
  };

  const handleButtonLanguage = (): void => {
    setLngOpen(!lngOpen);  
    setNotificationOpen(false); 
    setMenuOpen(false); 
  };

  const handleUserMenu = (): void => {
    setMenuOpen(!menuOpen);
    setLngOpen(false); 
    setNotificationOpen(false);
  };

  const handleButtonTheme = (): void => {
    setLngOpen(false); 
    setNotificationOpen(false); 
    setMenuOpen(false);
  };

  const handleButtonNotification = (): void => {
    setNotificationOpen(!notificationOpen); 
    setMenuOpen(false);
    setLngOpen(false); 
  };

  const goToSearch = (): void => {
    const value = text.trim();

    if (!value) return;

    navigate(`/search?text=${encodeURIComponent(value)}`, {
      replace: true,
    });

    setText("");
  };

  return (
    <header 
      style={{
        height: 64, flexShrink: 0, background: "var(--bg-header)",
        borderBottom: "1px solid var(--border)", top: 0, zIndex: 40,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", position: "sticky", boxShadow: "0 1px 3px #0000000A",
      }}
    >
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button
          onClick={() => {
            
            dispatch(toggleSidebar())
          }}
          style={{ 
            background: "none", border: "none", cursor: "pointer", padding: 9, 
            borderRadius: 8, color: "var(--text-secondary)", fontSize: 18 
          }}
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
                position: "absolute", right: 10, top: 5, border: "solid .5px var(--border)", 
                padding: "1px 7px 2px", borderRadius: 20, marginBottom: 5, cursor: "pointer", 
                color: "var(--border)",
              }}
              title={tr("send", lang)}
              onClick={goToSearch}
              onMouseEnter={(e) => ([
                e.currentTarget.style.borderColor = "var(--bg-sidebar)", 
                e.currentTarget.style.color = "var(--bg-sidebar)",
              ])}
              onMouseLeave={(e) => ([
                e.currentTarget.style.borderColor = "var(--border)", 
                e.currentTarget.style.color = "var(--border)", 
              ])}
            > ➤ </button>}
          <span 
            style={{ 
              position: "absolute", left: 12, top: "50%", 
              transform: "translateY(-50%)", color: "var(--text-muted)", 
              pointerEvents: "none", 
            }}
          > 🔍 </span>
        </div>
      </div>
 
      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ position: "absolute", top: 11, right: (companies.length > 1) ? 341.5 : 291.3, }}>
          <ButtonLanguage 
            open={lngOpen} 
            onClick={handleButtonLanguage} 
          />
        </div>

        <ButtonTheme onClick={handleButtonTheme} />

        {(user && user.companies.length > 1) && (
          <ButtonSelectCompany />
        )}

        <ButtonNotification 
          open={notificationOpen}
          onClick={handleButtonNotification}
        />

        <ButtonUserMenu 
          open={menuOpen} 
          onClick={handleUserMenu} 
        />
      </div>
    </header>
  );
}
