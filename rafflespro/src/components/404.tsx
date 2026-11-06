import { useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

import { useAppSelector } from "../store/hooks.ts";
import { Language, Theme, } from "../store/slices/uiSlice";
import { User } from "../store/slices/authSlice.ts";

import ButtonLanguage from "./buttons/ButtonLanguage.tsx";
import ButtonTheme from "./buttons/ButtonTheme.tsx";

import { tr } from "../i18n/translations";

import { firstLetterUppercase } from "../utils/format-words.ts";

import "../styles/404.css";

export default function NotFoundPage() {
  const navigate: NavigateFunction = useNavigate();

  const user: User | null = useAppSelector((s: any) => s.auth.user);
  const token: string | null = useAppSelector((s) => s.auth.accessToken);
  const permissions: string[] | undefined = useAppSelector((s) => s.auth.user?.rolePermissions);

  const lang: Language = useAppSelector((s) => s.ui.language);
  const theme: Theme = useAppSelector((s) => s.ui.theme);

  const [lngOpen, setLngOpen] = useState<boolean>(false);
  
  const handleButtonLanguage = (): void => {
    setLngOpen(!lngOpen);  
  };

  const handleButtonTheme = (): void => {
    setLngOpen(false); 
  };

  return (
    <div 
      style={{
        display: "flex",
        justifyContent: "center",
        background: `linear-gradient(135deg, var(--bg-sidebar) 0%, ${theme === "dark" 
          ? "var(--color-primary)" 
          : "var(--color-primary-light)"} 50%, var(--bg-sidebar) 100%)`,
      }}
    >
      <div style={{ position: "absolute", top: 20, right: 20, }}>
        <div style={{ position: "absolute", top: 0, right: 50, }}>
          <ButtonLanguage 
            open={lngOpen}
            onClick={handleButtonLanguage}
          />
        </div>

        <ButtonTheme onClick={handleButtonTheme} />
      </div>

      <div 
        style={{
          height: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-sans)", width: "40vw",
        }}
      >
        <div className="background-shapes">
          <div className={`background-orb orb-one ${theme}`} />
          <div className={`background-orb orb-two ${theme}`} />
          <div className={`background-orb orb-three ${theme}`} />
          <div className={`background-orb orb-four ${theme}`} />
          <div className={`background-orb orb-five ${theme}`} />
          <div className={`background-orb orb-six ${theme}`} />
        </div>

        <div className="container">
          <div className="needle-wrapper">
            <div className="needle"></div>
            <svg className="illustration" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="48" fill="#f3f0ff" stroke="var(--color-gold)" stroke-width="3"/>
              <g>
                <path d="M50 50 L50 4 A46 46 0 0 1 82.5 17.5 Z" fill="var(--bg-header)"/>
                <path d="M50 50 L82.5 17.5 A46 46 0 0 1 96 50 Z" fill="var(--color-primary-light)"/>
                <path d="M50 50 L96 50 A46 46 0 0 1 82.5 82.5 Z" fill="var(--bg-header)"/>
                <path d="M50 50 L82.5 82.5 A46 46 0 0 1 50 96 Z" fill="var(--color-primary-light)"/>
                <path d="M50 50 L50 96 A46 46 0 0 1 17.5 82.5 Z" fill="var(--bg-header)"/>
                <path d="M50 50 L17.5 82.5 A46 46 0 0 1 4 50 Z" fill="var(--color-primary-light)"/>
                <path d="M50 50 L4 50 A46 46 0 0 1 17.5 17.5 Z" fill="var(--bg-header)"/>
                <path d="M50 50 L17.5 17.5 A46 46 0 0 1 50 4 Z" fill="var(--color-primary-light)"/>
              </g>

              <circle cx="86" cy="35" r="2.5" fill="var(--text-primary)"/>
              <circle cx="86" cy="65" r="2.5" fill="var(--text-primary)"/>
              <circle cx="66" cy="86" r="2.5" fill="var(--text-primary)"/>
              <circle cx="66" cy="15" r="2.5" fill="var(--text-primary)"/>
              <circle cx="34" cy="86" r="2.5" fill="var(--text-primary)"/>
              <circle cx="34" cy="15" r="2.5" fill="var(--text-primary)"/>
              <circle cx="13" cy="65" r="2.5" fill="var(--text-primary)"/>
              <circle cx="13" cy="35" r="2.5" fill="var(--text-primary)"/>

              <circle cx="50" cy="50" r="10" fill="var(--color-gold)"/>
              <circle cx="50" cy="50" r="5" fill="var(--text-primary)"/>
            </svg>
          </div>

          <div className="error-code"> 404 </div>
          
          <h1> {tr("sorry_page_not_found", lang)} </h1>
          
          <p style={{ margin: "0 0 10px", }}> {tr("page_not_found_sb", lang)} </p>
          <p style={{ margin: "0 0 30px", }}> {tr("page_not_found_msg", lang)}  </p>

          <button 
            className="btn" 
            title={firstLetterUppercase(tr("back_to_x", lang, { x: (user && token && permissions) ? tr(`${permissions[0]}`, lang) : tr("login", lang) }))}
            onClick={() => navigate((user && token && permissions) ? permissions[0] : "login", { replace: true })}
          > 
            {firstLetterUppercase(tr("back_to_x", lang, { x: (user && token && permissions) ? tr(`${permissions[0]}`, lang) : tr("login", lang) }))} 🎲 
          </button>
        </div>
      </div>
    </div>
  );
}
