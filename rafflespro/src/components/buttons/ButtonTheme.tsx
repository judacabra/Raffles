import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Language, Theme, toggleTheme } from "../../store/slices/uiSlice";

import { tr } from "../../i18n/translations";
import { firstLetterUppercase } from "../../utils/format-words";

const ButtonTheme = (
  { onClick }:
  { onClick?: () => void }
) => {
  const dispatch = useAppDispatch();

  const lang: Language = useAppSelector((s) => s.ui.language);
  const theme: Theme = useAppSelector((s) => s.ui.theme);

  return (
    <button
      onClick={() => {
        if (onClick) onClick();
        dispatch(toggleTheme());
      }}
      style={{
        borderRadius: 8, border: "1px solid var(--border)",
        width: 42, height: 42, background: "var(--bg)",
        cursor: "pointer", fontSize: 16, display: "flex", 
        alignItems: "center", justifyContent: "center",
      }}
      title={firstLetterUppercase(
        tr("switch_to_x", lang, {
          x: theme === "dark" ? tr("light", lang) : tr("dark", lang),
        }),
      )}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
};

export default ButtonTheme;