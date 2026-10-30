import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

import { SweetAlertOptions } from "sweetalert2";

import { useAppDispatch, useAppSelector } from "../store/hooks";

import { User, } from "../store/slices/authSlice";
import { addToast, Language, Theme } from "../store/slices/uiSlice";

import { tr } from "../i18n/translations";

import { extract_TIME_AGO } from "../utils/date-time";
import { firstLetterUppercase } from "../utils/format-words";

import { DeleteNotification, GetNotifications, PutNotification } from "../api/notificationAPI";

import { useAlert } from "../utils/useAlert";

export default function Notification() {
  const navigate: NavigateFunction = useNavigate();

  const dispatch = useAppDispatch();

  const user: User | null = useAppSelector((s) => s.auth.user);
  const theme: Theme = useAppSelector((s) => s.ui.theme);
  const lang: Language = useAppSelector((s) => s.ui.language);

  const { sConfirm } = useAlert();
 
  const [notifOpen, setNotifOpen] = useState<boolean>(false);

  const [notificationsFounded, setNotificationsFounded] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const pendingNotifications: boolean = notifications.some((n: any) => n.readedAt == null);

  const maxNumbersPerPage: number = 6;
  const [visibleCount, setVisibleCount] = useState<number>(maxNumbersPerPage);
  
  const visibleNotifications: any[] = notifications.slice(0, visibleCount);

  const existMore: boolean = visibleNotifications.length < notifications.length;

  const handleNotification = async (n: any): Promise<void> => {
    setNotifOpen(false);

    await setReadedNotification(n.id);
    
    navigate(n.data.url, {
      replace: true,
      state: n.data.params ? n.data.params : {},
    });
  }

  const handleDeleteNotification = (id: number): void => {
    event?.preventDefault();
    
    const sProps: SweetAlertOptions = {
      html: tr("are_you_sure_you_want_to_delete_x", lang, { x: tr("this_notification", lang) }),
      confirmButtonText: tr("yes_delete", lang),
    };

    sConfirm(sProps, () => tryDeleteNotification(id));
  };

  const tryDeleteNotification = async (id: number): Promise<void> => {
    try {
      const response = await DeleteNotification(id);

      if (!response.statusCode) setNotifOpen(false);

      const bodyToast: any = {
        type: !response.statusCode ? "success" : "error",
        message: !response.statusCode 
          ? tr("notification_deleted_successfully", lang) 
          : tr("failed_to_delete_notification", lang),
      };

      dispatch(addToast(bodyToast));
    } catch(err: any) {
      console.error(`${tr("failed_to_delete_notification", lang)}: `, err);
    } finally {
      if (user) await fetchNotifications(user.id);
    }
  };

  const fetchNotifications = async (idC: number): Promise<void> => {
    try {
      const result = await GetNotifications(idC);
      
      if (result) setNotifications(result);
    } catch (err: any) {
      console.error(
        `Error al obtener las notificaciones de la empresa id #${idC}: `,
        err,
      );
    } finally {
      setNotificationsFounded(true);
    }
  };

  const setReadedNotification = async (id: number): Promise<void> => {
    const date: string = new Date().toISOString().split("T")[0]
    const hour: string = new Date().toISOString().split("T")[1].split(".")[0];

    try {
      await PutNotification(id, { readedAt: `${date} ${hour}`, });
    } catch (err: any) {
      console.error(`Error al actualizar la notaificación de id #${id}: `, err);
    } finally {
      if (user) await fetchNotifications(user.id);
    }
  };

  const showMoreNotifications = (): void => {
    setVisibleCount(prev => prev + maxNumbersPerPage);
  };

  useEffect(() => {
    if (user && !notificationsFounded) fetchNotifications(Number(user.id));
  }, [user, notificationsFounded]);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setNotifOpen(!notifOpen)}
        style={{
          width: 42, height: 42, borderRadius: 8, border: "1px solid var(--border)",
          background: "var(--bg)", cursor: "pointer", fontSize: 16, position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
        aria-label={tr("notifications", lang)}
      >
        🔔
        {pendingNotifications && (
          <span
            style={{
              position: "absolute", top: 6, right: 6, width: 10, height: 10,
              borderRadius: "50%", background: "#FC8181", border: "2px solid var(--bg-header)",
            }}
          />
        )}
      </button>
      {notifOpen && (
        <div
          style={{
            position: "absolute", top: "calc(100% + 8px)", right: 0, width: 320,
            boxShadow: "0 8px 24px #0000001A", maxHeight: "80vh", overflow: "hidden", 
            background: "var(--bg-card)", border: "1px solid var(--border)", zIndex: 100, 
            display: "flex", flexDirection: "column", borderRadius: 12,
          }}
        >
          <div
            style={{
              padding: "14px 16px", borderBottom: "1px solid var(--border)", fontWeight: 600,
              fontSize: 14, color: "var(--text-primary)",
            }}
          >
            {tr("notifications", lang)}
          </div>
          <div style={{ flex: 1, overflowY: "auto", minHeight: 0, }}
          >
            {visibleNotifications && visibleNotifications.length === 0 ? (
              <p
                style={{
                  height: 45, fontSize: 13, textAlign: "center", 
                  width: "315px", paddingTop: 12,
                }}
              >
                {tr("no_notifications", lang)}
              </p>
            ) : (
              <>
                {visibleNotifications.map((n, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "12px 16px", display: "flex", gap: 12, alignItems: "flex-start",
                      borderBottom: "1px solid var(--border)", cursor: "pointer", position: "relative",
                      fontWeight: !n.readedAt ? "bold": "normal",
                    }}
                    onClick={() => handleNotification(n)}
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg)" }
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent" }
                  >
                    <span style={{ fontSize: 20 }}>{n.data.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{ 
                          fontSize: 13, color: "var(--text-primary)",
                          lineHeight: 1.4,
                        }}
                      >
                        {n.message}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, }}>
                        {firstLetterUppercase(extract_TIME_AGO(n.data.time, n.createdAt, lang))}
                      </div>
                    </div>
                    <small 
                      title={tr("delete_notification", lang)} 
                      style={{ 
                        color: theme == "dark" ? "#fff" : "#c53030", position: "absolute", fontSize: 10, bottom: 10, 
                        right: 13, border: "solid 0.5px", padding: ".6px 8px", borderRadius: 10,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(n.id);
                      }}
                      onMouseEnter={(e) => [
                        e.currentTarget.style.background = "#c53030", 
                        e.currentTarget.style.color = "#fff",
                      ]}
                      onMouseLeave={(e) => [
                        e.currentTarget.style.background = theme == "dark" ? "var(--bg)" : "#fff", 
                        e.currentTarget.style.color = theme == "dark" ? "#fff" : "#c53030",
                      ]}
                    >
                      {tr("delete", lang)}
                    </small>
                  </div>
                ))}
                {(visibleNotifications.length > 0 && existMore) && (
                  <button
                    style={{
                      padding: "10px 25px",
                      fontSize: 13,
                      width: "100%",
                      cursor: "pointer",
                    }}
                    onClick={showMoreNotifications}
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg)" }
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent" }
                  >
                    Ver más
                  </button>
                )}
                {(visibleNotifications.length > 0 && !existMore) && (
                  <div style={{ padding: "6px" }}>{' '}</div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
