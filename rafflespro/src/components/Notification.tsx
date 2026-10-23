import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

import { useAppSelector } from "../store/hooks";
import { Language, Theme, } from "../store/slices/uiSlice";

import { tr } from "../i18n/translations";

import { extract_TIME_AGO } from "../utils/date-time";

import { GetNotifications } from "../api/notificationAPI";

export default function Notification() {
  const navigate: NavigateFunction = useNavigate();

  const company = useAppSelector((s) => s.auth.activeCompany);
  const lang: Language = useAppSelector((s) => s.ui.language);

  const [notifOpen, setNotifOpen] = useState<boolean>(false);

  const [notificationsFounded, setNotificationsDounded] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const NOTIFICATION_MOCK: any[] = [
    {
      icon: "🎉",
      msg:
        lang === "es"
          ? "Rifa Navideña vendió 47 números hoy"
          : "Christmas Raffle sold 47 numbers today",
      time: "Hace 5 min",
      url: "/board",
      params: { raffleSelected: 2 },
    },
    {
      icon: "⚠️",
      msg:
        lang === "es"
          ? "Número 047 en estado Reservado por 24h"
          : "Number 047 reserved for 24h",
      time: "Hace 1h",
      url: "",
      params: {},
    },
    {
      icon: "✅",
      msg:
        lang === "es"
          ? "Sorteo Solidario completado exitosamente"
          : "Solidarity Raffle completed",
      time: "Ayer",
      url: "",
      params: {},
    },
  ];

  const handleDeleteNotification = (nId: number): void => {
    event?.preventDefault();
    alert(`Eliminando notificación...`);

    setTimeout(() => {
      alert(`Notificación Eliminada`);
      setNotifications(notifications.filter((n: any) => n.id !== nId))
    }, 1500);
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
      setNotificationsDounded(true);
    }
  };

  useEffect(() => {
    if (company && !notificationsFounded) fetchNotifications(Number(company.id));
  }, [company, notificationsFounded]);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setNotifOpen(!notifOpen)}
        style={{
          width: 36, height: 36, borderRadius: 8, border: "1px solid var(--border)",
          background: "var(--bg)", cursor: "pointer", fontSize: 16, position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
        aria-label={tr("notifications", lang)}
      >
        🔔
        <span
          style={{
            position: "absolute", top: 6, right: 6, width: 8, height: 8,
            borderRadius: "50%", background: "#FC8181", border: "2px solid var(--bg-header)",
          }}
        />
      </button>
      {notifOpen && (
        <div
          style={{
            position: "absolute", top: "calc(100% + 8px)", right: 0, width: 320,
            background: "var(--bg-card)", border: "1px solid var(--border)", zIndex: 100, borderRadius: 12,
            boxShadow: "0 8px 24px #0000001A", maxHeight: "80vh", overflow: "hidden", display: "flex",
            flexDirection: "column",
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
            {notifications && notifications.length === 0 ? (
              <p
                style={{
                  height: 45, fontSize: 13, textAlign: "center", width: "315px",
                  paddingTop: 12,
                }}
              >
                {tr("no_notifications", lang)}
              </p>
            ) : (
              <>
                {notifications.map((n, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "12px 16px", display: "flex", gap: 12, alignItems: "flex-start",
                      borderBottom: "1px solid var(--border)", cursor: "pointer", position: "relative",
                    }}
                    onClick={() => {
                      setNotifOpen(false);
                      navigate(n.data.url, {
                        replace: true,
                        state: n.data.params ? n.data.params : {},
                      });
                    }}
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
                        {extract_TIME_AGO(n.data.time, "2026-10-15")}
                      </div>
                    </div>
                    <small 
                      title={tr("delete_notification", lang)} 
                      style={{ 
                        color: "#c53030", position: "absolute", fontSize: 10, bottom: 10, 
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
                        e.currentTarget.style.background = "#fff", 
                        e.currentTarget.style.color = "#c53030",
                      ]}
                    >
                      {tr("delete", lang)}
                    </small>
                  </div>
                ))}
                {notifications && (notifications.length >= 1 && notifications.length <= 20) && (
                  <button
                    style={{
                      padding: "10px 25px",
                      fontSize: 13,
                      width: "100%",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      const nots = [...notifications, ...notifications];
                      setNotifications(nots);
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg)" }
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent" }
                  >
                    Ver más
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
