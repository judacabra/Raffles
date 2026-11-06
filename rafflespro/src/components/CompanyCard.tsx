import { type ReactNode } from "react";

import { useAppSelector } from "../store/hooks";
import { Language } from "../store/slices/uiSlice";

import { tr } from "../i18n/translations";

import { appConfig } from "../config";

const Icon = ({
  children,
  size = 20,
  className = "",
}: {
  children: ReactNode;
  size?: number;
  className?: string;
}): React.JSX.Element => {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      {children}
    </svg>
  );
};

const Arrow = ({ direction = "right" }: { direction?: "left" | "right" }): React.JSX.Element => {
  return (
    <Icon size={18} className={direction === "left" ? "rotate-180" : ""}>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </Icon>
  );
};

export const CompanyCard = ({ c }: { c: any }) => {
  const lang: Language = useAppSelector((s) => s.ui.language);
  
  const { uploadsFolder } = appConfig;

  const initialNameLetters = (c: string): string => {
    const parts: string[] = c.trim().split(/\s+/).filter(Boolean);

    if (parts.length < 2) {
      return parts[0]?.charAt(0).toUpperCase() ?? "";
    }

    return (
      parts[0].charAt(0).toUpperCase() +
      parts[1].charAt(0).toUpperCase()
    );
  };

  const goToCompany = (c: string): void => {
    const cNameFormatted: string = c.trim().replace(" ", "").toLowerCase();

    let host: string = location.host.startsWith("rifaspro") 
      ? `${cNameFormatted}.${location.host}` 
      : `${cNameFormatted}.rifaspro.local`;

    host += "/login";

    window.open("http://" + host, "_blank")
  };

  return (
    <div>
      <div className="relative h-[300px] overflow-hidden">
        <img
          alt={`Premios de ${c.name}`}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          style={{ borderRadius: "20px 20px 0 0" }}
          src={c.logoURL.startsWith("upload") ? `${uploadsFolder}/${c.logoURL}` : c.logoURL}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131512] via-transparent to-black/10" />
        <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[10px] font-bold tracking-[.12em] backdrop-blur">
          {c.tag.toUpperCase()}
        </span>
      </div>
      <div 
        className="flex items-center justify-between p-5" 
        style={{ 
          borderBottom: "#eeeeee20 solid .5px", 
          borderBottomRightRadius: 20, borderBottomLeftRadius: 20, 
        }}
      >
        <div className="flex items-center gap-3.5">
          <span
            className="grid size-11 place-items-center rounded-xl text-xs font-black text-[#10120f]"
            style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
          >
            {initialNameLetters(c.name)}
          </span>
          <div>
            <h3 className="text-base font-extrabold">{c.name}</h3>
            <p className="text-[11px] text-white/40 m-0 p-0">{c.location}</p>
          </div>
        </div>
        <span 
          className={`
            grid size-10 place-items-center rounded-full border border-white/10 
            transition group-hover:border-[#f5dc4b] group-hover:bg-[#f5dc4b] 
            group-hover:text-[#10120f]
          `}
          style={{ cursor: "pointer", color: "var(--color-gold)" }}
          title={tr("go_to_x", lang, { x: c.name })}
          onClick={() => goToCompany(c.name)}
          onMouseEnter={(e) => [
            e.currentTarget.style.background = "var(--color-gold)", 
            e.currentTarget.style.color = "#00000080"
          ]}
          onMouseLeave={(e) => [
            e.currentTarget.style.background = "transparent", 
            e.currentTarget.style.color = "var(--color-gold)"
          ]}
        >
          <Arrow />
        </span>
      </div>
    </div>
  );
};
