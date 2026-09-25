import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateNumberStatus, setActiveRaffle, RaffleNumber, Raffle, } from "../../store/slices/raffleSlice";
import { setActiveView, addToast } from "../../store/slices/uiSlice";
import { tr } from "../../i18n/translations";
import { GetRaffles } from "../../api/raffleAPI";

export default function NumberBoard() {
  const dispatch = useAppDispatch();

  const lang = useAppSelector((s) => s.ui.language);

  // const raffles = useAppSelector((s) => s.activeRaffle.raffles);
  // const activeRaffle = useAppSelector((s) => s.activeRaffle.activeRaffle);

  const [rafflesFounded, setRafflesFounded] = useState<boolean>(false);
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [activeRaffle, setActiveRaffle] = useState<any>(null);

  const [selected, setSelected] = useState<RaffleNumber[] | null>(null);
  const [buyer, setBuyer] = useState("");
  const [phone, setPhone] = useState("");
  const [filter, setFilter] = useState<"all" | "available" | "sold">("all");
  const [search, setSearch] = useState("");
  const [iframe, setIframe] = useState(false);

  const nums =
    activeRaffle && activeRaffle.numbers
      ? activeRaffle.numbers.filter((n: any) => {
          if (filter !== "all" && n.status !== filter) return false;
          if (
            search &&
            !String(n.num).padStart(activeRaffle.digits, "0").includes(search)
          )
            return false;
          return true;
        })
      : [];

  const counts = {
    available:
      activeRaffle && activeRaffle.numbers
        ? activeRaffle.numbers.filter((n: any) => n.status === "available")
            .length
        : 0,
    sold:
      activeRaffle && activeRaffle.numbers
        ? activeRaffle.numbers.filter((n: any) => n.status === "sold").length
        : 0,
  };

  const handleNumberClick = (n: RaffleNumber): void => {
    if (n.status !== "available") return;

    setSelected((prev) => {
      const list = prev ?? [];
      const exists = list.some((item) => item.num === n.num);

      const next = exists
        ? list.filter((item) => item.num !== n.num)
        : [...list, n];

      return next.length === 0 ? null : next;
    });
    
    setBuyer("");
    setPhone("");
  };

  const confirmSale = async (): Promise<void> => {
    if (!selected || !buyer.trim() || !phone.trim()) return;
    // dispatch(updateNumberStatus({ raffleId: activeRaffle.id, num: selected.num, status: "sold", buyer: buyer.trim(), phone: phone.trim() }));
    // dispatch(setActiveRaffle(activeRaffle.id));
    dispatch(addToast({ 
      type: "success", 
      message: `${tr("sale_confirmed", lang)} 
        (#${String(selected && 
          selected.map((s) => String(s.num)
            .padStart(activeRaffle.digits, "0"))
            .join(", #"))
        }) → ${buyer}` 
    }));

    setTimeout(() => {
      setSelected(null);
      setBuyer("");
      setPhone("");
    }, 1500)
  };

  const cols: number = activeRaffle
    ? activeRaffle.totalNumbers <= 100 ? 10
      : activeRaffle.totalNumbers <= 500 ? 10
        : 10 : 0;

  const validateNumber = (value: string): boolean => {
    return /^\d*$/.test(value);
  };

  const validatePhoneNumber = (value: string): boolean => {
    return value.length < 11;
  };

  const fetchRaffles = async (idC: number): Promise<void> => {
    try {
      const data = await GetRaffles(idC);
      setRaffles(data);

      const firstActive: any = data.find((r: any) => r.status === "active");
      setActiveRaffle(firstActive);
    } catch (err: any) {
      console.error(`Error al obtener las rifas de la empresa #${idC}`, err);
    } finally {
      setRafflesFounded(true);
    }
  };

  useEffect(() => {
    if (!rafflesFounded) fetchRaffles(1);
  }, [rafflesFounded]);

  if (!activeRaffle) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: 400,
          gap: 16,
        }}
      >
        <div style={{ fontSize: 48 }}>🎟</div>
        <p style={{ color: "var(--text-muted)", fontSize: 16 }}>
          {lang === "es" ? "No hay rifas activas." : "No active raffles."}
        </p>
        <button
          onClick={() => dispatch(setActiveView("raffles"))}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            background: "#1A365D",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {tr("new_raffle", lang)}
        </button>
      </div>
    );
  }

  return (
    <div
      className="animate-fade-in"
      style={{
        display: "flex",
        height: "calc(100vh - 64px)",
        overflow: "hidden",
      }}
    >
      {/* Main board */}
      <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
        {/* Raffle selector */}
        <div
          style={{
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <select
            value={(selected && selected[0].num) ?? ""}
            // onChange={(e) => dispatch(setActiveRaffle(e.target.value))}
            onChange={() => {}}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--bg-card)",
              color: "var(--text-primary)",
              fontSize: 14,
              fontFamily: "var(--font-sans)",
              cursor: "pointer",
            }}
          >
            {raffles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          <input
            placeholder="Buscar número..."
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              if (validateNumber(value)) setSearch(value);
            }}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--bg-card)",
              color: "var(--text-primary)",
              fontSize: 14,
              fontFamily: "var(--font-mono)",
              width: 160,
            }}
          />
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            {(["all", "available", "sold"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "var(--font-sans)",
                  background: filter === f ? "#1A365D" : "var(--bg-card)",
                  color: filter === f ? "#fff" : "var(--text-secondary)",
                  boxShadow: filter === f ? "none" : "0 1px 2px #0000001A",
                }}
              >
                {f === "all" ? (lang === "es" ? "Todos" : "All") : tr(f, lang)}
                {f !== "all" && (
                  <span style={{ marginLeft: 4, opacity: 0.7 }}>
                    ({counts[f]})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          {[
            { cls: "num-available", label: tr("available", lang) },
            { cls: "num-sold", label: tr("sold", lang) },
            ...(activeRaffle.status == "completed"
              ? [
                  {
                    cls: "num-winner",
                    label: lang === "es" ? "Ganador" : "Winner",
                  },
                ]
              : []),
          ].map(({ cls, label }) => (
            <div
              key={label}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <div
                className={cls}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                }}
              >
                {cls === "num-winner" ? "★" : ""}
              </div>
              <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gap: 6,
          }}
        >
          {nums.map((n: any) => {
            const label = String(n.num).padStart(activeRaffle.digits, "0");
            const cls = selected?.includes(n) 
              ? "num-reserved" 
              : n.status === "winner"
                ? "num-winner"
                : n.status === "sold"
                  ? "num-sold"
                  : "num-available";

            return (
              <button
                key={n.num}
                onClick={() => handleNumberClick(n)}
                className={cls}
                title={n.buyer ? `${n.buyer} · ${n.phone ?? ""}` : label}
                style={{
                  borderRadius: 6,
                  border:
                    n.status === "winner"
                      ? "3px solid #F6AD55"
                      : "1px solid transparent",
                  padding: "8px 4px",
                  fontSize: activeRaffle.totalNumbers > 500 ? 11 : 13,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                  cursor: n.status === "available" ? "pointer" : "default",
                  position: "relative",
                  minWidth: 0,
                }}
              >
                {n.status === "winner" && (
                  <span
                    style={{
                      position: "absolute",
                      top: 2,
                      right: 3,
                      fontSize: 9,
                    }}
                  >
                    ★
                  </span>
                )}
                {label}
              </button>
            );
          })}
        </div>

        {nums.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: 48,
              color: "var(--text-muted)",
            }}
          >
            {tr("no_data", lang)}
          </div>
        )}
      </div>

      {/* Sale drawer */}
      <div
        className={selected ? "animate-slide-in" : ""}
        style={{
          width: selected ? 320 : 0,
          flexShrink: 0,
          overflow: "hidden",
          background: "var(--bg-card)",
          borderLeft: "1px solid var(--border)",
          transition: "width 0.3s cubic-bezier(.25,.46,.45,.94)",
        }}
      >
        {selected && (
          <div style={{ padding: 24, width: 320, }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxHeight: "75vh", overflow: "hidden" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, overflowY: "auto", flex: 1, paddingRight: 4 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 18,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {tr("confirm_sale", lang)}
                  </h3>
                  <button
                    onClick={() => setSelected(null)}
                    style={{
                      background: "none", border: "none", cursor: "pointer", 
                      color: "var(--text-muted)", fontSize: 20,
                    }}
                  >
                    ×
                  </button>
                </div>

                <div style={{ textAlign: "center", marginBottom: 24, }}>
                  <div
                    style={{
                      display: "grid",
                      alignSelf: "center",
                      gridTemplateColumns: 
                        `repeat(${selected.length === 1 ? "1" 
                          : selected.length === 2 ? "2" 
                            : selected.length === 3 ? "3" 
                              : 4
                        }, 50px)`,
                      gap: 12,
                      justifyContent: "center", 
                      width: "100%",
                      margin: "10px 0",
                    }}
                  >
                    {selected.map((s: any) => (
                      <div
                        key={s.id}
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 16,
                          background: "linear-gradient(135deg, #C6F6D5, #9AE6B4)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "var(--font-mono)",
                          fontSize: 20,
                          fontWeight: 800,
                          color: "#276749",
                        }}
                      >
                        {String(s.num).padStart(activeRaffle.digits, "0")}
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {selected.length + " " + tr("number_selected", lang)}
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#48BB78",
                      marginTop: 4,
                    }}
                  >
                    $ {(activeRaffle.pricePerNumber * selected.length).toLocaleString()}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--text-muted)",
                        marginBottom: 6,
                        textTransform: "uppercase",
                      }}
                    >
                      {tr("client_name", lang)} *
                    </label>
                    <input
                      value={buyer}
                      onChange={(e) => setBuyer(e.target.value)}
                      placeholder="Ana García"
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: 8,
                        border: "2px solid var(--border)",
                        background: "var(--bg)",
                        color: "var(--text-primary)",
                        fontSize: 14,
                        outline: "none",
                        fontFamily: "var(--font-sans)",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#1A365D")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--text-muted)",
                        marginBottom: 6,
                        textTransform: "uppercase",
                      }}
                    >
                      {tr("phone", lang)}
                    </label>
                    <input
                      value={phone}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (validateNumber(value) && validatePhoneNumber(value)) setPhone(value);
                      }}
                      placeholder="300 000 0000"
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: 8,
                        border: "2px solid var(--border)",
                        background: "var(--bg)",
                        color: "var(--text-primary)",
                        fontSize: 14,
                        outline: "none",
                        fontFamily: "var(--font-mono)",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#1A365D")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                    />
                  </div>

                  <button
                    onClick={confirmSale}
                    disabled={!buyer.trim() && !phone.trim()}
                    style={{
                      padding: "14px",
                      borderRadius: 8,
                      border: "none",
                      background: (buyer.trim() && phone.trim()) ? "#48BB78" : "#A0AEC0",
                      color: "#FFFFFF",
                      fontWeight: 700,
                      fontSize: 15,
                      cursor: (buyer.trim() && phone.trim()) ? "pointer" : "not-allowed",
                      fontFamily: "var(--font-display)",
                      marginTop: 4,
                      boxShadow: (buyer.trim() && phone.trim()) ? "0 4px 12px #48BB7840" : "none",
                    }}
                  >
                    ✓ {tr("proceed_to_payment", lang)}
                  </button>
                  <button
                    onClick={() => setSelected(null)}
                    style={{
                      padding: "10px",
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      background: "none",
                      color: "var(--text-muted)",
                      cursor: "pointer",
                      fontSize: 14,
                    }}
                  >
                    {tr("cancel", lang)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
