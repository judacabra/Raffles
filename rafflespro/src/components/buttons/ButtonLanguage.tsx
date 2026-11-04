import { useState } from "react";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Language, toggleLanguage } from "../../store/slices/uiSlice";

import { tr } from "../../i18n/translations";

const ButtonLanguage = ( 
  { open, onClick, } : 
  { open: boolean, onClick: () => void }
) => {
  const dispatch = useAppDispatch();
  
  const lang: Language = useAppSelector((s) => s.ui.language);

  const LNGS_ARR: any[] = [
    { label: "es", icon: "🇨🇴" },
    { label: "en", icon: "🇺🇸" },
    { label: "br", icon: "🇧🇷" },
  ];

  const langSelected: any = LNGS_ARR.find((l: any) => l.label === lang);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => onClick() }
        style={{
          width: 72, height: 42, borderRadius: 8,
          border: "1px solid var(--border)",
          color: "var(--text-secondary)", 
          background: "var(--bg)", top: 0,
          cursor: "pointer", fontSize: 13,
          position: "absolute", right: 0, 
        }}
        title={tr("language_switch", lang)}
      >
        {langSelected.icon} &nbsp; {langSelected.label.toUpperCase()}
      </button>

      {open && (
        <div
          style={{
            position: "absolute", border: "1px solid var(--border)",
            top: "calc(100% + 50px)", right: 0, width: 80, 
            background: "var(--bg-card)", borderRadius: 12, zIndex: 100,
            boxShadow: "0 8px 24px #0000001A", overflow: "hidden",
          }}
        >
          {LNGS_ARR.map((item) => (
            <button
              key={item.label}
              style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                padding: "10px 16px", border: "none", background: "none", 
                cursor: "pointer", fontSize: 13, color: "var(--text-secondary)",
                fontFamily: "var(--font-sans)", textAlign: "left",
              }}
              onClick={() => dispatch(toggleLanguage(item.label as Language))}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--bg)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <span>{item.icon}</span> {item.label.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ButtonLanguage;
