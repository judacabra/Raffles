import { useState } from "react";
import { useAppSelector } from "../../store/hooks";
import { tr } from "../../i18n/translations";

interface LogEntry {
  id: string;
  datetime: string;
  user: string;
  action: string;
  actionIcon: string;
  table: string;
  prev: Record<string, unknown>;
  next: Record<string, unknown>;
}

const MOCK_LOGS: LogEntry[] = [
  { id: "l1", datetime: "2024-11-28 14:32:07", user: "Carlos Mendoza", action: "Venta de número", actionIcon: "💰", table: "raffle_numbers", prev: { status: "available" }, next: { status: "sold", buyer: "Ana Torres", phone: "+57 300 1234567" } },
  { id: "l2", datetime: "2024-11-28 13:15:44", user: "Ana García", action: "Creación de rifa", actionIcon: "✨", table: "raffles", prev: {}, next: { name: "Rifa del Auto 2024", totalNumbers: 1000, drawDate: "2024-12-31" } },
  { id: "l3", datetime: "2024-11-28 11:02:31", user: "Carlos Mendoza", action: "Edición de usuario", actionIcon: "✏️", table: "users", prev: { role: "viewer", active: true }, next: { role: "seller", active: true } },
  { id: "l4", datetime: "2024-11-27 18:44:12", user: "María López", action: "Reserva de número", actionIcon: "🕐", table: "raffle_numbers", prev: { status: "available" }, next: { status: "reserved", buyer: "Pedro Gómez" } },
  { id: "l5", datetime: "2024-11-27 16:30:05", user: "Luis Torres", action: "Sorteo realizado", actionIcon: "🎉", table: "raffles", prev: { status: "active", winnerNumber: null }, next: { status: "completed", winnerNumber: 247, winnerName: "Jorge Martínez" } },
  { id: "l6", datetime: "2024-11-27 09:15:22", user: "Admin Sistema", action: "Login de usuario", actionIcon: "🔐", table: "sessions", prev: {}, next: { user: "Carlos Mendoza", ip: "192.168.1.42" } },
  { id: "l7", datetime: "2024-11-26 15:55:18", user: "Carlos Mendoza", action: "Eliminación de número reservado", actionIcon: "🗑️", table: "raffle_numbers", prev: { status: "reserved", buyer: "Sin confirmar" }, next: { status: "available" } },
  { id: "l8", datetime: "2024-11-26 10:12:03", user: "Sofía Vargas", action: "Creación de empresa", actionIcon: "🏢", table: "companies", prev: {}, next: { name: "Premios del Norte", plan: "enterprise" } },
];

export default function LogsPage() {
  const lang = useAppSelector((s) => s.ui.language);
  const [detail, setDetail] = useState<LogEntry | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const filtered = MOCK_LOGS.filter((l) =>
    l.user.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.table.toLowerCase().includes(search.toLowerCase())
  );

  const pages = Math.ceil(filtered.length / PER_PAGE);
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="animate-fade-in" style={{ padding: 28, maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
            {tr("audit_log", lang)}
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "var(--text-muted)" }}>
            {filtered.length} {lang === "es" ? "registros encontrados" : "records found"}
          </p>
        </div>
        <input
          value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder={tr("search", lang)}
          style={{
            padding: "8px 14px", borderRadius: 8, border: "1px solid var(--border)",
            background: "var(--bg-card)", color: "var(--text-primary)", fontSize: 13, width: 240,
          }}
        />
      </div>

      <div style={{ background: "var(--bg-card)", borderRadius: 12, boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "var(--bg)" }}>
              {[tr("datetime", lang), tr("user", lang), tr("action", lang), tr("table", lang), tr("detail", lang)].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((log) => (
              <tr key={log.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "14px 16px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                  {log.datetime}
                </td>
                <td style={{ padding: "14px 16px", fontWeight: 500, color: "var(--text-primary)", whiteSpace: "nowrap" }}>
                  {log.user}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{log.actionIcon}</span>
                    <span style={{ color: "var(--text-secondary)" }}>{log.action}</span>
                  </div>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <code style={{ padding: "2px 8px", borderRadius: 4, background: "var(--bg)", color: "#553C9A", fontSize: 12, fontFamily: "var(--font-mono)" }}>
                    {log.table}
                  </code>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <button
                    onClick={() => setDetail(log)}
                    style={{
                      padding: "5px 12px", borderRadius: 6, border: "1px solid var(--border)",
                      background: "none", cursor: "pointer", fontSize: 12, color: "#1A365D",
                      fontWeight: 600, whiteSpace: "nowrap",
                    }}
                  >
                    🔍 {tr("view_detail", lang)}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--border)" }}>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {lang === "es" ? "Página" : "Page"} {page} {tr("of", lang)} {pages}
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                style={{
                  width: 32, height: 32, borderRadius: 6, border: "1px solid var(--border)",
                  background: p === page ? "#1A365D" : "var(--bg-card)",
                  color: p === page ? "#fff" : "var(--text-secondary)",
                  cursor: "pointer", fontSize: 13, fontWeight: 600,
                }}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {detail && (
        <div style={{
          position: "fixed", inset: 0, background: "#00000060", zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center",
        }} onClick={(e) => { if (e.target === e.currentTarget) setDetail(null); }}>
          <div className="animate-fade-in" style={{
            background: "var(--bg-card)", borderRadius: 16, padding: 32, width: "100%", maxWidth: 540,
            boxShadow: "0 25px 60px #00000040",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                  {detail.actionIcon} {detail.action}
                </h3>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }}>
                  {detail.user} · {detail.datetime}
                </p>
              </div>
              <button onClick={() => setDetail(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 22 }}>×</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { label: tr("previous_value", lang), data: detail.prev, color: "#FED7D7", text: "#9B2C2C" },
                { label: tr("new_value", lang), data: detail.next, color: "#C6F6D5", text: "#276749" },
              ].map(({ label, data, color, text }) => (
                <div key={label}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: text, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, padding: "4px 8px", background: color, borderRadius: 4, display: "inline-block" }}>
                    {label}
                  </div>
                  <pre style={{
                    background: "var(--bg)", borderRadius: 8, padding: "14px", fontSize: 12,
                    fontFamily: "var(--font-mono)", color: "var(--text-primary)", overflow: "auto",
                    margin: 0, maxHeight: 200, border: "1px solid var(--border)",
                  }}>
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>
              ))}
            </div>

            <button onClick={() => setDetail(null)}
              style={{ marginTop: 20, width: "100%", padding: "10px", borderRadius: 8, border: "1px solid var(--border)", background: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 14 }}>
              {tr("close", lang)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
