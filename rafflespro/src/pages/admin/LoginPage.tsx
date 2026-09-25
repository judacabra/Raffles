import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { login } from "../../store/slices/authSlice";
import { addToast } from "../../store/slices/uiSlice";
import { tr } from "../../i18n/translations";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const lang = useAppSelector((s) => s.ui.language);
  const [email, setEmail] = useState("carlos@rifasdorado.com");
  const [password, setPassword] = useState("demo1234");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    dispatch(login({ email, password, rememberMe: remember }));
    dispatch(addToast({ type: "success", message: lang === "es" ? "¡Bienvenido de vuelta!" : "Welcome back!" }));
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
        <div style={{ textAlign: "center", marginBottom: 36, }}>
          <img src="/images/logo_rifas.png" alt="logo_de_rifas" style={{ width: "55%", margin: "-30px auto -10px", }} />
          <p style={{ color: "#718096", fontSize: 14, marginTop: 0 }}>
            {tr("welcome_back", lang)}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4A5568", marginBottom: 6 }}>
              {tr("email", lang)}
            </label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              required aria-label={tr("email", lang)}
              style={{
                width: "100%", padding: "12px 16px", border: "2px solid #E2E8F0",
                borderRadius: 8, fontSize: 15, outline: "none", fontFamily: "var(--font-sans)",
                transition: "border-color 0.2s", boxSizing: "border-box",
              }}
              onFocus={(e) => e.target.style.borderColor = "#1A365D"}
              onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4A5568", marginBottom: 6 }}>
              {tr("password", lang)}
            </label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              required aria-label={tr("password", lang)}
              style={{
                width: "100%", padding: "12px 16px", border: "2px solid #E2E8F0",
                borderRadius: 8, fontSize: 15, outline: "none", fontFamily: "var(--font-sans)",
                transition: "border-color 0.2s", boxSizing: "border-box",
              }}
              onFocus={(e) => e.target.style.borderColor = "#1A365D"}
              onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, color: "#4A5568" }}>
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: "#1A365D" }} />
              {tr("remember_me", lang)}
            </label>
            <button type="button" style={{ background: "none", border: "none", color: "#F6AD55", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
              {tr("forgot_password", lang)}
            </button>
          </div>

          <button
            type="submit" disabled={loading}
            style={{
              padding: "14px", borderRadius: 8, border: "none", cursor: loading ? "not-allowed" : "pointer",
              background: loading ? "#A0AEC0" : "linear-gradient(135deg, #1A365D, #2D4A7F)",
              color: "#FFFFFF", fontSize: 16, fontWeight: 700, fontFamily: "var(--font-display)",
              transition: "opacity 0.2s, transform 0.1s",
              boxShadow: loading ? "none" : "0 4px 15px #1A365D50",
            }}
            onMouseDown={(e) => { if (!loading) (e.target as HTMLElement).style.transform = "scale(0.98)"; }}
            onMouseUp={(e) => { (e.target as HTMLElement).style.transform = "scale(1)"; }}
          >
            {loading ? tr("signing_in", lang) : tr("sign_in", lang)}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 12, color: "#A0AEC0", marginTop: 24 }}>
          © 2024 RifasPro · {lang === "es" ? "Todos los derechos reservados" : "All rights reserved"}
        </p>
      </div>
    </div>
  );
}
