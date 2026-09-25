import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectCompany, logout, type Company } from "../../store/slices/authSlice";
import { tr } from "../../i18n/translations";

const planBadge: Record<string, string> = {
  starter: "#48BB78",
  pro: "#F6AD55",
  enterprise: "#1A365D",
};

export default function CompanySelect() {
  const dispatch = useAppDispatch();
  const lang = useAppSelector((s) => s.ui.language);
  const user = useAppSelector((s) => s.auth.user);

  if (!user) return null;

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #1A365D 0%, #2D4A7F 50%, #1A365D 100%)",
      fontFamily: "var(--font-sans)",
    }}>
      <div className="animate-fade-in" style={{
        background: "#FFFFFF", borderRadius: 20, padding: "48px 40px",
        width: "100%", maxWidth: 540, boxShadow: "0 25px 60px #0000004D",
      }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "linear-gradient(135deg, #1A365D, #F6AD55)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            color: "#FFF", fontSize: 20, fontWeight: 700, marginBottom: 16,
          }}>
            {user.avatar}
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "#1A202C", margin: "0 0 8px" }}>
            {tr("select_company", lang)}
          </h2>
          <p style={{ color: "#718096", fontSize: 14, margin: 0 }}>
            {tr("select_company_sub", lang)}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {user.companies.map((company: Company) => (
            <button
              key={company.id}
              onClick={() => dispatch(selectCompany(company))}
              style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "18px 20px", borderRadius: 12,
                border: "2px solid #E2E8F0", background: "#FAFAFA",
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
                el.style.borderColor = "#E2E8F0";
                el.style.background = "#FAFAFA";
                el.style.transform = "none";
                el.style.boxShadow = "none";
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: company.color + "20", fontSize: 24,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                {company.logo}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: "#1A202C" }}>{company.name}</div>
                <div style={{ fontSize: 12, color: "#718096", marginTop: 2 }}>
                  {user.email}
                </div>
              </div>
              <span style={{
                padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                background: planBadge[company.plan] + "20", color: planBadge[company.plan],
              }}>
                {company.plan}
              </span>
              <span style={{ color: "#CBD5E0", fontSize: 20 }}>›</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => dispatch(logout())}
          style={{
            display: "block", width: "100%", marginTop: 24, padding: "10px",
            borderRadius: 8, border: "1px solid #E2E8F0", background: "none",
            color: "#718096", fontSize: 14, cursor: "pointer", fontFamily: "var(--font-sans)",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { (e.currentTarget).style.background = "#FFF5F5"; (e.currentTarget).style.color = "#FC8181"; }}
          onMouseLeave={(e) => { (e.currentTarget).style.background = "none"; (e.currentTarget).style.color = "#718096"; }}
        >
          ← {tr("logout", lang)}
        </button>
      </div>
    </div>
  );
}
