import { useEffect, useState } from "react";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { addToast, Language } from "../../store/slices/uiSlice";
import { tr } from "../../i18n/translations";

import { UserRow } from "@/interfaces/user.interfaces";

import { GetUsers, PutUser, PutUserStatus, SetUser, DeleteUser } from "../../api/usersAPI";

const UsersPage = () => {
  const dispatch = useAppDispatch();

  const lang: Language = useAppSelector((s: any) => s.ui.language);

  const roleColors: Record<string, { bg: string; color: string }> = {
    admin:  { bg: "#EBF4FF", color: "#2B6CB0", },
    seller: { bg: "#F0FFF4", color: "#276749", },
    viewer: { bg: "#FFFFF0", color: "#7B6B00", },
  };

  const [users, setUsers] = useState<UserRow[]>([]);
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [usersFounded, setUsersFounded] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const filtered: UserRow[] = users.length > 0 
    ? users.filter((u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    ) : [];

  const openEdit = (u: UserRow): void => { 
    setEditing({ ...u }); 
    setModalOpen(true); 
  }

  const openNew = (): void => {
    setEditing({ username: "", email: "", company: "Rifas JC", role: "seller", isActive: false, });
    setModalOpen(true);
  }

  const saveUser = async (): Promise<void> => {
    if (!editing) return;
    
    try {
      if (editing.id) {
        await PutUser(editing.id, editing);
      } else {
        await SetUser(editing);
      }
    } catch (err: any) {
      console.error(`Error al ${(editing.id ? "actualizar" : "guardar")} el usuario: `, err);
    } finally {
      await fetchUsers();

      dispatch(addToast({ type: "success", message: tr("user_saved", lang) }));

      setModalOpen(false);
    }
  }

  const changeUserStatus = async (id: number, status: boolean): Promise<void> => {
    try {
      await PutUserStatus(id, status);
    } catch (err: any) {
      console.error(`Error al actualizar el estado del usuario: `, err);
    } finally {
      await fetchUsers();

      dispatch(addToast({ type: "success", message: tr("status_updated", lang) }));
    }
  }

  const toggleActive = async (id: number): Promise<void> => {
    const user = users.find((u: UserRow) => u.id === id);
    if (!user) return;

    await changeUserStatus(id, !user.isActive);
  }

  const deleteUser = async (id: number): Promise<void> => {
    try {
      await DeleteUser(id);
    } catch (err: any) {
      console.error('Error al eliminar el usuario: ', err);
    } finally {
      await fetchUsers();

      dispatch(addToast({ type: "info", message: tr("user_deleted", lang) }));

      setModalOpen(false);
    }
  }

  const fetchUsers = async (): Promise<void> => {
    try {
      const data: UserRow[] = await GetUsers();
      setUsers(data);
    } catch (err: any) {
      console.error('Error al obtener los usuarios: ', err);
    } finally {
      setUsersFounded(true);
    }
  }

  useEffect(() => {
    if (!usersFounded) fetchUsers();
  }, [usersFounded]);

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
              filtered.map((u) => {
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
                          {u.imageURL || u.username.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{u.username}</div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{u.company}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: 12 }}>{u.email}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: rc.bg, color: rc.color }}>
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
                      <div style={{ display: "flex", gap: 6 }}>
                        <button 
                          onClick={() => openEdit(u)}
                          title={tr("edit", lang)}
                          style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #1A365D", background: "rgb(185, 229, 250)", cursor: "pointer", fontSize: 12, color: "#1A365D", fontWeight: 600, marginRight: 10, }}>
                            {tr("edit", lang)}
                        </button>
                        <button 
                          onClick={() => deleteUser(u.id!)}
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
                  {(["admin", "seller", "viewer"] as const).map((r) => {
                    const rc = roleColors[r];
                    return (
                      <button key={r} onClick={() => setEditing({ ...editing, role: r })}
                        style={{
                          padding: "10px", borderRadius: 8, cursor: "pointer",
                          border: `2px solid ${editing.role === r ? rc.color : "var(--border)"}`,
                          background: editing.role === r ? rc.bg : "var(--bg)",
                          color: rc.color, fontSize: 13, fontWeight: editing.role === r ? 700 : 500,
                        }}>
                        {tr(r, lang)}
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