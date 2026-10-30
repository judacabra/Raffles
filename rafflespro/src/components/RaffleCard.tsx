import { NavigateFunction, useNavigate } from "react-router-dom";
import { tr } from "../i18n/translations";

import { appConfig } from "../config";

import { addToast, Language } from "../store/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setActiveRaffle } from "../store/slices/raffleSlice";
import { User } from "../store/slices/authSlice";

import { Raffle } from "../interfaces/raffle.interfaces";

import { ID_PROFILE_ADMIN } from "../constants/constants";
import { truncarText } from "../utils/format-words";

export const RaffleCard = ({ r }: { r: any }) => {
  const { uploadsFolder } = appConfig;
  
  const dispatch = useAppDispatch();
  
  const navigate: NavigateFunction = useNavigate();
  
  const user: User | null = useAppSelector((s) => s.auth.user);
  const lang: Language = useAppSelector((s) => s.ui.language);
  
  const statusColors: Record<string, { bg: string; color: string }> = {
    active:    { bg: "#C6F6D5", color: "#276749" },
    draft:     { bg: "#E2E8F0", color: "#4A5568" },
    completed: { bg: "#BEE3F8", color: "#2C5282" },
    closed:    { bg: "#FED7D7", color: "#9B2C2C" },
  };

  const themeEmoji: Record<string, string> = {
    default: "🎰", 
    christmas: "🎄", 
    sports: "⚽", 
    lottery: "🎱",
  };

  const openBoard = (id: string): void => {
    dispatch(setActiveRaffle(id));
    navigate("/board", { replace: true, state: { raffleSelected: id } });
  };
  
  const openEditor = (r?: Raffle): void => {
    const objEdit: any = { replace: true, state: {} };
    if (r) objEdit.state.raffleSelected = r;

    navigate("/raffles/editor", objEdit);
  };

  const badge: any = statusColors[r.status] ?? statusColors.draft;
  const sold: number = r.numbers.filter((n: any) => n.status === "sold").length;
  const pct: number = Math.round((sold / r.totalNumbers) * 100);

  return (
    <div
      key={r.id}
      style={{
        background: "var(--bg-card)",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "var(--shadow-lg)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
      }}
    >
      <div
        style={{
          height: 120,
          background: r.image
            ? `linear-gradient(to bottom, #0000004D, #000000A0), url(${uploadsFolder + "/" + r.image}) center/cover`
            : `linear-gradient(135deg, ${r.bgColor}, ${r.bgColor}CC)`,
          display: "flex",
          alignItems: "flex-end",
          padding: "12px 16px",
          position: "relative",
        }}
      >
        <span style={{ position: "absolute", top: 12, left: 16, fontSize: 28 }}>
          {themeEmoji[r.theme]}
        </span>
        <div
          style={{
            color: "#fff",
            fontWeight: 700,
            fontSize: 15,
            fontFamily: "var(--font-display)",
            textShadow: "0 1px 4px #000",
          }}
        >
          {r.name}
        </div>
        <span
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            padding: "3px 10px",
            borderRadius: 99,
            fontSize: 11,
            fontWeight: 700,
            background: badge.bg,
            color: badge.color,
          }}
        >
          {tr(r.status, lang)}
        </span>
      </div>

      <div style={{ padding: "16px 18px" }}>
        <p
          style={{
            margin: "0 0 12px",
            fontSize: 13,
            color: "var(--text-muted)",
            lineHeight: 1.5,
          }}
        >
          {r.description ||
            (lang === "es" ? "Sin descripción" : "No description")}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 14,
          }}
        >
          {[
            {
              l: tr("draw", lang),
              v: new Date(r.drawDate).toLocaleDateString(
                lang === "es" ? "es-CO" : "en-US",
                { day: "2-digit", month: "short" },
              ),
            },
            { l: tr("numbers", lang), v: r.totalNumbers.toLocaleString() },
            {
              l: tr("price", lang),
              v: `$${r.pricePerNumber.toLocaleString()}`,
            },
            { l: tr("digits", lang), v: r.digits.toString() },
          ].map(({ l, v }) => (
            <div
              key={l}
              style={{
                background: "var(--bg)",
                borderRadius: 6,
                padding: "8px 10px",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {l}
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-mono)",
                  marginTop: 2,
                }}
              >
                {v}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 14 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              color: "var(--text-muted)",
              marginBottom: 5,
            }}
          >
            <span>
              {lang === "es" ? "Progreso de ventas" : "Sales progress"}
            </span>
            <span style={{ color: "#48BB78", fontWeight: 700 }}>{pct}%</span>
          </div>
          <div
            style={{ height: 6, background: "var(--border)", borderRadius: 99 }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 99,
                background: "linear-gradient(to right, #48BB78, #38A169)",
                width: `${pct}%`,
                transition: "width 0.5s",
              }}
            />
          </div>
          <div
            style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}
          >
            {sold} {tr("of", lang)} {r.totalNumbers}{" "}
            {lang === "es" ? "vendidos" : "sold"}
          </div>
        </div>

        {r.winnerNumber != null && (
          <div
            style={{
              marginBottom: 12,
              padding: "8px 12px",
              borderRadius: 8,
              background: "#FFFBEB",
              border: "1px solid #F6AD55",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 16 }}>🏆</span>
            <span style={{ fontSize: 13, color: "#7B4F12", fontWeight: 600 }}>
              #{r.winnerNumber.padStart(r.digits, "0")} &nbsp; ★ &nbsp;{" "}
              {truncarText(r.winnerName!, 27, true)}
            </span>
          </div>
        )}
        {r.status == "active" && (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => openBoard(r.id)}
              style={{
                flex: 1,
                padding: "9px",
                borderRadius: 8,
                border: "none",
                background: "#1A365D",
                color: "#fff",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {tr("view_board", lang)}
            </button>
            {user && user.roleId <= ID_PROFILE_ADMIN && (
              <button
                onClick={() => {
                  openEditor(r);
                  dispatch(
                    addToast({
                      type: "info",
                      message: lang === "es" ? "Modo edición" : "Edit mode",
                    }),
                  );
                }}
                style={{
                  padding: "9px 14px",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "none",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                {tr("edit", lang)}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
