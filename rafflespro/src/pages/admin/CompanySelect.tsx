import { NavigateFunction, useNavigate } from "react-router-dom";

import { selectCompany, logout, type Company, } from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Language, } from "../../store/slices/uiSlice";

import { tr } from "../../i18n/translations";

import { useAlert } from "../../utils/useAlert";

import { appConfig } from "../../config";

const planBadge: Record<string, string> = {
  starter: "#48BB78",
  pro: "#F6AD55",
  enterprise: "#1A365D",
};

const CompanySelect = () => {
  const dispatch = useAppDispatch();

  const { sConfirm, } = useAlert();

  const navigate: NavigateFunction = useNavigate();

  const lang: Language = useAppSelector((s) => s.ui.language);
  const user: any = useAppSelector((s) => s.auth.user);
  const theme: any = useAppSelector((s) => s.ui.theme);

  const { uploadsFolder } = appConfig;

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, var(--bg) 0%, #2D4A7F 50%, var(--bg) 100%)",
      fontFamily: "var(--font-sans)",
    }}>
      <div className="animate-fade-in" style={{
        background: "var(--bg)", borderRadius: 20, padding: "48px 40px",
        width: "100%", maxWidth: 540, boxShadow: "0 25px 60px #0000004D",
      }}>
        <div style={{ textAlign: "center", marginBottom: 36, }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "linear-gradient(135deg, #1A365D, #F6AD55)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            color: "var(--text-primary)", fontSize: 20, fontWeight: 700, marginBottom: 16,
          }}>
            {user && user?.avatar.startsWith("uploads/") ? (
              <img src={uploadsFolder + "/" + user?.avatar} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", }} />
            ) : (
              user?.avatar
            )}
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 8px" }}>
            {tr("select_company", lang)}
          </h2>
          <p style={{ color: "#718096", fontSize: 14, margin: 0 }}>
            {tr("select_company_sub", lang)}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, }}>
          {user && user.companies.map((company: Company) => (
            <button
              key={company.id}
              onClick={() => {
                dispatch(selectCompany(company));
                navigate("/dashboard", { replace: true });
              }}
              style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "18px 20px", borderRadius: 12,
                border: "2px solid var(--border)", background: theme === "dark" ? "var(--bg-sidebar)" : "#FAFAFA",
                cursor: "pointer", textAlign: "left", width: "100%",
                transition: "all 0.2s", fontFamily: "var(--font-sans)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = company.color;
                el.style.background = company.color + "10";
                el.style.transform = "translateY(-2px)";
                el.style.boxShadow = `0 8px 24px ${company.color}30`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = theme === "dark" ? "var(--border)" : "#E2E8F0";
                el.style.background = theme === "dark" ? "var(--bg-sidebar)" : "#FAFAFA";
                el.style.transform = "none";
                el.style.boxShadow = "none";
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: company.color + "20", fontSize: 24,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <img src={uploadsFolder + "/" + company.logoURL} alt="logo company" style={{ borderRadius: "50%", }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: "var(--text-primary)" }}>{company.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-primary)", marginTop: 2 }}>
                  {company.taxId}
                </div>
              </div>
              <span style={{
                padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                background: planBadge[company.plan] + "20", color: planBadge[company.plan],
              }}>
                {company.plan}
              </span>
              <span style={{ color: "var(--text-primary)", fontSize: 20 }}>›</span>
            </button>
          ))}
        </div>

        <button
          className="btn-logout"
          onClick={() => {
            const sProps: any = {
              html: `¿Estás seguro de cerrar la sesión?`,
              icon: 'question',
              confirmButtonText: 'Si, salir',
            }

            sConfirm(sProps, () => {
              dispatch(logout());
              navigate("/login", { replace: true });
            });
          }}
          style={{
            width: "100%", marginTop: 24, padding: "10px",
            display: "flex", justifyContent: "center", alignItems: "center", 
            borderRadius: 8, transition: "all 0.2s", fontSize: 14, 
            cursor: "pointer", fontFamily: "var(--font-sans)",
          }}
        >
          {tr("logout", lang)} <span style={{ marginLeft: 7 }}> {'➜]'} </span>
        </button>
      </div>
    </div>
  );
}

export default CompanySelect;
