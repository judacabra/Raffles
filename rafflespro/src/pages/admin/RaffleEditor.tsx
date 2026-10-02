import { useEffect, useState } from "react";
import { NavigateFunction, useLocation, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addToast, Language } from "../../store/slices/uiSlice";

import { tr } from "../../i18n/translations";

import { SetRaffle } from "../../api/raffleAPI";

import { appConfig } from "../../config";

const Label = ({ children }: { children: React.ReactNode }) => 
  <label 
    style={{ 
      display: "block", fontSize: 12, fontWeight: 600, 
      color: "var(--text-muted)", textTransform: "uppercase", 
      letterSpacing: "0.06em", marginBottom: 4 
    }}
  >
    {children}
  </label>;

const Input = (
  { value, onChange, placeholder, type = "text" } : 
  { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }
) => 
  <input
    type={type} value={value} onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    style={{
      width: "100%", padding: "10px 14px", borderRadius: 8,
      border: "2px solid var(--border)", background: "var(--bg)",
      color: "var(--text-primary)", fontSize: 14, outline: "none",
      fontFamily: "var(--font-sans)", boxSizing: "border-box", transition: "border-color 0.2s",
    }}
    onFocus={(e) => e.target.style.borderColor = "#1A365D"}
    onBlur={(e) => e.target.style.borderColor = "var(--border)"}
  />;

const RaffleEditor = () => {
  const dispatch = useAppDispatch();

  const navigate: NavigateFunction = useNavigate();

  const { uploadsFolder } = appConfig;
  
  const company: any = useAppSelector((s) => s.auth.activeCompany);
  const lang: Language = useAppSelector((s) => s.ui.language);

  const location = useLocation();

  const initRaffle: any = { 
    companyId: company.id, 
    name: "",
    fontFamily: "Inter", 
    bgColor: "#2e52bd", 
    numColor: "#ffffff", 
    totalNumbers: 100, 
    digits: 2, 
  };
  
  const raffleSelected: any = location.state.raffleSelected ? location.state.raffleSelected : initRaffle; 
  
  const THEMES: any[] = [
    { id: "default", label: "Clásico", emoji: "🎰" },
    { id: "christmas", label: "Navideña", emoji: "🎄" },
    { id: "sports", label: "Deportiva", emoji: "⚽" },
    { id: "lottery", label: "Lotería", emoji: "🎱" },
  ];

  const FONTS: string[] = ["Inter", "Poppins", "Georgia", "JetBrains Mono", "Playfair Display"];

  const [loading, setLoading] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [raffle, setRaffle] = useState<any>(raffleSelected);
  const [step, setStep] = useState<number>(0);

  const steps: string[] = [tr("step_data", lang), tr("step_numbers", lang), tr("step_design", lang)];

  const previewNums = Array.from({ length: 12 }, (_, i) => ({
    num: i,
    status: [
      "available", "sold", "reserved", "available", "sold", "available", 
      "winner", "available", "sold", "reserved", "available", "available"
    ][i],
  }));

  const handleSave = async(): Promise<void> => {
    if (!raffle) return;

    try {
      setLoading(true);

      const dataSend = new FormData();

      dataSend.append('companyId', raffle.companyId);
      dataSend.append('name', raffle.name);
      dataSend.append('description', raffle.description);
      dataSend.append('digits', raffle.digits);
      dataSend.append('bgColor', raffle.bgColor);
      dataSend.append('numColor', raffle.numColor);
      dataSend.append('pricePerNumber', raffle.pricePerNumber);
      dataSend.append('fontFamily', raffle.fontFamily);
      dataSend.append('drawDate', raffle.drawDate);
      dataSend.append('theme', raffle.theme);

      if (raffle.image) dataSend.append('image', raffle.image);

      const data = await SetRaffle(raffle);

      if (!data.statusCode) {
        dispatch(addToast({ type: "success", message: tr("raffle_saved_successfully", lang) }));
        navigate("/raffles", { replace: true });
      } else {
        dispatch(addToast({ type: "error", message: tr("error_saving_raffle", lang) }));
      }
    } catch (err: any) {
      console.log(`Error al guardar la nueva rifa: `, err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setRaffle({ ...raffle, image: file, });

    const previewURL: string = URL.createObjectURL(file);

    setImagePreview(previewURL);
  };

  const calculateNumDigits = (n: number): number => {
    if (n <= 100) return 2;
    return Math.floor(Math.log10(n - 1)) + 1;
  };

  useEffect(() => {
    if (raffleSelected && raffleSelected.image) {
      const previewURL: string = `${uploadsFolder}/${raffleSelected.image}`;
      setImagePreview(previewURL);
    }
  }, [raffleSelected]);

  return (
    <div className="animate-fade-in" style={{ padding: 28, maxWidth: 960, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
          {tr(raffleSelected && raffleSelected.id ? "edit_raffle" : "create_raffle", lang)}
        </h1>
        <button 
          onClick={() => navigate("/raffles", { replace: true })}
          style={{ 
            background: "none", border: "1px solid var(--border)", borderRadius: 8, 
            padding: "8px 16px", cursor: "pointer", color: "var(--text-muted)", fontSize: 13,
          }}
        >
          ← {tr("cancel", lang)}
        </button>
      </div>

      {/* Step indicator */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
        {steps.map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
            <div 
              style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} 
              onClick={() => i < step && setStep(i)}
            >
              <div style={{
                width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                background: i < step ? "#48BB78" : i === step ? "#1A365D" : "var(--border)",
                color: i <= step ? "#fff" : "var(--text-muted)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, transition: "all 0.2s",
              }}>
                {i < step ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 14, fontWeight: i === step ? 600 : 400, color: i === step ? "var(--text-primary)" : "var(--text-muted)", whiteSpace: "nowrap" }}>
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, background: i < step ? "#48BB78" : "var(--border)", margin: "0 12px", transition: "background 0.3s" }} />
            )}
          </div>
        ))}
      </div>

      {/* Step 0: Data */}
      {step === 0 && (
        <div className="animate-fade-in" style={{ background: "var(--bg-card)", borderRadius: 12, padding: 32, boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <Label>{tr("raffle_name_label", lang)} *</Label>
              <Input value={raffle.name} onChange={(v) => setRaffle({ ...raffle, name: v })} placeholder="Gran Rifa Navideña" />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <Label>{tr("description", lang)}</Label>
              <textarea
                value={raffle.description}
                onChange={(e) => setRaffle({ ...raffle, description: e.target.value })}
                placeholder={lang === "es" ? "Describe los premios y condiciones..." : "Describe prizes and conditions..."}
                rows={3}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 8,
                  border: "2px solid var(--border)", background: "var(--bg)",
                  color: "var(--text-primary)", fontSize: 14, fontFamily: "var(--font-sans)",
                  resize: "vertical", outline: "none", boxSizing: "border-box",
                }}
                onFocus={(e) => e.target.style.borderColor = "#1A365D"}
                onBlur={(e) => e.target.style.borderColor = "var(--border)"}
              />
            </div>
            <div>
              <Label>{tr("draw_date_label", lang)} *</Label>
              <Input type="datetime-local" value={raffle.drawDate?.slice(0, 16)} onChange={(v) => setRaffle({ ...raffle, drawDate: v })} />
            </div>
            <div>
              <Label>{tr("price_per_number", lang)}</Label>
              <Input type="number" value={String(raffle.pricePerNumber ?? 10000)} onChange={(v) => setRaffle({ ...raffle, pricePerNumber: Number(v) })} placeholder="10000" />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <Label>{tr("image", lang)}</Label>
              <input
                id="image"
                type="file"
                accept="image/png, image/jpg"
                onChange={(e) => handleImageChange(e)}
                hidden
              />
              <label htmlFor="image">
                <div style={{
                  border: "2px dashed var(--border)", borderRadius: 10, padding: "5px", textAlign: "center",
                  cursor: "pointer", color: "var(--text-muted)", fontSize: 14,
                  transition: "border-color 0.2s, background 0.2s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#1A365D"; e.currentTarget.style.background = "#EBF4FF"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "transparent"; }}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Voucher"
                      style={{ width: "100%", maxHeight: "160px", objectFit: "cover", borderRadius: 10, }}
                    />
                  ) : (
                    <>
                      <div style={{ fontSize: 36, marginBottom: 8 }}>📸</div>
                      <div>{tr("drag_drop", lang)}</div>
                      <div style={{ fontSize: 12, marginTop: 4, opacity: 0.7 }}>PNG, JPG · máx 5MB</div>
                    </>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Numbers */}
      {step === 1 && (
        <div className="animate-fade-in" style={{ background: "var(--bg-card)", borderRadius: 12, padding: 32, boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
            <div>
              <Label>{tr("total_numbers", lang)}: <strong style={{ color: "#1A365D" }}> {raffle.totalNumbers} </strong></Label>
              <input
                type="range" 
                min={10} 
                max={100000} 
                step={10}
                value={raffle.totalNumbers}
                onChange={(e) => setRaffle({ ...raffle, totalNumbers: Number(e.target.value) })}
                style={{ width: "100%", accentColor: "#1A365D", marginTop: 8 }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                <span>10</span> <span>50</span> <span>100</span> <span>500</span>
                <span>1.000</span> <span>5.000</span> <span>10.000</span> <span>50.000</span>
                <span>100.000</span> <span>500.000</span> <span>1.000.000</span>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                {[10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000].map((n) => (
                  <button key={n} onClick={() => setRaffle({ ...raffle, totalNumbers: n, digits: calculateNumDigits(n) })}
                    style={{
                      padding: "4px 12px", borderRadius: 6, border: "1px solid var(--border)",
                      background: raffle.totalNumbers === n ? "#1A365D" : "var(--bg)",
                      color: raffle.totalNumbers === n ? "#fff" : "var(--text-secondary)",
                      cursor: "pointer", fontSize: 12, fontWeight: 600,
                    }}>
                    {n.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>{tr("digits", lang)}</Label>
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                {[2, 3, 4, 5, 6].map((d) => (
                  <button key={d} onClick={() => setRaffle({ ...raffle, digits: d })}
                    style={{
                      flex: 1, padding: "14px 8px", borderRadius: 8,
                      border: `2px solid ${raffle.digits === d ? "#1A365D" : "var(--border)"}`,
                      background: raffle.digits === d ? "#EBF4FF" : "var(--bg)",
                      cursor: "pointer", textAlign: "center",
                    }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 700, color: "#1A365D" }}>
                      {"0".repeat(d)}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{d} {lang === "es" ? "dígitos" : "digits"}</div>
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 20, padding: 16, background: "var(--bg)", borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>{tr("digits_preview", lang)}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[0, 1, 47, (raffle.totalNumbers) - 1].map((n) => (
                    <span key={n} style={{
                      fontFamily: "var(--font-mono)", fontSize: 20, fontWeight: 700,
                      color: "#1A365D", background: "#C6F6D5", padding: "6px 12px",
                      borderRadius: 6,
                    }}>
                      {String(n).padStart(raffle.digits, "0")}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Design */}
      {step === 2 && (
        <div className="animate-fade-in" style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20 }}>
          {/* Controls */}
          <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, boxShadow: "var(--shadow-sm)", display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <Label>{tr("theme", lang)}</Label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                {THEMES.map((th) => (
                  <button key={th.id} onClick={() => setRaffle({ ...raffle, theme: th.id })}
                    style={{
                      padding: "12px 8px", borderRadius: 8, textAlign: "center",
                      border: `2px solid ${raffle.theme === th.id ? "#1A365D" : "var(--border)"}`,
                      background: raffle.theme === th.id ? "#EBF4FF" : "var(--bg)",
                      cursor: "pointer",
                    }}>
                    <div style={{ fontSize: 24 }}>{th.emoji}</div>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4, fontWeight: 500 }}>{th.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>{tr("font", lang)}</Label>
              <select value={raffle.fontFamily ?? "Inter"} onChange={(e) => setRaffle({ ...raffle, fontFamily: e.target.value })}
                style={{
                  width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)",
                  background: "var(--bg)", color: "var(--text-primary)", fontSize: 14,
                  marginTop: 6, fontFamily: "var(--font-sans)",
                }}>
                {FONTS.map((f) => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
              </select>
            </div>

            <div>
              <Label>{tr("bg_color", lang)}</Label>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                <input type="color" value={raffle.bgColor ?? "#1A365D"} onChange={(e) => setRaffle({ ...raffle, bgColor: e.target.value })}
                  style={{ width: 48, height: 36, borderRadius: 6, border: "none", cursor: "pointer", padding: 2 }} />
                <code style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{raffle.bgColor ?? "#1A365D"}</code>
              </div>
            </div>

            <div>
              <Label>{tr("num_color", lang)}</Label>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                <input type="color" value={raffle.numColor ?? "#FFFFFF"} onChange={(e) => setRaffle({ ...raffle, numColor: e.target.value })}
                  style={{ width: 48, height: 36, borderRadius: 6, border: "none", cursor: "pointer", padding: 2 }} />
                <code style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{raffle.numColor ?? "#FFFFFF"}</code>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, boxShadow: "var(--shadow-sm)" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
              {tr("live_preview", lang)}
            </div>
            <div style={{ borderRadius: 10, overflow: "hidden", boxShadow: "var(--shadow-md)" }}>
              <div style={{ background: raffle.bgColor ?? "#1A365D", padding: "16px 20px" }}>
                <div style={{ color: "#FFFFFF", fontSize: 15, fontWeight: 700, fontFamily: raffle.fontFamily ?? "Inter" }}>
                  {raffle.name || (lang === "es" ? "Nombre de la Rifa" : "Raffle Name")}
                </div>
                <div style={{ color: "#FFFFFF99", fontSize: 12, marginTop: 4 }}>
                  {raffle.totalNumbers ?? 100} {lang === "es" ? "números" : "numbers"} · {raffle.digits ?? 2} {lang === "es" ? "dígitos" : "digits"}
                </div>
              </div>
              <div style={{ background: "var(--bg)", padding: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 5 }}>
                  {previewNums.map((n) => {
                    const statusStyle: any = {
                      available: { bg: "#C6F6D5", color: "#276749" },
                      reserved:  { bg: "#FEFCBF", color: "#975A16" },
                      sold:      { bg: "#FED7D7", color: "#9B2C2C" },
                      winner:    { bg: raffle.bgColor, color: raffle.numColor ?? "#FFFFFF", border: "2px solid #F6AD55" },
                    }[n.status];
                    return (
                      <div key={n.num} style={{
                        borderRadius: 5, padding: "7px 4px", textAlign: "center",
                        background: statusStyle.bg, color: statusStyle.color,
                        fontFamily: raffle.fontFamily ?? "Inter", fontSize: 12, fontWeight: 700,
                        border: "border" in statusStyle ? statusStyle.border : "none",
                      }}>
                        {String(n.num).padStart(raffle.digits, "0")}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
        <button
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
          style={{
            padding: "12px 24px", borderRadius: 8, border: "1px solid var(--border)",
            background: "var(--bg-card)", color: step === 0 ? "var(--text-muted)" : "var(--text-primary)",
            cursor: step === 0 ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 600,
          }}
        >
          ← {tr("prev", lang)}
        </button>
        {step < 2 ? (
          <button
            onClick={() => setStep(step + 1)}
            style={{
              padding: "12px 28px", borderRadius: 8, border: "none",
              background: "#1A365D", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600,
              boxShadow: "0 4px 12px #1A365D40",
            }}
          >
            {tr("next", lang)} →
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={loading}
            style={{
              padding: "12px 28px", borderRadius: 8, border: "none",
              background: loading ? "#A0AEC0" : "#48BB78", color: "#fff",
              cursor: loading ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 700,
              boxShadow: loading ? "none" : "0 4px 12px #48BB7840",
            }}
          >
            {loading ? tr("saving", lang) : "✓ " + tr("save", lang)}
          </button>
        )}
      </div>
    </div>
  );
}

export default RaffleEditor;
