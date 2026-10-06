import { useEffect, useState } from "react";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { addToast, Language } from "../../store/slices/uiSlice";
import { tr } from "../../i18n/translations";

import { GetCompanies, PutCompany, PutCompanyStatus, SetCompany, DeleteCompany } from "../../api/companiesAPI";
import { GetCompanyPayments, SetCompanyPayment } from "../../api/companyPaymentsAPI";

import { CompanyRow } from "@/interfaces/company.interfaces";

import { appConfig } from "../../config";

import { truncarText } from "../../utils/format-words";

const CompaniesPage = () => {
  const dispatch = useAppDispatch();

  const lang: Language = useAppSelector((s: any) => s.ui.language);
  const company: any = useAppSelector((s) => s.auth.activeCompany);

  const { uploadsFolder, } = appConfig;

  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [editing, setEditing] = useState<CompanyRow | null>(null);
  const [payment, setPayment] = useState<any>({ companyId: company.id, total: 200000, available: false });
  
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalPaymentsOpen, setModalPaymentslOpen] = useState<boolean>(false);
  const [modalVoucherOpen, setModalVoucherlOpen] = useState<boolean>(false);
  
  const [companiesFounded, setCompaniesFounded] = useState<boolean>(false);
  const [companyPaymentsFounded, setCompanyPaymentsFounded] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const [selected, setSelected] = useState<"history_payments" | "new_payment">("history_payments");

  const [historyPage, setHistoryPage] = useState<number>(1);

  const [payments, setPayments] = useState<any[]>([]);

  const [voucherPreview, setVoucherPreview] = useState<string | null>(null);

  const [minNumVisible, setMinNumVisible] = useState<number>(1);
  const [maxNumVisible, setMaxNumVisible] = useState<number>(2);

  const [maxPerPage, setMaxPerPage] = useState<number>(5);

  const totalPages: number = payments ? Math.ceil(payments.length / maxPerPage) : 0;

  const visiblePayments: number[] = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).slice(minNumVisible - 1, maxNumVisible);
  
  const start: number = (historyPage - 1) * maxPerPage;
  const end: number = start + maxPerPage;

  const filteredPayments = payments ? payments.slice(start, end) : [];

  const initialCompany: CompanyRow = {
    name: "",
    taxId: "",
    plan: "",
    periodicity: "",
    lastPayment: "",
    expiratedDate: "",
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
  };

  const openNew = (): void => {
    setEditing(initialCompany);
    setModalOpen(true);
  };

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
  };

  const changeCompanyStatus = async (id: number, status: boolean): Promise<void> => {
    try {
      await PutCompanyStatus(id, status);
    } catch (err: any) {
      console.error(`Error al actualizar el estado de la empresa: `, err);
    } finally {
      await fetchCompanies();

      dispatch(addToast({ type: "success", message: tr("status_updated", lang) }));
    }
  };

  const toggleActive = async (id: number): Promise<void> => {
    const company = companies.find((u: CompanyRow) => u.id === id);
    if (!company) return;

    await changeCompanyStatus(id, !company.isActive);
  };

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
  };

  const fetchCompanies = async (): Promise<void> => {
    try {
      const data: CompanyRow[] = await GetCompanies();
      setCompanies(data);
    } catch (err: any) {
      console.error('Error al obtener las empresas: ', err);
    } finally {
      setCompaniesFounded(true);
    }
  };

  const trunkWeb = (w: string): string => {
    let url: string = w;
    if (w.startsWith("www.")) url = w.split('www.')[1];
    return url;
  };

  const openNewTab = (w: string): void => {
    let url: string = w;
    if (!w.startsWith("https://") && !w.startsWith("http://")) url = `https://${w}`;
    window.open(url, "_blank");
  };

  const expiratedDateColor = (ed: string): string => {
    const diffDays: number = expiratedDateValidated(ed);

    if (diffDays <= 0) return "#EF4444";
    if (diffDays <= 5) return "#F97316";
    if (diffDays <= 10) return "#EAB308";

    return "#22C55E";
  };

  const expiratedDateValidated = (ed: string): number => {
    const today: Date = new Date();
    today.setHours(0, 0, 0, 0);

    const exp: Date = new Date(ed);
    exp.setHours(0, 0, 0, 0);

    const diffDays: number = Math.round(
      (exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    return diffDays;
  };

  const handlePagination = (page: number, action?: "first" | "last" | "prevDots" | "nextDots"): void => {
    if (action === "first") {
      setMinNumVisible(1);
      setMaxNumVisible(Math.min(2, totalPages));
      setHistoryPage(1);
      return;
    }

    if (action === "last") {
      const newMax: number = totalPages;
      const newMin: number = Math.max(1, newMax - 1);

      setMinNumVisible(newMin);
      setMaxNumVisible(newMax);
      setHistoryPage(totalPages);
      return;
    }

    if (action === "prevDots") {
      const newMin: number = Math.max(1, minNumVisible - 1);
      const newMax: number = Math.min(totalPages, newMin + 1);

      setMinNumVisible(newMin);
      setMaxNumVisible(newMax);
      setHistoryPage(historyPage - 1);
      return;
    }

    if (action === "nextDots") {
      const newMax: number = Math.min(totalPages, maxNumVisible + 1);
      const newMin: number = Math.max(1, newMax - 1);

      setMinNumVisible(newMin);
      setMaxNumVisible(newMax);
      setHistoryPage(historyPage + 1);
      return;
    }

    if (page < 1 || page > totalPages) return;

    setHistoryPage(page);
  };

  const handleVoucherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setPayment({ ...payment, voucher: file, });

    const previewURL: string = URL.createObjectURL(file);

    setVoucherPreview(previewURL);
  };

  const handlePaymentSubmit = async (): Promise<void> => {
    if (!payment.paymentMethod || !payment.total) return;
    
    const dataSend = new FormData();

    dataSend.append('companyId', payment.companyId);
    dataSend.append('paymentMethodId', `${payment.paymentMethod}`);
    dataSend.append('total', `${payment.total}`);

    if (payment.voucher) dataSend.append('image', payment.voucher);

    try {
      await SetCompanyPayment(payment.companyId, dataSend);      
    } catch (err: any) {
      console.error(`Error al guardar el pago de la empresa #${1}:`, err);
    } finally {
      await fetchCompanyPayments(payment.companyId);

      setPayment({ total: 200000, });
      setSelected("history_payments");
      setVoucherPreview(null);
    }
  }; 

  const fetchCompanyPayments = async (idC: number): Promise<void> => {
    try {
      const data: any[] = await GetCompanyPayments(idC);
      setPayments(data);
    } catch (err: any) {
      console.error(`Error al obtener los pagos de la empresa #${idC}: `, err);
    } finally {
      setCompanyPaymentsFounded(true);
    }
  };

  const handleModalVoucher = (url: string): void => {
    setVoucherPreview(url);
    setModalVoucherlOpen(true)
  };

  const handlePaymentEdit = (dt: string): void => {
    if (expiratedDateValidated(dt) <= 5) {
      payment.available = true;
    }
    setModalPaymentslOpen(true);
  };

  useEffect(() => {
    if (!companiesFounded) fetchCompanies();
  }, [companiesFounded]);

  useEffect(() => {
    if (!companyPaymentsFounded) fetchCompanyPayments(1);
  }, [companyPaymentsFounded]);

  useEffect(() => {
    return () => {
      if (voucherPreview) {
        URL.revokeObjectURL(voucherPreview);
      }
    };
  }, [voucherPreview]);

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
                <th 
                  key={h} 
                  style={{ 
                    padding: "12px 16px", textAlign: "left", fontSize: 11, 
                    fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", 
                    textTransform: "uppercase", 
                  }}
                >
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
                          overflow: "hidden", textTransform: "uppercase",
                        }}>
                          {u.logoURL ? (
                            <img src={uploadsFolder + "/" + u.logoURL} alt="logo company" />
                          ) : (
                            u.logoURL || u.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
                          )}
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
                            padding: 10, background: "rgb(162, 222, 245)", borderRadius: 10, 
                            cursor: "pointer", color: "#6e6e6e", 
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
                    <td style={{ padding: "14px 16px", width: "25%" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button 
                          onClick={() => openEdit(u)}
                          title={tr("edit", lang)}
                          style={{ 
                            padding: "5px 12px", borderRadius: 6, border: "1px solid #1A365D", 
                            background: "rgb(185, 229, 250)", cursor: "pointer", fontSize: 12, 
                            color: "#1A365D", fontWeight: 600, marginRight: 10, 
                          }}
                        >
                          {tr("edit", lang)}
                        </button>
                        <button 
                          onClick={() => handlePaymentEdit(u.expiratedDate)}
                          title={tr("payments", lang)}
                          style={{ 
                            padding: "5px 10px", borderRadius: 6, border: "1px solid #08422f", 
                            background: "#7dddbd", cursor: "pointer", fontSize: 12, 
                            color: "#08422f", fontWeight: 600, marginRight: 10,
                          }}
                        >
                          {tr("payments", lang)}
                        </button>
                        <button 
                          onClick={() => deleteCompany(u.id!)}
                          title={tr("delete", lang)}
                          style={{ 
                            padding: "5px 10px", borderRadius: 6, border: "1px solid #d13939", 
                            background: "rgb(250, 162, 162)", cursor: "pointer", fontSize: 12, 
                            color: "#d13939", fontWeight: 600,
                          }}
                        >
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

      {/* Principal Modal */}
      {(modalOpen && editing) && (
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
                {tr(editing.id ? "edit_company" : "new_company", lang)}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 20 }}>×</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxHeight: "70vh", overflow: "hidden" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, overflowY: "auto", flex: 1, paddingRight: 4 }}>
                {[
                  { lk: "name", v: editing.name, f: "name" as const },
                  { lk: "taxId", v: editing.taxId, f: "taxId" as const },
                  { lk: "email", v: editing.email, f: "email" as const },
                  { lk: "plan", v: editing.plan ?? "-", f: "plan" as const },
                  { lk: "periodicity", v: editing.periodicity ?? "-", f: "periodicity" as const },
                  ...(editing.id ? [
                      { lk: "lastPayment", v: editing.lastPayment ?? "-", f: "lastPayment" as const },
                      { lk: "expiratedDate", v: editing.expiratedDate ?? "-", f: "expiratedDate" as const },
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
                        border: (f === "expiratedDate" && editing.expiratedDate) ? `2px solid ${expiratedDateColor(editing.expiratedDate)}` : "2px solid var(--border)", 
                        background: "var(--bg)", color: (f === "expiratedDate" && editing.expiratedDate) ? expiratedDateColor(editing.expiratedDate) : "var(--text-primary)", 
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
                style={{ 
                  padding: "12px", borderRadius: 8, border: "none", 
                  background: "#1A365D", color: "#fff", fontWeight: 700, 
                  cursor: "pointer", fontSize: 15, flexShrink: 0,
                }}
              >
                {tr("save_changes", lang)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {(modalPaymentsOpen && payment) &&  (
        <div style={{
          position: "fixed", inset: 0, background: "#00000060", zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center", 
        }} onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className="animate-fade-in" style={{
            background: "var(--bg-card)", borderRadius: 16, padding: "20px 32px", width: "100%", maxWidth: 800,
            boxShadow: "0 25px 60px #00000040",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <h3 
                style={{ 
                  margin: 0, fontSize: 18, fontWeight: 700, color: "var(--text-primary)", 
                  fontFamily: "var(--font-display)", marginBottom: 10, 
                }}
              >
                {tr("payments", lang)}
              </h3>
              <button 
                onClick={() => setModalPaymentslOpen(false)} 
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 20 }}
              >×</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxHeight: "70vh", overflow: "hidden" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, overflowY: "auto", flex: 1, paddingRight: 4 }}>
                <div style={{ height: "52vh", }}>
                  <div id="tabs" style={{ display: "flex", }}>
                    {["history_payments", "new_payment"].map((p: any, index: number) => (
                      <div 
                        key={p}
                        style={{
                          height: 40, padding: 3, borderWidth: "1px", borderStyle: "solid",
                          borderColor: p === selected ? "rgba(135, 195, 223, 0.1)" : "#d2d2d2",
                          borderRadius: index === 0 ? "10px 0 0 0" : index === 1 ? "0 10px 0 0" : "",
                          width: "100%", boxSizing: "border-box",
                          boxShadow: p === selected ? "inset 0 1px 8px rgba(135, 195, 223, 0.8)" : "",
                          background: p === selected ? "rgb(185, 229, 250)" : "#ececec",
                          borderBottomWidth: 0, borderLeftWidth: index === 1 ? 1 : 0,
                          display: "flex", borderRightWidth: index === 0 ? 0 : 1,
                          color: p === selected ? "#1A365D" : "#575656",
                          justifyContent: "center", alignItems: "center", cursor: "pointer",
                        }}
                        onClick={() => setSelected(p)}
                      > 
                        {tr(p, lang)} 
                      </div>
                    ))}
                  </div>
                  <div id="content" style={{ border: "1px solid #d4d2d2", height: "45vh", borderRadius: "0 0 10px 10px", }}>
                    {selected == "history_payments" ? (
                      <>
                        <div style={{ height: "80%", }}>
                          <table>
                            <thead>
                              <tr>
                                {[{ lk: "ID", w: "10", }, { lk: "date", w: "20" }, 
                                  { lk: "payment_method", w: "25" }, { lk: "voucher", w: "15" }, 
                                  { lk: "total", w: "30" },
                                ].map((th: any) =>(
                                  <th 
                                    key={th.lk}
                                    style={{ 
                                      padding: "12px 16px", textAlign: "center", fontSize: 11, 
                                      fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", 
                                      textTransform: "uppercase", paddingBottom: 15, width: `${th.w}%`, 
                                    }}
                                  > 
                                    { tr(th.lk, lang) }  
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {filteredPayments && filteredPayments.length === 0 ? (
                                <tr 
                                  key="payments-empty"
                                  style={{ 
                                    borderTop: "1px solid #e7e4e4", borderBottom: "1px solid #e7e4e4",
                                    paddingTop: 3, paddingBottom: 3,
                                  }}
                                >
                                  <td style={{ textAlign: "center", padding:  4, width: "10%", fontSize: 13, }} colSpan={5}>  No hay registros </td>
                                </tr>
                              ) : (
                                filteredPayments.map((row: any, i: number) => (
                                  <tr 
                                    key={row.id}
                                    style={{ 
                                      borderTop: "1px solid #e7e4e4", borderBottom: "1px solid #e7e4e4",
                                      paddingTop: 3, paddingBottom: 3,
                                    }}
                                  >
                                    <td style={{ textAlign: "center", padding:  4, width: "10%", fontSize: 13, }}> {row.id} </td>
                                    <td style={{ textAlign: "center", padding:  4, width: "20%", fontSize: 13, }}> {row.dateAt} </td>
                                    <td style={{ textAlign: "center", padding:  4, width: "30%", fontSize: 13, }}> {truncarText(row.paymentMethodId == 1 ? "Efectivo" : "Efectivo", 15, true)} </td>
                                    <td style={{ textAlign: "center", padding:  4, width: "15%", fontSize: 13, }}> 
                                      <img 
                                        src={`${uploadsFolder}/${row.voucherURL}`} 
                                        alt={truncarText(tr("photo_voucher", lang), 10, true)} 
                                        onClick={() => handleModalVoucher(`${uploadsFolder}/${row.voucherURL}`)} 
                                        style={{ margin: "auto", border: "0.5px solid #c2c2c2", width: 30, height: 30, borderRadius: "50%", cursor: "pointer", }}
                                      /> 
                                    </td>
                                    <td style={{ textAlign: "center", padding:  4, width: "25%", fontSize: 13, }}> $ {Number(row.total).toLocaleString()} </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                        <div 
                          id="paginator" 
                          style={{ 
                            display: "flex", "justifyContent": "space-between", alignItems: "center", 
                            padding: 15, height: "20%", borderRadius: "0 0 10px 10px", 
                          }}
                        >
                          <div id="paginator-pages" style={{ display: "flex", gap: 10, }}>
                            <div 
                              style={{ 
                                display: "flex", justifyContent: "center", alignItems: "center", 
                                border: "0.5px solid #c2c2c2", width: 30, height: 30, paddingBottom: 0.5, 
                                borderRadius: "50%", cursor: historyPage == 1 ? "not-allowed" : "pointer",
                              }}
                              onMouseEnter={(e) => {
                                if (historyPage !== 1) e.currentTarget.style.background = "var(--bg)";
                              }}
                              onMouseLeave={(e) => {
                                if (historyPage !== 1) e.currentTarget.style.background = "transparent";
                              }}
                              onClick={() => {
                                if (historyPage !== 1) handlePagination(1, "first");
                              }}
                              title={tr("go_to_start", lang)}
                            > 
                              <small> « </small>
                            </div>
                            {minNumVisible > 1 && (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  border: "0.5px solid #c2c2c2",
                                  width: 30,
                                  height: 30,
                                  paddingBottom: 0.5,
                                  borderRadius: "50%",
                                  cursor: "pointer",
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.background = "var(--bg)")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.background = "transparent")
                                }
                                onClick={() =>
                                  handlePagination(historyPage - 1, "prevDots")
                                }
                              >
                                <small>{'<'}</small>
                              </div>
                            )}
                            {visiblePayments.map((p) => (
                              <div
                                key={p}
                                style={{
                                  display: "flex", justifyContent: "center", alignItems: "center",
                                  border: "0.5px solid #c2c2c2", width: 30, height: 30,
                                  borderRadius: "50%", cursor: "pointer",
                                  boxShadow: historyPage === p ? "inset 0 1px 20px rgba(135, 195, 223, 0.8)" : "",
                                  background: historyPage === p ? "rgb(185, 229, 250)" : "#fff",
                                }}
                                onClick={() => handlePagination(p)}
                                onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg)"}
                                onMouseLeave={(e) => e.currentTarget.style.background = historyPage === p ? "rgb(185, 229, 250)" : "transparent"}
                              >
                                <small>{p}</small>
                              </div>
                            ))}
                            {(maxNumVisible < totalPages) && (
                              <div
                                style={{
                                  display: "flex", justifyContent: "center", alignItems: "center",
                                  border: "0.5px solid #c2c2c2", width: 30, height: 30, paddingBottom: 0.5,
                                  borderRadius: "50%", cursor: "pointer",
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg)"}
                                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                onClick={() => handlePagination(historyPage + 1, "nextDots")}
                              >
                                <small>{'>'}</small>
                              </div>
                            )}
                            <div 
                              style={{ 
                                display: "flex", justifyContent: "center", alignItems: "center", 
                                paddingBottom: 0.5, border: "0.5px solid #c2c2c2", width: 30, height: 30, 
                                borderRadius: "50%", cursor: (historyPage == totalPages) ? "not-allowed" : "pointer", 
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg)")}
                              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                              onClick={() => {
                                if (historyPage !== totalPages) {
                                  handlePagination(totalPages, "last");
                                }
                              }}
                              title={tr("go_to_end", lang)}
                            > 
                              <small> » </small>
                            </div>
                          </div>
                          <small> {tr("page", lang)} {historyPage} {tr("of", lang)} {totalPages === 0 ? 1 : totalPages} </small> 
                        </div>
                      </>
                    ) : (
                      !payment.available ? (
                        <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", }}>
                          <div style={{ width: "35%", display: "flex", justifyContent: "end", alignItems: "center", marginRight: 10, }}>
                            <img src="./images/check.png" alt="image_check" style={{ width: "20%", }} />
                          </div>
                          <h3 style={{ width: "65%", float: "right", }}> {tr("payments_ok", lang)} </h3>
                        </div>
                      ) : (
                        <div>
                          <div style={{ display: "flex", gap: 16, overflowY: "auto", flex: 1, padding: "10px 20px" }}>
                            {[
                              { lk: "payment_method", v: payment.paymentMethod, type: "select", f: "paymentMethod" as const },
                              { lk: "total", v: payment.total, type: "text", f: "total" as const },
                            ].map(({ lk, type, v, f }) => (
                              <div key={f} style={{ width: "100%", }}>
                                <label 
                                  style={{ 
                                    display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", 
                                    marginBottom: 6, textTransform: "uppercase",
                                  }}
                                >
                                  {tr(lk, lang)}
                                </label>
                                {type == "select" ? (
                                  <select
                                    defaultValue=""
                                    value={v}
                                    onChange={(e) => setPayment({ ...payment, [f]: e.target.value })}
                                    style={{
                                      width: "100%", padding: "10px 14px", borderRadius: 8, borderWidth: "2px",
                                      borderStyle: "solid", borderColor: "var(--border)", background: "var(--bg)", 
                                      color: "var(--text-primary)", fontSize: 14, outline: "none", boxSizing: "border-box",
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = "#1A365D"}
                                    onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                                  >
                                    <option value=""> -- {tr("select_payment_method", lang)} -- </option>
                                    <option value="1"> 💸 {tr("cash", lang)} </option>
                                    <option value="2"> 🧾 {tr("transfer", lang)} </option>
                                    <option value="3"> 💳 {tr("debit_card", lang)} </option>
                                    <option value="4"> 💳 {tr("credit_card", lang)} </option>
                                  </select>
                                ) : (
                                  <input
                                    value={`$ ${Number(v).toLocaleString()}`}
                                    onChange={(e) => {
                                      if (lk !== "total") setPayment({ ...payment, [f]: e.target.value})
                                    }}
                                    style={{ 
                                      width: "100%", padding: "10px 14px", borderRadius: 8, 
                                      border: "2px solid var(--border)", 
                                      background: "var(--bg)", color: "var(--text-primary)", 
                                      fontSize: 14, outline: "none", boxSizing: "border-box" 
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = "#1A365D"}
                                    onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                                    readOnly={lk === "total"}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                          <div
                            style={{
                              height: "100%", overflowY: "auto", overflowX: "hidden", padding: "0 20px",
                              boxSizing: "border-box",
                            }}
                          >
                            <label
                              style={{
                                display: "block", fontSize: 12, color: "var(--text-muted)",
                                fontWeight: 600, marginBottom: 6, textTransform: "uppercase",
                              }}
                            >
                              {tr("voucher", lang)}
                            </label>
                            <input
                              id="voucher"
                              type="file"
                              accept="image/*,.pdf"
                              onChange={handleVoucherChange}
                              hidden
                            />
                            <label htmlFor="voucher">
                              <div style={{
                                border: "2px dashed var(--border)", borderRadius: 10, padding: "5px", textAlign: "center",
                                cursor: "pointer", color: "var(--text-muted)", fontSize: 14, marginBottom: 1,
                                transition: "border-color 0.2s, background 0.2s",
                              }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#1A365D"; e.currentTarget.style.background = "#EBF4FF"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "transparent"; }}
                              >
                                {voucherPreview ? (
                                  payment.voucher?.type === "application/pdf" ? (
                                    <iframe
                                      src={voucherPreview}
                                      title="Voucher PDF"
                                      style={{ width: "100%", height: "100%", border: "none", }}
                                    />
                                  ) : (
                                     <div style={{ position: "relative", }}>
                                      <img
                                        src={voucherPreview}
                                        alt="Voucher"
                                        style={{ width: "100%", maxHeight: "120px", objectFit: "cover", borderRadius: 10, }}
                                      />
                                      <div 
                                        style={{ 
                                          borderRadius: "50%", padding: "1% 1% 1.25%", color: "#b61e1e", position: "absolute",
                                          border: "0.5px solid #b61e1e", width: 30, height: 30, background: "#fff",
                                          display: "flex", justifyContent: "center", alignItems: "center", top: 5, right: 5,
                                          cursor: "pointer",
                                        }}
                                        title={tr("remove_image", lang)}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setVoucherPreview(null);
                                        }}
                                      > x </div>
                                    </div>
                                  )
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
                          <div style={{ width: "100%", marginTop: 12, display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <button
                              style={{
                                borderRadius: 10, fontSize: 13, 
                                border: `0.5px solid ${(!payment.paymentMethod || !payment.total) ? "#505050": "#08422f"}`, 
                                color: (!payment.paymentMethod || !payment.total) ? "#505050" : "#08422f",
                                cursor: (!payment.paymentMethod || !payment.total) ? "default" : "pointer",
                                background: (!payment.paymentMethod || !payment.total) ? "#c2c2c2" : "#7dddbd",
                                padding: "5px 15px", 
                              }}
                              disabled={!payment.paymentMethod || !payment.total}
                              onClick={handlePaymentSubmit}
                            >
                              {tr("save_payment", lang)}
                            </button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Voucher Modal */}
      {(modalVoucherOpen && voucherPreview) &&  (
        <div style={{
          position: "fixed", inset: 0, background: "#00000060", zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center", 
        }} onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className="animate-fade-in" style={{
            background: "var(--bg-card)", borderRadius: 16, padding: "20px 32px", 
            boxShadow: "0 25px 60px #00000040",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <h3 
                style={{ 
                  margin: 0, fontSize: 18, fontWeight: 700, color: "var(--text-primary)", 
                  fontFamily: "var(--font-display)", marginBottom: 10, 
                }}
              >
                {tr("voucher", lang)}
              </h3>
              <button 
                onClick={() => { setModalVoucherlOpen(false); setVoucherPreview(null) }} 
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 20 }}
              >×</button>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
              <img
                src={voucherPreview}
                alt="Voucher"
                style={{ width: "50%", height: "100%", objectFit: "cover", borderRadius: 5, }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompaniesPage;