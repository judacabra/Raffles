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
import { FilterStatusLabel, OrderByValue } from "@/types/raffle.types";

import { RaffleCard } from "../../components/RaffleCard";
import { Carousel } from "../../components/Carousel";

function RafflesPage () {
  const navigate: NavigateFunction = useNavigate();

  const lang: Language = useAppSelector((s) => s.ui.language);
  const company: Company | null = useAppSelector((s) => s.auth.activeCompany);
  const user: User | null = useAppSelector((s) => s.auth.user);
  const theme: any = useAppSelector((s) => s.ui.theme);

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
                padding: "5px 11px 7px", borderRadius: 8, border: ".5px solid var(--border)", 
                background: filteredWithFilters 
                  ? theme === "dark" 
                    ? "var(--text-primary)" 
                    : "var(--bg-sidebar)"
                  : theme === "light"
                    ? "#fff" 
                    : "var(--bg-sidebar)",
                color: !filteredWithFilters 
                  ? theme === "dark" 
                    ? "var(--text-primary)" 
                    : "var(--bg-sidebar)"
                  : theme === "light"
                    ? "#fff" 
                    : "var(--bg-sidebar)", 
                cursor: "pointer", fontSize: 20, fontWeight: 700, 
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

      {filtered.length < 4 ? (
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
            filtered.map((r: Raffle) => <RaffleCard key={r.id} r={r} />)
          )}
        </div>
      ) : (
        <Carousel 
          lang={lang} 
          items={filtered.map((r: Raffle) => <RaffleCard key={r.id} r={r} />)} 
        />
      )}
        
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
                   border: ".5px solid var(--border)", padding: "8px", borderRadius: 10, fontSize: 14,
                 }}
                 onChange={(e) => setOrderBy(e.target.value as OrderByValue)}
               >
                 {ORDER_BY_ARR.map((o: OrderByOpt) => (
                   <option value={o.value} key={o.value} style={{ fontSize: 14, background: "var(--bg)" }}> {tr(o.label, lang)} </option>
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
                   border: ".5px solid var(--border)", padding: "8px", borderRadius: 10, fontSize: 14,
                 }}
                 onChange={(e) => setFilterStatus(e.target.value as FilterStatusLabel)}
               >
                 {FILTER_STATUS_ARR.map((s: FilterStatus) => (
                   <option value={s.label} key={s.value} style={{ fontSize: 14, background: "var(--bg)" }}> {tr(s.label, lang)} </option>
                 ))}
               </select>
             </div>
             <div style={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
               <button  
                 style={{
                   marginTop: 20, padding: "6px 12px", border: `.5px solid ${!filteredWithFilters ? "#777" : "#f6ad55"}`, 
                   borderRadius: 7, fontSize: 13, cursor: !filteredWithFilters ? "not-allowed" : "pointer",
                   background: !filteredWithFilters ? "var(--border)" : "var(--color-gold)", color: !filteredWithFilters ? "#777" : "#fff", 
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
