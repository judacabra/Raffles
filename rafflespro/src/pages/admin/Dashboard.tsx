import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setActiveView } from "../../store/slices/uiSlice";
import { setActiveRaffle } from "../../store/slices/raffleSlice";

import { tr } from "../../i18n/translations";

function useCountdown(targetDate: string) {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    function calc() {
      const diff = new Date(targetDate).getTime() - Date.now();
      
      if (diff <= 0) { setTime({ days: 0, hours: 0, mins: 0, secs: 0 }); return; }
      
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      
      setTime({ days, hours, mins, secs });
    }

    calc();
    
    const id = setInterval(calc, 1000);
    
    return () => clearInterval(id);
  }, [targetDate]);
  return time;
}

const statusColors: Record<string, { bg: string; color: string }> = {
  active:    { bg: "#C6F6D5", color: "#276749" },
  draft:     { bg: "#E2E8F0", color: "#4A5568" },
  completed: { bg: "#BEE3F8", color: "#2C5282" },
  closed:    { bg: "#FED7D7", color: "#9B2C2C" },
};

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const lang = useAppSelector((s) => s.ui.language);
  const theme = useAppSelector((s) => s.ui.theme);
  const raffles = useAppSelector((s) => s.raffle.raffles);

  const activeRaffles = raffles.filter((r) => r.status === "active" && new Date(r.drawDate).getTime() > Date.now());
  const nextRaffle = [...activeRaffles].sort((a, b) => new Date(a.drawDate).getTime() - new Date(b.drawDate).getTime())[0];

  const countdown = useCountdown(nextRaffle?.drawDate);

  const totalSold = raffles.reduce((sum, r) => sum + r.numbers.filter((n) => n.status === "sold").length, 0);
  const soldToday = Math.floor(totalSold * 0.12);
  const revenue = raffles.reduce((sum, r) => sum + r.numbers.filter((n) => n.status === "sold").length * r.pricePerNumber, 0);

  const stats = [
    { label: tr("active_raffles", lang), value: activeRaffles.length.toString(), icon: "🎟", color: "#1A365D", bg: "#EBF4FF" },
    { label: tr("sold_today", lang), value: soldToday.toString(), icon: "📈", color: "#276749", bg: "#F0FFF4" },
    { label: tr("total_sold", lang), value: totalSold.toLocaleString(), icon: "🎯", color: "#7B4F12", bg: "#FFFBEB" },
    { label: tr("estimated_revenue", lang), value: `$${(revenue / 1000).toFixed(1)}K`, icon: "💰", color: "#553C9A", bg: "#FAF5FF" },
  ];

  function openBoard(raffleId: string) {
    dispatch(setActiveRaffle(raffleId));
    dispatch(setActiveView("board"));
  }

  return (
    <div className="animate-fade-in" style={{ padding: 28, maxWidth: 1200, margin: "0 auto" }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 28 }}>
        {stats.map((s) => (
          <div key={s.label} style={{
            background: "var(--bg-card)", borderRadius: 12, padding: "20px 24px",
            boxShadow: "var(--shadow-sm)", borderLeft: `4px solid ${s.color}`,
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: s.bg, color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)", lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, marginBottom: 28 }}>
        {/* Recent Raffles */}
        <div style={{ background: "var(--bg-card)", borderRadius: 12, boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
              {tr("recent_raffles", lang)}
            </h2>
            <button
              onClick={() => dispatch(setActiveView("raffles"))}
              style={{
                padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer",
                background: "#1A365D", color: "#FFFFFF", fontSize: 13, fontWeight: 600,
                fontFamily: "var(--font-sans)",
              }}
            >
              + {tr("new_raffle", lang)}
            </button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "var(--bg)" }}>
                  {[tr("raffle_name", lang), tr("draw_date", lang), tr("status", lang), tr("winner_num", lang), tr("winner", lang), ""].map((h) => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {raffles.map((r) => {
                  const badge = statusColors[r.status] ?? statusColors.draft;
                  const sold = r.numbers.filter((n) => n.status === "sold").length;
                  const pct = Math.round((sold / r.totalNumbers) * 100);
                  return (
                    <tr key={r.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "14px 16px", color: "var(--text-primary)", fontWeight: 500, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {r.name}
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{pct}% vendido</div>
                      </td>
                      <td style={{ padding: "14px 16px", color: "var(--text-secondary)", whiteSpace: "nowrap", fontFamily: "var(--font-mono)", fontSize: 12 }}>
                        {new Date(r.drawDate).toLocaleDateString(lang === "es" ? "es-CO" : "en-US", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: badge.bg, color: badge.color }}>
                          {tr(r.status, lang)}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", fontFamily: "var(--font-mono)", fontWeight: 600, color: r.winnerNumber != null ? "#F6AD55" : "var(--text-muted)" }}>
                        {r.winnerNumber != null ? String(r.winnerNumber).padStart(r.digits, "0") : "—"}
                      </td>
                      <td style={{ padding: "14px 16px", color: "var(--text-secondary)", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {r.winnerName ?? "—"}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <button
                          onClick={() => openBoard(r.id)}
                          style={{
                            padding: "5px 12px", borderRadius: 6, border: "1px solid var(--border)",
                            background: "none", cursor: "pointer", fontSize: 12, color: theme === "dark" ? "#fff" : "#1A365D",
                            fontWeight: 600, whiteSpace: "nowrap",
                          }}
                        >
                          {tr("view_board", lang)}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Countdown */}
        {nextRaffle && (
          <div style={{
            background: "linear-gradient(135deg, #1A365D 0%, #2D4A7F 100%)",
            borderRadius: 12, padding: 24, color: "#FFFFFF", boxShadow: "var(--shadow-md)",
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#F6AD5599", marginBottom: 8 }}>
              {tr("next_draw", lang)}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 20, lineHeight: 1.3, color: "#FFFFFF" }}>
              {nextRaffle.name}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 20 }}>
              {[
                { v: countdown.days, l: tr("days", lang) },
                { v: countdown.hours, l: tr("hours", lang) },
                { v: countdown.mins, l: tr("mins", lang) },
                { v: countdown.secs, l: tr("secs", lang) },
              ].map(({ v, l }) => (
                <div key={l} style={{ textAlign: "center", background: "#FFFFFF15", borderRadius: 8, padding: "12px 4px" }}>
                  <div style={{
                    fontFamily: "var(--font-mono)", fontSize: 28, fontWeight: 700,
                    color: "#F6AD55", lineHeight: 1,
                    animation: "countdown 1s ease-out",
                  }}>
                    {String(v).padStart(2, "0")}
                  </div>
                  <div style={{ fontSize: 10, color: "#FFFFFF80", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>{l}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#FFFFFF80", marginBottom: 6 }}>
                <span>{tr("total_sold", lang)}</span>
                <span style={{ color: "#F6AD55", fontWeight: 600 }}>
                  {nextRaffle.numbers.filter((n) => n.status === "sold").length} {tr("of", lang)} {nextRaffle.totalNumbers}
                </span>
              </div>
              <div style={{ height: 6, background: "#FFFFFF20", borderRadius: 99 }}>
                <div style={{
                  height: "100%", borderRadius: 99, background: "#F6AD55",
                  width: `${(nextRaffle.numbers.filter((n) => n.status === "sold").length / nextRaffle.totalNumbers) * 100}%`,
                  transition: "width 1s",
                }} />
              </div>
            </div>

            <button
              onClick={() => openBoard(nextRaffle.id)}
              style={{
                width: "100%", padding: "12px", borderRadius: 8, border: "none",
                background: "#F6AD55", color: "#7B4F12", fontWeight: 700, cursor: "pointer",
                fontFamily: "var(--font-display)", fontSize: 14,
              }}
            >
              {tr("view_board", lang)} →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
