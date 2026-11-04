import { useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Language, } from "../../store/slices/uiSlice";
import { logout, User } from "../../store/slices/authSlice";

import { useAlert } from "../../utils/useAlert";

import { tr } from "../../i18n/translations";

import { appConfig } from "../../config";

const ButtonUserMenu = (
  { open, onClick }: 
  { open: boolean, onClick: () => void }
) => {
  const dispatch = useAppDispatch();

  const { sConfirm, } = useAlert();
  const { uploadsFolder } = appConfig;

  const navigate: NavigateFunction = useNavigate();

  const lang: Language = useAppSelector((s) => s.ui.language);
  const user: User | null = useAppSelector((s) => s.auth.user);

  const handleLogout = (): void => {
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
    <div style={{ position: "relative" }}>
      <button
        onClick={() => onClick()}
        style={{
          display: "flex", alignItems: "center", gap: 10, padding: "6px 12px",
          borderRadius: 8, border: "1px solid var(--border)", cursor: "pointer",
          background: "var(--bg)", fontFamily: "var(--font-sans)",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #1A365D, #F6AD55)",
            width: 28, height: 28, borderRadius: "50%", display: "flex",
            alignItems: "center", justifyContent: "center", color: "#fff",
            fontSize: 11, fontWeight: 700,
          }}
        >
          {user?.avatar.startsWith("uploads/") ? (
            <img
              src={uploadsFolder + "/" + user?.avatar}
              style={{
                width: "100%", height: "100%", objectFit: "cover", 
                borderRadius: "50%",
              }}
            />
          ) : (
            user?.avatar
          )}
        </div>
        <span
          style={{
            fontSize: 13, fontWeight: 500, color: "var(--text-primary)",
            width: 80, overflow: "hidden", textOverflow: "ellipsis",
            whiteSpace: "nowrap", 
          }}
        >
          {user?.name}
        </span>
        <span style={{ color: "var(--text-muted)", fontSize: 10 }}>▾</span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute", top: "calc(100% + 8px)", right: 0,
            width: 200, background: "var(--bg-card)", borderRadius: 12,
            border: "1px solid var(--border)", zIndex: 100,
            boxShadow: "0 8px 24px #0000001A", overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                fontWeight: 600, fontSize: 13,
                color: "var(--text-primary)",
              }}
            >
              {user?.name}
            </div>
            <div
              style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}
            >
              {user?.email}
            </div>
          </div>
          {[
            { label: tr("my_profile", lang), icon: "👤", url: "profile" },
            { label: tr("settings", lang), icon: "⚙", url: "settings" },
          ].map((item) => (
            <button
              key={item.label}
              style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                padding: "10px 16px", border: "none", background: "none", 
                cursor: "pointer", fontSize: 13, color: "var(--text-primary)", 
                fontFamily: "var(--font-sans)", textAlign: "left",
              }}
              onClick={() => navigate(`/${item.url}`, { replace: true })}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--bg)")
              }
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
                justifyContent: "center", padding: "10px 16px", border: "none",
                background: "none", cursor: "pointer", fontSize: 13, 
                color: "#FC8181", fontFamily: "var(--font-sans)", textAlign: "left",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--bg)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              {tr("logout", lang)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ButtonUserMenu;