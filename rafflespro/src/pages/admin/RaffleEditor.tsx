import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateEditorDraft, setEditorStep, saveRaffle } from "../../store/slices/raffleSlice";
import { setActiveView, addToast } from "../../store/slices/uiSlice";
import { tr } from "../../i18n/translations";

const THEMES = [
  { id: "default", label: "Clásico", emoji: "🎰" },
  { id: "christmas", label: "Navideña", emoji: "🎄" },
  { id: "sports", label: "Deportiva", emoji: "⚽" },
  { id: "lottery", label: "Lotería", emoji: "🎱" },
];

const FONTS = ["Inter", "Poppins", "Georgia", "JetBrains Mono", "Playfair Display"];

function makeNumbers(total: number) {
  const statuses = ["available", "available", "available", "sold", "reserved"] as const;
  return Array.from({ length: total }, (_, i) => ({
    num: i, status: statuses[i % 5], buyer: undefined, phone: undefined,
  }));
}

export default function RaffleEditor() {
  const dispatch = useAppDispatch();
  const lang = useAppSelector((s) => s.ui.language);
  const step = useAppSelector((s) => s.raffle.editorStep);
  const draft = useAppSelector((s) => s.raffle.editorDraft);
  const [saving, setSaving] = useState(false);

  const steps = [tr("step_data", lang), tr("step_numbers", lang), tr("step_design", lang)];

  function update(partial: Record<string, unknown>) {
    dispatch(updateEditorDraft(partial as Parameters<typeof updateEditorDraft>[0]));
  }

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    const total = draft.totalNumbers ?? 100;
    dispatch(saveRaffle({
      id: draft.id ?? "r" + Date.now(),
      name: draft.name ?? "Nueva Rifa",
      description: draft.description ?? "",
      drawDate: draft.drawDate ?? new Date().toISOString(),
      totalNumbers: total,
      digits: draft.digits ?? 2,
      pricePerNumber: draft.pricePerNumber ?? 10000,
      status: "active",
      theme: (draft.theme as "default") ?? "default",
      fontFamily: draft.fontFamily ?? "Inter",
      bgColor: draft.bgColor ?? "#1A365D",
      numColor: draft.numColor ?? "#FFFFFF",
      numbers: makeNumbers(total),
      createdAt: new Date().toISOString().split("T")[0],
    }));
    dispatch(addToast({ type: "success", message: lang === "es" ? "¡Rifa guardada exitosamente!" : "Raffle saved successfully!" }));
    setSaving(false);
    dispatch(setActiveView("dashboard"));
  }

  const previewNums = Array.from({ length: 12 }, (_, i) => ({
    num: i,
    status: ["available", "sold", "reserved", "available", "sold", "available", "winner", "available", "sold", "reserved", "available", "available"][i] as "available" | "sold" | "reserved" | "winner",
  }));

  return (
    <div className="animate-fade-in" style={{ padding: 28, maxWidth: 960, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
          {tr("create_raffle", lang)}
        </h1>
        <button onClick={() => dispatch(setActiveView("dashboard"))}
          style={{ background: "none", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 16px", cursor: "pointer", color: "var(--text-muted)", fontSize: 13 }}>
          ← {tr("cancel", lang)}
        </button>
      </div>

      {/* Step indicator */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
        {steps.map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => i < step && dispatch(setEditorStep(i))}>
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
              <Input value={draft.name ?? ""} onChange={(v) => update({ name: v })} placeholder="Gran Rifa Navideña 2024" />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <Label>{tr("description", lang)}</Label>
              <textarea
                value={draft.description ?? ""}
                onChange={(e) => update({ description: e.target.value })}
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
              <Input type="datetime-local" value={draft.drawDate?.slice(0, 16) ?? ""} onChange={(v) => update({ drawDate: v })} />
            </div>
            <div>
              <Label>{tr("price_per_number", lang)}</Label>
              <Input type="number" value={String(draft.pricePerNumber ?? 10000)} onChange={(v) => update({ pricePerNumber: Number(v) })} placeholder="10000" />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <Label>{tr("image", lang)}</Label>
              <div style={{
                border: "2px dashed var(--border)", borderRadius: 10, padding: "32px", textAlign: "center",
                cursor: "pointer", color: "var(--text-muted)", fontSize: 14,
                transition: "border-color 0.2s, background 0.2s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#1A365D"; e.currentTarget.style.background = "#EBF4FF"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{ fontSize: 36, marginBottom: 8 }}>📸</div>
                <div>{tr("drag_drop", lang)}</div>
                <div style={{ fontSize: 12, marginTop: 4, opacity: 0.7 }}>PNG, JPG · máx 5MB</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Numbers */}
      {step === 1 && (
        <div className="animate-fade-in" style={{ background: "var(--bg-card)", borderRadius: 12, padding: 32, boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
            <div>
              <Label>{tr("total_numbers", lang)}: <strong style={{ color: "#1A365D" }}>{draft.totalNumbers ?? 100}</strong></Label>
              <input
                type="range" min={10} max={10000} step={10}
                value={draft.totalNumbers ?? 100}
                onChange={(e) => update({ totalNumbers: Number(e.target.value) })}
                style={{ width: "100%", accentColor: "#1A365D", marginTop: 8 }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                <span>10</span><span>100</span><span>1,000</span><span>10,000</span>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                {[50, 100, 500, 1000, 5000].map((n) => (
                  <button key={n} onClick={() => update({ totalNumbers: n })}
                    style={{
                      padding: "4px 12px", borderRadius: 6, border: "1px solid var(--border)",
                      background: draft.totalNumbers === n ? "#1A365D" : "var(--bg)",
                      color: draft.totalNumbers === n ? "#fff" : "var(--text-secondary)",
                      cursor: "pointer", fontSize: 12, fontWeight: 600,
                    }}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>{tr("digits", lang)}</Label>
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                {[2, 3, 4, 5].map((d) => (
                  <button key={d} onClick={() => update({ digits: d })}
                    style={{
                      flex: 1, padding: "14px 8px", borderRadius: 8,
                      border: `2px solid ${draft.digits === d ? "#1A365D" : "var(--border)"}`,
                      background: draft.digits === d ? "#EBF4FF" : "var(--bg)",
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
                  {[0, 1, 47, (draft.totalNumbers ?? 100) - 1].map((n) => (
                    <span key={n} style={{
                      fontFamily: "var(--font-mono)", fontSize: 20, fontWeight: 700,
                      color: "#1A365D", background: "#C6F6D5", padding: "6px 12px",
                      borderRadius: 6,
                    }}>
                      {String(n).padStart(draft.digits ?? 2, "0")}
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
                  <button key={th.id} onClick={() => update({ theme: th.id })}
                    style={{
                      padding: "12px 8px", borderRadius: 8, textAlign: "center",
                      border: `2px solid ${draft.theme === th.id ? "#1A365D" : "var(--border)"}`,
                      background: draft.theme === th.id ? "#EBF4FF" : "var(--bg)",
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
              <select value={draft.fontFamily ?? "Inter"} onChange={(e) => update({ fontFamily: e.target.value })}
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
                <input type="color" value={draft.bgColor ?? "#1A365D"} onChange={(e) => update({ bgColor: e.target.value })}
                  style={{ width: 48, height: 36, borderRadius: 6, border: "none", cursor: "pointer", padding: 2 }} />
                <code style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{draft.bgColor ?? "#1A365D"}</code>
              </div>
            </div>

            <div>
              <Label>{tr("num_color", lang)}</Label>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                <input type="color" value={draft.numColor ?? "#FFFFFF"} onChange={(e) => update({ numColor: e.target.value })}
                  style={{ width: 48, height: 36, borderRadius: 6, border: "none", cursor: "pointer", padding: 2 }} />
                <code style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{draft.numColor ?? "#FFFFFF"}</code>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: 24, boxShadow: "var(--shadow-sm)" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
              {tr("live_preview", lang)}
            </div>
            <div style={{ borderRadius: 10, overflow: "hidden", boxShadow: "var(--shadow-md)" }}>
              <div style={{ background: draft.bgColor ?? "#1A365D", padding: "16px 20px" }}>
                <div style={{ color: "#FFFFFF", fontSize: 15, fontWeight: 700, fontFamily: draft.fontFamily ?? "Inter" }}>
                  {draft.name || (lang === "es" ? "Nombre de la Rifa" : "Raffle Name")}
                </div>
                <div style={{ color: "#FFFFFF99", fontSize: 12, marginTop: 4 }}>
                  {draft.totalNumbers ?? 100} {lang === "es" ? "números" : "numbers"} · {draft.digits ?? 2} {lang === "es" ? "dígitos" : "digits"}
                </div>
              </div>
              <div style={{ background: "var(--bg)", padding: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 5 }}>
                  {previewNums.map((n) => {
                    const statusStyle = {
                      available: { bg: "#C6F6D5", color: "#276749" },
                      reserved:  { bg: "#FEFCBF", color: "#975A16" },
                      sold:      { bg: "#FED7D7", color: "#9B2C2C" },
                      winner:    { bg: draft.bgColor ?? "#1A365D", color: draft.numColor ?? "#FFFFFF", border: "2px solid #F6AD55" },
                    }[n.status];
                    return (
                      <div key={n.num} style={{
                        borderRadius: 5, padding: "7px 4px", textAlign: "center",
                        background: statusStyle.bg, color: statusStyle.color,
                        fontFamily: draft.fontFamily ?? "Inter", fontSize: 12, fontWeight: 700,
                        border: "border" in statusStyle ? statusStyle.border : "none",
                      }}>
                        {String(n.num).padStart(draft.digits ?? 2, "0")}
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
          onClick={() => dispatch(setEditorStep(Math.max(0, step - 1)))}
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
            onClick={() => dispatch(setEditorStep(step + 1))}
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
            disabled={saving}
            style={{
              padding: "12px 28px", borderRadius: 8, border: "none",
              background: saving ? "#A0AEC0" : "#48BB78", color: "#fff",
              cursor: saving ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 700,
              boxShadow: saving ? "none" : "0 4px 12px #48BB7840",
            }}
          >
            {saving ? tr("saving", lang) : "✓ " + tr("save", lang)}
          </button>
        )}
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{children}</label>;
}

function Input({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
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
    />
  );
}
