import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setActiveView } from "../store/slices/uiSlice";
import { tr } from "../i18n/translations";

const navItems = [
  { view: "dashboard", icon: "⊞", key: "dashboard" },
  { view: "companies", icon: "🏢", key: "companies" },
  { view: "raffles", icon: "🎟", key: "raffles" },
  { view: "board", icon: "🔢", key: "number_board" },
  { view: "users", icon: "👥", key: "users" },
  { view: "logs", icon: "📋", key: "logs" },
];

export default function Sidebar({ open }: { open: boolean }) {
  const dispatch = useAppDispatch();

  const lang = useAppSelector((s) => s.ui.language);
  const activeView = useAppSelector((s) => s.ui.activeView);
  const company = useAppSelector((s) => s.auth.activeCompany);

  return (
    <aside style={{
      width: open ? 240 : 64, flexShrink: 0,
      background: "var(--bg-sidebar)",
      height: "100vh", position: "sticky", top: 0,
      display: "flex", flexDirection: "column",
      transition: "width 0.25s cubic-bezier(.25,.46,.45,.94)",
      overflow: "hidden", zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{
        padding: "20px 16px", display: "flex", alignItems: "center", gap: 12,
        borderBottom: "1px solid #FFFFFF15", flexShrink: 0,
      }}>
        <img src="/images/icon_rifas.png" alt="icono_de_rifas" style={{ width: open ? "18%" : "", background: "#fff", borderRadius: 10, }} />
        {open && (
          <div>
            <div style={{ color: "#FFFFFF", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, whiteSpace: "nowrap" }}>RifasPro</div>
            {company && (
              <div style={{ color: "#FFFFFF80", fontSize: 11, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 150 }}>
                {company.name}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
        {navItems.map((item) => {
          const isActive = activeView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => dispatch(setActiveView(item.view))}
              title={open ? undefined : tr(item.key, lang)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                background: isActive ? "#FFFFFF20" : "transparent",
                color: isActive ? "#F6AD55" : "#FFFFFF99",
                fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: isActive ? 600 : 400,
                transition: "all 0.15s", textAlign: "left", width: "100%",
                borderLeft: isActive ? "3px solid #F6AD55" : "3px solid transparent",
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "#FFFFFF10"; e.currentTarget.style.color = "#FFFFFF"; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = isActive ? "#F6AD55" : "#FFFFFF99"; }}
            >
              <span style={{ fontSize: 18, flexShrink: 0, width: 20, textAlign: "center" }}>{item.icon}</span>
              {open && <span style={{ whiteSpace: "nowrap" }}>{tr(item.key, lang)}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "12px 8px", borderTop: "1px solid #FFFFFF15" }}>
        <button
          onClick={() => dispatch(setActiveView("settings"))}
          style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer",
            background: "transparent", color: "#FFFFFF60",
            fontFamily: "var(--font-sans)", fontSize: 14, width: "100%",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#FFFFFF10"; e.currentTarget.style.color = "#FFFFFF"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#FFFFFF60"; }}
        >
          <span style={{ fontSize: 18, flexShrink: 0, width: 20, textAlign: "center" }}>⚙</span>
          {open && <span style={{ whiteSpace: "nowrap" }}>{tr("settings", lang)}</span>}
        </button>
      </div>
    </aside>
  );
}
