import { useState } from "react";
import { Location, NavigateFunction, useLocation, useNavigate } from "react-router-dom";

import { login, selectCompany } from "../../store/slices/authSlice.ts";
import { addToast, Language, } from "../../store/slices/uiSlice.ts";
import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";

import { tr } from "../../i18n/translations.ts";
import { FirstLogin } from "../../api/authAPI.tsx";
import { CONFIG } from "../../../config-global.ts";

export default function FirstLoginPage() {
  const { appName } = CONFIG;

  const dispatch = useAppDispatch();

  const navigate: NavigateFunction = useNavigate();
  const location: Location = useLocation();

  const lang: Language = useAppSelector((s) => s.ui.language);

  const [email, setEmail] = useState<string>((location.state && location.state.email) || "");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [remember, setRemember] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    if (password !== confirmPassword) {
      dispatch(addToast({ type: "error", message: tr("passwords_are_differents", lang) }));
      setLoading(false);
      return;
    }

    const data: any = await FirstLogin({ email, password, confirmPassword });

    if (data.token) {
      if (data.userResponse.isActive){
        const user: any = {
          id: data.userResponse.id,
          name: data.userResponse.username,
          email: data.userResponse.email,
          roleId: data.userResponse.roleId,
          avatar: data.userResponse.imageURL ?? 
            data.userResponse.username
              .split(" ").map((w: any) => w[0])
              .join("").slice(0, 2).toUpperCase(),
          companies: data.userResponse.companies,
        };
  
        dispatch(login({ user, token: data.token }));
        dispatch(addToast({ type: "success", message: tr("welcome_back", lang) }));
  
        if (user.companies.length > 1) {
          navigate("/select-company", { replace: true });
        } else {
          dispatch(selectCompany(user.companies[0]));
          navigate("/dashboard", { replace: true });
        }
      } else {
        dispatch(addToast({ type: "error", message: `${tr("user_inactive_please_contact_admin", lang)} ${appName}.` }));
      }
    } else {
      dispatch(addToast({ type: "error", message: data.message }));
    }

    setLoading(false);
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #1A365D 0%, #2D4A7F 50%, #1A365D 100%)",
      fontFamily: "var(--font-sans)",
    }}>
      {/* Decorative shapes */}
      <div style={{ position: "fixed", top: -120, right: -80, width: 400, height: 400, borderRadius: "50%", background: "#F6AD5520", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -100, left: -60, width: 300, height: 300, borderRadius: "50%", background: "#48BB7810", pointerEvents: "none" }} />

      <div className="animate-fade-in" style={{
        background: "#FFFFFF", borderRadius: 16, padding: "48px 40px",
        width: "100%", maxWidth: 420, boxShadow: "0 25px 60px #0000004D",
        position: "relative",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 20, }}>
          <img src="/images/logo_rifas.png" alt="logo_de_rifas" style={{ width: "55%", margin: "-30px auto -10px", }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4A5568", }}>
              {tr("email", lang)}
            </label>
            <input
              type="email" 
              placeholder="example@gmail.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required 
              aria-label={tr("email", lang)}
              style={{ 
                padding: "12px 16px", border: "2px solid #E2E8F0", fontSize: 15, 
                borderRadius: 8, outline: "none", fontFamily: "var(--font-sans)", width: "100%", 
                boxSizing: "border-box", transition: "border-color 0.2s", color: "var(--text-primary)", 
              }}
              onFocus={(e) => e.target.style.borderColor = "#1A365D"}
              onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4A5568", }}>
              {tr("new_password", lang)}
            </label>
            <input
              type="password" 
              placeholder="* * * * * *" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required 
              aria-label={tr("password", lang)}
              style={{
                width: "100%", padding: "12px 16px", border: "2px solid #E2E8F0",
                borderRadius: 8, fontSize: 15, outline: "none", fontFamily: "var(--font-sans)",
                transition: "border-color 0.2s", boxSizing: "border-box", color: "var(--text-primary)",
              }}
              onFocus={(e) => e.target.style.borderColor = "#1A365D"}
              onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4A5568", }}>
              {tr("confirm_password", lang)}
            </label>
            <input
              type="password" 
              placeholder="* * * * * *" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
              aria-label={tr("password", lang)}
              style={{
                width: "100%", padding: "12px 16px", border: "2px solid #E2E8F0",
                borderRadius: 8, fontSize: 15, outline: "none", fontFamily: "var(--font-sans)",
                transition: "border-color 0.2s", boxSizing: "border-box", color: "var(--text-primary)",
              }}
              onFocus={(e) => e.target.style.borderColor = "#1A365D"}
              onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
            />
          </div>

          <button
            type="submit" 
            disabled={loading || !password || !confirmPassword || !email}
            style={{
              padding: "14px", borderRadius: 8, border: "none", 
              cursor: (loading || !password || !confirmPassword || !email) ? "not-allowed" : "pointer",
              background: (loading || !password || !confirmPassword || !email) ? "#A0AEC0" : "linear-gradient(135deg, #1A365D, #2D4A7F)",
              color: "#FFFFFF", fontSize: 16, fontWeight: 700, fontFamily: "var(--font-display)",
              boxShadow: (loading || !password || !confirmPassword || !email) ? "none" : "0 4px 15px #1A365D50",
              transition: "opacity 0.2s, transform 0.1s",
            }}
            onMouseDown={(e) => { if (!loading) (e.target as HTMLElement).style.transform = "scale(0.98)"; }}
            onMouseUp={(e) => { (e.target as HTMLElement).style.transform = "scale(1)"; }}
          >
            {loading ? tr("saving", lang) : tr("save", lang)}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 12, color: "#A0AEC0", marginTop: 24 }}>
          © 2026 RifasPro · {lang === "es" ? "Todos los derechos reservados" : "All rights reserved"}
        </p>
      </div>
    </div>
  );
}
