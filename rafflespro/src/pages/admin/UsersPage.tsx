import { useEffect, useState } from "react";

import { useAppSelector, } from "../../store/hooks";
import { Language } from "../../store/slices/uiSlice";
import { tr } from "../../i18n/translations";

import { UserRow } from "@/interfaces/user.interfaces";

import { GetUsers, PutUser, PutUserStatus, SetUser, DeleteUser } from "../../api/usersAPI";
import { appConfig } from "../../config";
import { useAlert } from "../../utils/useAlert";
import { SweetAlertOptions } from "sweetalert2";
import { Company, User } from "../../store/slices/authSlice";

const UsersPage = () => {
  const lang: Language = useAppSelector((s: any) => s.ui.language);
  const company: Company | null = useAppSelector((s: any) => s.auth.activeCompany);
  const user: User | null = useAppSelector((s: any) => s.auth.user);
  
  const { uploadsFolder, } = appConfig;
  const { sAlert, sInput, sConfirm } = useAlert();

  const roleColors: Record<string, { bg: string; color: string }> = {
    superadmin:  { bg: "#ffebeb", color: "#b02f2b", },
    admin:  { bg: "#EBF4FF", color: "#2B6CB0", },
    seller: { bg: "#F0FFF4", color: "#276749", },
    viewer: { bg: "#FFFFF0", color: "#7B6B00", },
  };

  const initialUser: any = {
    username: "", 
    email: "", 
    companyId: company && company.id, 
    role: "seller", 
    isActive: true,
  };

  const [users, setUsers] = useState<UserRow[]>([]);
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [usersFounded, setUsersFounded] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const ROLES: any[] = [
    { id: 2, name: "admin", }, 
    { id: 3, name: "seller", }, 
    { id: 4, name: "viewer", },
  ];

  const filtered: UserRow[] = users.length > 0 
    ? users.filter((u: UserRow) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    ) : [];

  const openEdit = (u: UserRow): void => { 
    setEditing({ ...u }); 
    setModalOpen(true); 
  }

  const openNew = (): void => {
    setEditing(initialUser);
    setModalOpen(true);
  }

  const saveUser = async (): Promise<void> => {
    if (!editing) return;
    
    const { role, ...rest }: any = editing;

    const dataSend: any = {
      ...rest,
      roleId: ROLES.find((r: any) => r.name === role)!.id,
    };

    try {
      let data: any = {};

      if (dataSend.id) {
        data = await PutUser(30, dataSend);
      } else {
        data = await SetUser(dataSend);
      }
      
      const msg: string = !data.statusCode 
        ? dataSend.id !== undefined 
          ? tr("user_updated_successfully", lang) 
          : tr("user_saved_successfully", lang) 
        : dataSend.id !== undefined 
          ? tr("failed_to_save_user", lang) 
          : tr("failed_to_update_user", lang);

      const sProps: SweetAlertOptions = {
        title: !data.statusCode ? tr("success", lang) : tr("failure", lang),
        html: msg,
        icon: !data.statusCode ? 'success' : 'error',
        showConfirmButton: false,
      }; 

      sAlert(sProps);
    } catch (err: any) {
      console.error(`${tr(editing.id ? "failed_to_update_user" : "failed_to_save_user", lang)}: `, err);
    } finally {
      if (company) await fetchUsers(company.id);
      setModalOpen(false);
    }
  };

  const changeUserStatus = async (id: number, status: boolean): Promise<void> => {
    try {
      const data = await PutUserStatus(id, status);

      const sProps: SweetAlertOptions = {
        title: !data.statusCode ? tr("success", lang) : tr("failure", lang),
        html: !data.statusCode ? tr("status_updated_successfully", lang) : tr("failed_to_update_status", lang),
        icon: !data.statusCode ? 'success' : 'error',
        showConfirmButton: false,
      };

      sAlert(sProps);
    } catch (err: any) {
      console.error(`${tr("failed_to_update_user", lang)}: `, err);
    } finally {
      if (company) await fetchUsers(company.id);
    }
  };

  const toggleActive = async (id: number): Promise<void> => {
    const user = users.find((u: UserRow) => u.id === id);
    if (!user) return;

    await changeUserStatus(id, !user.isActive);
  };

  const handleDeleteUser = (id: number): void => {
    const sProps: SweetAlertOptions = {
      html: tr("are_you_sure_you_want_to_delete_x", lang, { x: "this_user" }),
      icon: 'question',
      confirmButtonText: tr("yes_delete", lang),
    };

    sConfirm(sProps, () => deleteUserMotive(id));
  };

  const deleteUserMotive = (id: number): void => {
    const sProps: SweetAlertOptions = {
      title: tr("motive", lang),
      html: tr("you_are_about_to_delete_user_x_please_provide_a_motive", lang, { id: id }),
      confirmButtonText: tr("delete", lang),
    }

    const motiveLabel: string = tr("the_motive_is_required", lang);

    sInput(sProps, motiveLabel, () => tryDeleteUser(id));
  };

  const tryDeleteUser = async (id: number,): Promise<void> => {
    try {
      const response = await DeleteUser(id);

      const sProps: SweetAlertOptions = {
        title: !response.statusCode ? tr("success", lang) : tr("failure", lang),
        html: !response.statusCode ? tr("user_deleted_successfully", lang) : tr("failed_user_deleted", lang),
        icon: !response.statusCode ? 'success' : 'error',
        showConfirmButton: false,
      };

      sAlert(sProps);
    } catch(err: any) {
      console.error(`${tr("failed_to_delete_user", lang)}: `, err);
    } finally {
      if (company) await fetchUsers(company.id);
    }
  };

  const fetchUsers = async (idC: number): Promise<void> => {
    try {
      const data: UserRow[] = await GetUsers(idC);
      setUsers(data);
    } catch (err: any) {
      console.error(`${tr("failed_to_get_users", lang)}: `, err);
    } finally {
      setUsersFounded(true);
    }
  };

  useEffect(() => {
    if (!usersFounded && company) fetchUsers(company.id);
  }, [usersFounded, company]);

  return (
    <div className="animate-fade-in" style={{ padding: 28, maxWidth: 1100, height: "90vh", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
            {tr("user_management", lang)}
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "var(--text-muted)" }}>
            {filtered.length} {tr("registered_users", lang)}
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
            + {tr("add_user", lang)}
          </button>
        </div>
      </div>

      <div style={{ background: "var(--bg-card)", borderRadius: 12, boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "var(--bg)" }}>
              {[tr("name", lang), tr("email", lang), tr("role", lang), tr("state", lang), ""].map((h) => (
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
                <td colSpan={5} style={{ padding: "14px 16px", textAlign: "center", }}>No hay registros</td>
              </tr>
            ) : (
              filtered.map((u: UserRow) => {
                const rc = roleColors[u.role];
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
                          {u.imageURL && u.imageURL.startsWith("uploads/") ? (
                            <img 
                              src={uploadsFolder + "/" + u.imageURL} 
                              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", }} 
                            />
                          ) : (
                            u.username.split(" ").map((w) => w[0]).join("").slice(0, 2)
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{u.username}</div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{u.company}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: 12 }}>{u.email}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: rc.bg, color: rc.color, border: `solid .5px ${rc.color}` }}>
                        {tr(u.role, lang)}
                      </span>
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
                      {(user && user.id !== u.id) && (
                        <div style={{ display: "flex", gap: 6 }}>
                          <button 
                            onClick={() => openEdit(u)}
                            title={tr("edit", lang)}
                            style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #1A365D", background: "rgb(185, 229, 250)", cursor: "pointer", fontSize: 12, color: "#1A365D", fontWeight: 600, marginRight: 10, }}>
                              {tr("edit", lang)}
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(u.id!)}
                            title={tr("delete", lang)}
                            style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #d13939", background: "rgb(250, 162, 162)", cursor: "pointer", fontSize: 12, color: "#d13939", fontWeight: 600 }}>
                            {tr("delete", lang)}
                          </button>
                        </div>
                      )}
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
            background: "var(--bg-card)", borderRadius: 16, padding: 32, width: "100%", maxWidth: 440,
            boxShadow: "0 25px 60px #00000040",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                {tr(editing.username !== "" ? "edit" : "new", lang)} {tr("user", lang)}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 20 }}>×</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { lk: "username", v: editing.username, f: "username" as const },
                { lk: "email", v: editing.email, f: "email" as const },
              ].map(({ lk, v, f }) => (
                <div key={f}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase" }}>{tr(lk, lang)}</label>
                  <input value={v} onChange={(e) => setEditing({ ...editing, [f]: e.target.value })}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "2px solid var(--border)", background: "var(--bg)", color: "var(--text-primary)", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                    onFocus={(e) => e.target.style.borderColor = "#1A365D"}
                    onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                  />
                </div>
              ))}

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase" }}>{tr("role", lang)}</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {ROLES.map((r: any) => {
                    const rc = roleColors[r.name];
                    return (
                      <button 
                        key={r.id} 
                        onClick={() => setEditing({ ...editing, role: r.name })}
                        style={{
                          padding: "10px", borderRadius: 8, cursor: "pointer",
                          border: `2px solid ${editing.role === r.name ? rc.color : "var(--border)"}`,
                          background: editing.role === r.name ? rc.bg : "var(--bg)",
                          color: rc.color, fontSize: 13, fontWeight: editing.role === r ? 700 : 500,
                        }}
                      >
                        {tr(r.name, lang)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button onClick={saveUser}
                style={{ padding: "12px", borderRadius: 8, border: "none", background: "#1A365D", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 15 }}>
                {tr("save_changes", lang)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersPage;