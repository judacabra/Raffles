import { useEffect, useState } from "react";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { addToast, Language } from "../../store/slices/uiSlice";
import { tr } from "../../i18n/translations";

import { GetCompanies, PutCompany, PutCompanyStatus, SetCompany, DeleteCompany } from "../../api/companiesAPI";
import { CompanyRow } from "@/interfaces/company.interfaces";

const CompaniesPage = () => {
  const dispatch = useAppDispatch();

  const lang: Language = useAppSelector((s: any) => s.ui.language);

  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [editing, setEditing] = useState<CompanyRow | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [companiesFounded, setCompaniesFounded] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const initialCompany: CompanyRow = {
    name: "",
    taxId: "",
    plan: "",
    periodicity: "",
    lastPayment: "",
    expiratedDate: "",
    dateAt: "",
    hourAt: "",
    isActive: true,
  };

  const filtered: CompanyRow[] = companies.length > 0 
    ? companies.filter((c: CompanyRow) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.taxId.toLowerCase().includes(search.toLowerCase())
    ) : [];

  const openEdit = (u: CompanyRow): void => { 
    setEditing({ ...u }); 
    setModalOpen(true); 
  }

  const openNew = (): void => {
    setEditing(initialCompany);
    setModalOpen(true);
  }

  const saveCompany = async (): Promise<void> => {
    if (!editing) return;
    
    try {
      if (editing.id) {
        await PutCompany(editing.id, editing);
      } else {
        await SetCompany(editing);
      }
    } catch (err: any) {
      console.error(`Error al ${(editing.id ? "actualizar" : "guardar")} la empresa: `, err);
    } finally {
      await fetchCompanies();

      dispatch(addToast({ type: "success", message: tr("company_saved", lang) }));

      setModalOpen(false);
    }
  }

  const changeCompanyStatus = async (id: number, status: boolean): Promise<void> => {
    try {
      await PutCompanyStatus(id, status);
    } catch (err: any) {
      console.error(`Error al actualizar el estado de la empresa: `, err);
    } finally {
      await fetchCompanies();

      dispatch(addToast({ type: "success", message: tr("status_updated", lang) }));
    }
  }

  const toggleActive = async (id: number): Promise<void> => {
    const company = companies.find((u: CompanyRow) => u.id === id);
    if (!company) return;

    await changeCompanyStatus(id, !company.isActive);
  }

  const deleteCompany = async (id: number): Promise<void> => {
    try {
      await DeleteCompany(id);
    } catch (err: any) {
      console.error('Error al eliminar la empresa: ', err);
    } finally {
      await fetchCompanies();

      dispatch(addToast({ type: "info", message: tr("company_deleted", lang) }));

      setModalOpen(false);
    }
  }

  const fetchCompanies = async (): Promise<void> => {
    try {
      const data: CompanyRow[] = await GetCompanies();
      setCompanies(data);
    } catch (error) {
      console.error('Error al obtener las empresas: ', error);
    } finally {
      setCompaniesFounded(true);
    }
  }

  const trunkWeb = (w: string): string => {
    let url: string = "";
    if (w.startsWith("www.")) url = w.split('www.')[1];
    return url;
  }

  const openNewTab = (w: string): void => {
    let url: string = "";
    if (!w.startsWith("https://")) url = `https://${w}`;
    window.open(url, "_blank");
  }

  const ExpiratedDateColor = (ed: string): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const exp = new Date(ed);
    exp.setHours(0, 0, 0, 0);

    const diffDays = Math.round(
      (exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays <= 0) return "#EF4444"; // rojo (hoy o vencido)
    if (diffDays <= 5) return "#F97316"; // naranja (1-5 días)
    if (diffDays <= 10) return "#EAB308"; // amarillo (6-10 días)

    return "#22C55E";
  };

  useEffect(() => {
    if (!companiesFounded) fetchCompanies();
  }, [companiesFounded]);

  return (
    <div className="animate-fade-in" style={{ padding: 28, maxWidth: 1100, height: "90vh", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
            {tr("companies_management", lang)}
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "var(--text-muted)" }}>
            {filtered.length} {tr("registered_companys", lang)}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={tr("search", lang)}
            style={{
              padding: "8px 14px", borderRadius: 8, border: "1px solid var(--border)",
              background: "var(--bg-card)", color: "var(--text-primary)", fontSize: 13,
              fontFamily: "var(--font-sans)", width: 220,
            }}
          />
          <button onClick={openNew}
            style={{
              padding: "8px 18px", borderRadius: 8, border: "none",
              background: "#1A365D", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600,
            }}>
            + {tr("add_company", lang)}
          </button>
        </div>
      </div>

      <div style={{ background: "var(--bg-card)", borderRadius: 12, boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "var(--bg)" }}>
              {[tr("name", lang), tr("website", lang), tr("state", lang), ""].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr
                key="empty"
                style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}
              >
                <td colSpan={5} style={{ padding: "14px 16px", textAlign: "center", }}> No hay registros </td>
              </tr>
            ) : (
              filtered.map((u) => {
                return (
                  <tr key={u.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                          background: "linear-gradient(135deg, #1A365D, #F6AD55)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#fff", fontSize: 12, fontWeight: 700,
                        }}>
                          {u.logoURL || u.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{u.name}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td style={{ padding: "14px 16px", color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
                      {u.website ? (
                        <button 
                          style={{ 
                            padding: 10, background: "rgb(162, 222, 245)", borderRadius: 10, cursor: "pointer", 
                            boxShadow: "inset 0 1px 5px rgba(255, 255, 255, 0.8)", 
                          }}
                          onClick={() => openNewTab(u.website!)}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgb(101, 194, 228)", e.currentTarget.style.fontWeight = "bold")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "rgb(162, 222, 245)", e.currentTarget.style.fontWeight = "normal")}
                        > 
                          🌐 {trunkWeb(u.website)}
                        </button>
                      ) : ("-")} 
                    </td>
                    
                    <td style={{ padding: "14px 16px" }}>
                      <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                        <div style={{ position: "relative", width: 40, height: 22 }} onClick={() => toggleActive(u.id!)}>
                          <div style={{
                            width: 40, height: 22, borderRadius: 99,
                            background: u.isActive ? "#48BB78" : "#CBD5E0",
                            transition: "background 0.2s",
                          }} />
                          <div style={{
                            position: "absolute", top: 3, left: u.isActive ? 21 : 3,
                            width: 16, height: 16, borderRadius: "50%", background: "#fff",
                            transition: "left 0.2s", boxShadow: "0 1px 3px #0000002A",
                          }} />
                        </div>
                        <span style={{ fontSize: 12, color: u.isActive ? "#276749" : "var(--text-muted)", fontWeight: 500 }}>
                          {tr(u.isActive ? "active" : "inactive", lang)}
                        </span>
                      </label>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button 
                          onClick={() => openEdit(u)}
                          title={tr("edit", lang)}
                          style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #1A365D", background: "rgb(185, 229, 250)", cursor: "pointer", fontSize: 12, color: "#1A365D", fontWeight: 600, marginRight: 10, }}>
                            {tr("edit", lang)}
                        </button>
                        <button 
                          onClick={() => deleteCompany(u.id!)}
                          title={tr("delete", lang)}
                          style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #d13939", background: "rgb(250, 162, 162)", cursor: "pointer", fontSize: 12, color: "#d13939", fontWeight: 600 }}>
                          {tr("delete", lang)}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && editing && (
        <div style={{
          position: "fixed", inset: 0, background: "#00000060", zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center",
        }} onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className="animate-fade-in" style={{
            background: "var(--bg-card)", borderRadius: 16, padding: "20px 32px", width: "100%", maxWidth: 440,
            boxShadow: "0 25px 60px #00000040",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                {tr(editing.name !== "" ? "edit_company" : "new_company", lang)}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 20 }}>×</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxHeight: "70vh", overflow: "hidden" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, overflowY: "auto", flex: 1, paddingRight: 4 }}>
                {[
                  { lk: "name", v: editing.name, f: "name" as const },
                  { lk: "taxId", v: editing.taxId, f: "taxId" as const },
                  { lk: "email", v: editing.email, f: "email" as const },
                  { lk: "plan", v: editing.plan, f: "plan" as const },
                  { lk: "periodicity", v: editing.periodicity, f: "periodicity" as const },
                  ...(editing.id ? [
                      { lk: "lastPayment", v: editing.lastPayment, f: "lastPayment" as const },
                      { lk: "expiratedDate", v: editing.expiratedDate, f: "expiratedDate" as const },
                    ]
                  : []),
                  { lk: "website", v: editing.website, f: "website" as const },
                ].map(({ lk, v, f }) => (
                  <div key={f}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase" }}>
                      {tr(lk, lang)}
                    </label>
                    <input
                      value={v}
                      onChange={(e) => setEditing({ ...editing, [f]: e.target.value })}
                      style={{ 
                        width: "100%", padding: "10px 14px", borderRadius: 8, 
                        border: f === "expiratedDate" ? `2px solid ${ExpiratedDateColor(editing.expiratedDate)}` : "2px solid var(--border)", 
                        background: "var(--bg)", color: f === "expiratedDate" ? ExpiratedDateColor(editing.expiratedDate) : "var(--text-primary)", 
                        fontSize: 14, outline: "none", boxSizing: "border-box" 
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#1A365D"}
                      onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={saveCompany}
                style={{ padding: "12px", borderRadius: 8, border: "none", background: "#1A365D", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 15, flexShrink: 0 }}
              >
                {tr("save_changes", lang)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompaniesPage;