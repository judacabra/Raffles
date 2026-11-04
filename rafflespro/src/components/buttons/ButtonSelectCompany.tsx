import { NavigateFunction, useNavigate } from "react-router-dom";

import {useAppSelector } from "../../store/hooks";
import { Language } from "../../store/slices/uiSlice";

import { tr } from "../../i18n/translations";

const ButtonSelectCompany = () => {
  const navigate: NavigateFunction = useNavigate();

  const lang: Language = useAppSelector((s) => s.ui.language);

  return (
    <button
      onClick={() => navigate("/select-company", { replace: true })}
      style={{
          width: 42, height: 42, borderRadius: 6, fontSize: 15,
          border: "1px solid var(--border)", fontWeight: 700,
          background: "var(--bg)", cursor: "pointer",
          color: "var(--text-secondary)", letterSpacing: "0.05em",
          fontFamily: "var(--font-mono)",
      }}
      title={tr("select_company", lang)}
    >
      🏢
    </button>
  );
};

export default ButtonSelectCompany;
