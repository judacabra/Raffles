import { useState } from "react";
import { Location, NavigateFunction, useLocation, useNavigate } from "react-router-dom";

import { login, selectCompany } from "../../store/slices/authSlice.ts";
import { addToast, Language, toggleLanguage, toggleTheme, } from "../../store/slices/uiSlice.ts";
import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";

import { tr } from "../../i18n/translations.ts";

import { FirstLogin } from "../../api/authAPI.tsx";

import { firstLetterUppercase } from "../../utils/format-words.ts";

import { CONFIG } from "../../../config-global.ts";

export default function FirstLoginPage() {
  const { appName } = CONFIG;

  const dispatch = useAppDispatch();

  const navigate: NavigateFunction = useNavigate();
  const location: Location = useLocation();

  const lang: Language = useAppSelector((s) => s.ui.language);
  const theme: any = useAppSelector((s) => s.ui.theme);

  const srcLogo: string = `./images/logo_${theme}.png`;

  const LNGS_ARR: any[] = [
    { label: "es", icon: "🇨🇴", },
    { label: "en", icon: "🇺🇸", },
    { label: "br", icon: "🇧🇷", },
  ];

  const langSelected: any = LNGS_ARR.find((l: any) => l.label === lang);

  const [lngOpen, setLngOpen] = useState<boolean>(false);

  const [email, setEmail] = useState<string>((location.state && location.state.email) || "");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async(e: React.FormEvent): Promise<void> => {
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
      dispatch(addToast({ type: "error", message: tr(data.message, lang) }));
    }

    setLoading(false);
  };

  const backToLogin = () => {
    navigate("/login", { replace: true });
  };

  return (
    <>
      <button 
        style={{
          position: "absolute", left: 20, top: 20,
          background: "var(--bg)", width: 45, height: 45,
          borderRadius: "50%", paddingBottom: 2,
          transform: "rotate(180deg)", cursor: "pointer"
        }}
        title={firstLetterUppercase(tr("back_to_x", lang, { x: tr("login", lang) }))}
        onClick={backToLogin}
        onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-header)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "var(--bg)"}
      > 
        ➜
      </button>

      <div style={{ position: "relative" }}>
        <button
          onClick={() => { setLngOpen(!lngOpen); }}
          style={{
            width: 72, height: 42, borderRadius: 6, border: "1px solid var(--border)",
            background: "var(--bg)", color: "var(--text-secondary)", cursor: "pointer",
            fontSize: 13, position: "absolute", right: 70, top: 20,
          }}
          title={tr("language_switch", lang)}
        >
          {langSelected.icon} &nbsp; {langSelected.label.toUpperCase()}
        </button>

        {lngOpen && (
          <div style={{
            position: "absolute", top: "calc(100% + 65px)", right: 70, width: 80,
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: 12, boxShadow: "0 8px 24px #0000001A", zIndex: 100, overflow: "hidden",
          }}>
            {LNGS_ARR.map((item) => (
              <button 
                key={item.label} 
                style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  padding: "10px 16px", border: "none", background: "none", cursor: "pointer",
                  fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-sans)", textAlign: "left",
                }}
                onClick={() => {
                  dispatch(toggleLanguage(item.label as Language))
                  setLngOpen(false);
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              >
                <span>{item.icon}</span> {item.label.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => dispatch(toggleTheme())}
        style={{
          borderRadius: 8, border: "1px solid var(--border)", width: 42, height: 42,
          background: "var(--bg)", cursor: "pointer", fontSize: 16,
          position: "absolute", right: 20, top: 20,
        }}
        title={firstLetterUppercase(tr("switch_to_x", lang, { x: theme === "dark" ? tr("light", lang) : tr("dark", lang) }))}
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </button>

      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: `linear-gradient(135deg, var(--bg-sidebar) 0%, ${theme === "dark" ? "var(--color-primary)" : "var(--color-primary-light)"} 50%, var(--bg-sidebar) 100%)`,
        fontFamily: "var(--font-sans)",
      }}>

        {/* Decorative animated shapes */}
        <div className="background-shapes">
          <div className={`background-orb orb-one ${theme}`} />
          <div className={`background-orb orb-two ${theme}`} />
          <div className={`background-orb orb-three ${theme}`} />
          <div className={`background-orb orb-four ${theme}`} />
          <div className={`background-orb orb-five ${theme}`} />
          <div className={`background-orb orb-six ${theme}`} />
        </div>

        <div className="animate-fade-in" 
          style={{
            background: "var(--bg-card)", borderRadius: 16, padding: "48px 40px",
            width: "100%", maxWidth: 420, boxShadow: "0 25px 60px #0000004D",
            position: "relative",
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 20, }}>
            <img src={srcLogo} alt="logo_de_rifas" style={{ width: "55%", margin: "-40px auto -10px", }} />
            <p style={{ color: "var(--text-primary)", fontSize: 14, }}>
              {tr("welcome_back", lang)}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-ŕimary)", }}>
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
                  padding: "12px 16px", border: "2px solid var(--border)", fontSize: 15, 
                  borderRadius: 8, outline: "none", fontFamily: "var(--font-sans)", width: "100%", 
                  boxSizing: "border-box", transition: "border-color 0.2s", 
                  color: theme === "dark" ? "#fff" : "var(--text-primary)", 
                }}
                onFocus={(e) => e.target.style.borderColor = "#1A365D"}
                onBlur={(e) => e.target.style.borderColor = "var(--border)"}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-ŕimary)", }}>
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
                  width: "100%", padding: "12px 16px", border: "2px solid var(--border)",
                  borderRadius: 8, fontSize: 15, outline: "none", fontFamily: "var(--font-sans)",
                  transition: "border-color 0.2s", boxSizing: "border-box", 
                  color: theme === "dark" ? "#fff" : "var(--text-primary)",
                }}
                onFocus={(e) => e.target.style.borderColor = "#1A365D"}
                onBlur={(e) => e.target.style.borderColor = "var(--border)"}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-ŕimary)", }}>
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
                  width: "100%", padding: "12px 16px", border: "2px solid var(--border)",
                  borderRadius: 8, fontSize: 15, outline: "none", fontFamily: "var(--font-sans)",
                  transition: "border-color 0.2s", boxSizing: "border-box", color: "var(--text-primary)",
                }}
                onFocus={(e) => e.target.style.borderColor = "#1A365D"}
                onBlur={(e) => e.target.style.borderColor = "var(--border)"}
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
            © 2026 {appName} · {tr("all_rights_reserved", lang)}
          </p>
        </div>
      </div>
    </>
  );
}
