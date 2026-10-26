import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../store/hooks";

import { addToast, Language } from "../../store/slices/uiSlice";
import { setActiveRaffle } from "../../store/slices/raffleSlice";
import { User, Company } from "../../store/slices/authSlice";

import { tr } from "../../i18n/translations";
import { appConfig } from "../../config";

import { GetRaffles } from "../../api/raffleAPI";

import { FilterStatus, OrderByOpt, Raffle } from "../../interfaces/raffle.interfaces";

import { ID_PROFILE_ADMIN } from "../../constants/constants";
import { truncarText } from "../../utils/format-words";
import { FilterStatusLabel, OrderByValue } from "@/types/raffle.types";

function RafflesPage () {
  const dispatch = useAppDispatch();

  const navigate: NavigateFunction = useNavigate();

  const { uploadsFolder } = appConfig;

  const lang: Language = useAppSelector((s) => s.ui.language);
  const company: Company | null = useAppSelector((s) => s.auth.activeCompany);
  const user: User | null = useAppSelector((s) => s.auth.user);

  const [openModalFilter, setOpenModalFilter] = useState<boolean>(false);

  const [orderBy, setOrderBy] = useState<OrderByValue>("mr");
  const [filterStatus, setFilterStatus] = useState<FilterStatusLabel>("all");

  const [rafflesFounded, setRafflesFounded] = useState<boolean>(false);
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [search, setSearch] = useState<string>("");

  const filtered: Raffle[] = raffles.length > 0 
    ? raffles.filter((r: Raffle) =>
      (
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase()) 
      ) &&
      (
        filterStatus === "all" ||
        filterStatus === r.status
      )
    ).sort((a, b) => {
      const dateA = new Date(a.drawDate).getTime();
      const dateB = new Date(b.drawDate).getTime();

      return orderBy === "rf"
        ? dateB - dateA
        : orderBy === "of" 
          ? dateA - dateB 
          : dateB - dateA
    }): [];

  const filteredWithFilters: boolean = filterStatus !== "all" || orderBy !== "mr";
  const existInactives: boolean = filtered.some((r: Raffle) => r.status === "inactive");

    const ORDER_BY_ARR: OrderByOpt[] = [
    { 
      value: "mr", 
      label: "most_relevants" 
    },
    { 
      value: "rf", 
      label: "most_recents_first" 
    },
    { 
      value: "of", 
      label: "oldest_first" 
    },
  ];

  const FILTER_STATUS_ARR: FilterStatus[] = [
    { value: "all", label: "all" },
    { value: "a", label: "active" },
    ...(existInactives
        ? ([{ value: "in", label: "inactive" }] as FilterStatus[])
        : []),
    { value: "c", label: "completed" },
  ];

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

  const fetchRaffles = async (idC: number): Promise<void> => {
    try {
      const data = await GetRaffles(idC);
      setRaffles(data);
    } catch (err: any) {
      console.error(`Error al obtener las rifas de la empresa #${idC}`, err);
    } finally {
      setRafflesFounded(true);
    }
  };

  useEffect(() => {
    if (!rafflesFounded && company) fetchRaffles(company.id);
  }, [rafflesFounded, company]);

  return (
    <div className="animate-fade-in" style={{ padding: 28, maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
            {tr("raffles", lang)}
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "var(--text-muted)" }}>
            {filtered.length > 0 && filtered.length + " " + tr("total_raffles" , lang)}
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
          <button 
              onClick={() => setOpenModalFilter(true)}
              style={{ 
                padding: "5px 11px 7px", borderRadius: 8, border: ".5px solid #ebebeb", background: filteredWithFilters ? "#1A365D" : "#fff", 
                color: !filteredWithFilters ? "#1A365D" : "#fff", cursor: "pointer", fontSize: 20, fontWeight: 700, 
                marginRight: 10, position: "relative",
              }}
              title={tr("filters", lang)}
            >
              ᯤ
              {filteredWithFilters && (
                <span
                  style={{
                    position: "absolute", top: 6, right: 4, width: 8, height: 8,
                    borderRadius: "50%", background: "#FC8181", border: "2px solid var(--bg-header)",
                  }}
                />
              )}
            </button>
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={tr("search", lang)}
            style={{
              padding: "11px 14px", borderRadius: 8, border: "1px solid var(--border)",
              background: "var(--bg-card)", color: "var(--text-primary)", fontSize: 13,
              fontFamily: "var(--font-sans)", width: 220, marginRight: 10, 
            }}
            />
          {(user && user.roleId <= ID_PROFILE_ADMIN) && (
            <button 
              onClick={() => openEditor()}
              style={{ 
                padding: "10px 20px", borderRadius: 8, border: "none", background: "#1A365D", 
                color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700, 
                boxShadow: "0 4px 12px #1A365D40",
              }}
            >
              + {tr("new_raffle", lang)}
            </button>
          )}
        </div>
      </div>

      <div 
        style={{ 
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", 
          gap: 20, height: filtered.length === 0 ? "70vh" : "", 
        }}
      >
        {filtered.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
            {tr("no_raffles_found", lang)}
          </div>
        ) : ( 
          filtered.map((r: Raffle) => {
            const badge: any = statusColors[r.status] ?? statusColors.draft;
            const sold: number = r.numbers.filter((n: any) => n.status === "sold").length;
            const pct: number = Math.round((sold / r.totalNumbers) * 100);

            return (
              <div key={r.id} style={{
                background: "var(--bg-card)", borderRadius: 12, overflow: "hidden",
                boxShadow: "var(--shadow-sm)", transition: "transform 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "var(--shadow-lg)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}
              >
                <div style={{
                  height: 120, background: r.image
                    ? `linear-gradient(to bottom, #0000004D, #000000A0), url(${uploadsFolder + "/" + r.image}) center/cover`
                    : `linear-gradient(135deg, ${r.bgColor}, ${r.bgColor}CC)`,
                  display: "flex", alignItems: "flex-end", padding: "12px 16px",
                  position: "relative",
                }}>
                  <span style={{ position: "absolute", top: 12, left: 16, fontSize: 28 }}>{themeEmoji[r.theme]}</span>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, fontFamily: "var(--font-display)", textShadow: "0 1px 4px #000" }}>
                    {r.name}
                  </div>
                  <span style={{ position: "absolute", top: 12, right: 12, padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: badge.bg, color: badge.color }}>
                    {tr(r.status, lang)}
                  </span>
                </div>

                <div style={{ padding: "16px 18px" }}>
                  <p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
                    {r.description || (lang === "es" ? "Sin descripción" : "No description")}
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                    {[
                      { l: tr("draw", lang), v: new Date(r.drawDate).toLocaleDateString(lang === "es" ? "es-CO" : "en-US", { day: "2-digit", month: "short" }) },
                      { l: tr("numbers", lang), v: r.totalNumbers.toLocaleString() },
                      { l: tr("price" , lang), v: `$${r.pricePerNumber.toLocaleString()}` },
                      { l: tr("digits" , lang), v: r.digits.toString() },
                    ].map(({ l, v }) => (
                      <div key={l} style={{ background: "var(--bg)", borderRadius: 6, padding: "8px 10px" }}>
                        <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{l}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-mono)", marginTop: 2 }}>{v}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)", marginBottom: 5 }}>
                      <span>{lang === "es" ? "Progreso de ventas" : "Sales progress"}</span>
                      <span style={{ color: "#48BB78", fontWeight: 700 }}>{pct}%</span>
                    </div>
                    <div style={{ height: 6, background: "var(--border)", borderRadius: 99 }}>
                      <div style={{ height: "100%", borderRadius: 99, background: "linear-gradient(to right, #48BB78, #38A169)", width: `${pct}%`, transition: "width 0.5s" }} />
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                      {sold} {tr("of", lang)} {r.totalNumbers} {lang === "es" ? "vendidos" : "sold"}
                    </div>
                  </div>

                  {r.winnerNumber != null && (
                    <div 
                      style={{ 
                        marginBottom: 12, padding: "8px 12px", borderRadius: 8, background: "#FFFBEB", 
                        border: "1px solid #F6AD55", display: "flex", alignItems: "center", gap: 8, 
                      }}
                    >
                      <span style={{ fontSize: 16 }}>🏆</span>
                      <span style={{ fontSize: 13, color: "#7B4F12", fontWeight: 600 }}>
                        #{r.winnerNumber.padStart(r.digits, "0")} &nbsp; ★ &nbsp; {truncarText(r.winnerName!, 27, true)}
                      </span>
                    </div>
                  )}
                  {r.status == "active" && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <button 
                        onClick={() => openBoard(r.id)}
                        style={{ 
                          flex: 1, padding: "9px", borderRadius: 8, border: "none", background: "#1A365D", 
                          color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, 
                        }}
                      >
                        {tr("view_board", lang)}
                      </button>
                      {user && user.roleId <= ID_PROFILE_ADMIN && (
                        <button 
                          onClick={() => { 
                            openEditor(r); 
                            dispatch(addToast({ type: "info", message: lang === "es" ? "Modo edición" : "Edit mode" })); 
                          }}
                          style={{ 
                            padding: "9px 14px", borderRadius: 8, border: "1px solid var(--border)", 
                            background: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: 13,
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
        }))}
      </div>

      {openModalFilter && (
        <div style={{
          position: "fixed", inset: 0, background: "#00000060", zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center",
        }} onClick={(e) => { if (e.target === e.currentTarget) setOpenModalFilter(false); }}>
          <div 
            className="animate-fade-in" 
            style={{
              background: "var(--bg-card)", borderRadius: 16, padding: "20px 32px 30px", width: "100%", 
              maxWidth: 440, boxShadow: "0 25px 60px #00000040",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <h1 
                style={{ 
                  margin: 0, fontSize: 18, fontWeight: 700, color: "var(--text-primary)", 
                  fontFamily: "var(--font-display)" 
                }}
              >
                {tr("filters", lang)}
              </h1>
              <button 
                onClick={() => setOpenModalFilter(false)} 
                style={{ 
                  background: "none", border: "none", cursor: "pointer", 
                  color: "var(--text-muted)", fontSize: 20 
                }}
              >
                ×
              </button>
            </div>
            <div 
              style={{ 
                display: "flex", justifyContent: "space-between", 
                alignItems: "center", marginBottom: 10, 
              }}
            >
              <span style={{ fontSize: 14, }}> {tr("order_by", lang)}: </span>
              <select 
                name="order_by" 
                id="order_by" 
                value={orderBy}
                style={{ 
                  border: ".5px solid #c2c2c2", padding: "8px", borderRadius: 10, fontSize: 14,
                }}
                onChange={(e) => setOrderBy(e.target.value as OrderByValue)}
              >
                {ORDER_BY_ARR.map((o: OrderByOpt) => (
                  <option value={o.value} key={o.value} style={{ fontSize: 14, }}> {tr(o.label, lang)} </option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", }}>
              <span style={{ fontSize: 14, }}> {tr("status", lang)}: </span>
              <select 
                name="status" 
                id="status" 
                value={filterStatus} 
                style={{ 
                  border: ".5px solid #c2c2c2", padding: "8px", borderRadius: 10, fontSize: 14,
                }}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatusLabel)}
              >
                {FILTER_STATUS_ARR.map((s: FilterStatus) => (
                  <option value={s.label} key={s.value} style={{ fontSize: 14, }}> {tr(s.label, lang)} </option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
              <button  
                style={{
                  marginTop: 20, padding: "6px 12px", border: `.5px solid ${!filteredWithFilters ? "#777" : "#f6ad55"}`, 
                  borderRadius: 7, fontSize: 13, cursor: !filteredWithFilters ? "not-allowed" : "pointer",
                  background: !filteredWithFilters ? "#d2d2d2" : "#f6ad55", color: !filteredWithFilters ? "#777" : "#fff", 
                }}
                title={!filteredWithFilters ? "" : tr("clear_filters", lang)}
                onClick={() => {
                  setOrderBy("mr");
                  setFilterStatus("all");
                }}
              > 
                {tr("clear_filters", lang)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RafflesPage;
