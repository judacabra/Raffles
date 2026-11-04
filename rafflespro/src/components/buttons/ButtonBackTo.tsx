import { Language } from "../../store/slices/uiSlice";
import { User } from "../../store/slices/authSlice";
import { useAppSelector } from "../../store/hooks";

import { tr } from "../../i18n/translations";

import { firstLetterUppercase } from "../../utils/format-words";

const ButtonTheme = (
  { onClick } :
  { onClick: () => void }
) => {
    const lang: Language = useAppSelector((s: any) => s.ui.language);
    const user: User | null = useAppSelector((s: any) => s.auth.user);
    const token: string | null = useAppSelector((s) => s.auth.accessToken);
    const permissions: any = useAppSelector((s: any) => s.auth.user.rolePermissions);

  return (
    <button
      style={{
        position: "absolute", left: 20, top: 20, width: 45, 
        height: 45, background: "var(--bg)", cursor: "pointer",
        paddingBottom: 2, transform: "rotate(180deg)",
        borderRadius: "50%",
      }}
      title={firstLetterUppercase(
        tr("back_to_x", lang, {
          x: user && token ? tr(`${permissions[0]}`, lang) : tr("login", lang),
        }),
      )}
      onClick={onClick}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "var(--bg-header)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg)")}
    >
      ➜
    </button>
  );
};

export default ButtonTheme;
