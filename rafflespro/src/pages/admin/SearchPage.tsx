import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate, useSearchParams } from "react-router-dom";

import { useAppSelector, } from "../../store/hooks";
import { Language } from "../../store/slices/uiSlice";

import { tr } from "../../i18n/translations";

import { Module } from "../../interfaces/module.interfaces";
import { MODULES } from "../../constants/constants";
import { User } from "../../store/slices/authSlice";

import Paginator from "../../components/Paginator";

const SearchPage = () => {
  const lang: Language = useAppSelector((s: any) => s.ui.language);
  const user: User | null = useAppSelector((s: any) => s.auth.user);
  const permissions: any = useAppSelector((s: any) => s.auth.user.rolePermissions);

  const navigate: NavigateFunction = useNavigate();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [text, setText] = useState<string>("");
  const urlText: string = searchParams.get("text") || "";

  const modFiltered: Module[] = MODULES.filter((m: Module) => (user && user.rolePermissions) && user.rolePermissions.includes(m.url.split("/")[1].toLowerCase()));

  const modules: Module[] = modFiltered.filter((m: Module): boolean =>
    m.title.toLowerCase().includes(text.toLowerCase()) ||
    m.description.toLowerCase().includes(text.toLowerCase())
  );

  /* PAGINATOR PAYMENTS */
  const [page, setPage] = useState<number>(1);
  const maxPerPage: number = 3;
  const totalPages: number = Math.ceil(modules.length / maxPerPage);
  const start: number = (page - 1) * maxPerPage;
  const paginated: any[] = modules.slice(start, start + maxPerPage);
  const border: any = { top: true, right: true, bottom: true, left: true, radius: true, };

  const highlightText = (v: string, text: string): any => {
    if (!text) return v;

    const parts: string[] = v.split(new RegExp(`(${text})`, "gi"));

    return parts.map((part, index) =>
      part.toLowerCase() === text.toLowerCase() ? (
        <b key={index}>{part}</b>
      ) : (
        part
      )
    );
  };

  useEffect(() => {
    if (urlText) {
      setText(urlText.trim());
      setPage(1);
      setSearchParams({}, { replace: true });
    } 
  }, [urlText, setSearchParams]);

  useEffect(() => {
    if (!text && !urlText) navigate(`/${permissions[0]}`, { replace: true });
  }, [text, urlText, permissions]);

  return (
    <div
      className="search-results"
      style={{
        display: "flex", flexDirection: "column", justifyContent: "flex-start", 
        alignItems: "center", boxSizing: "border-box", overflowY: "auto",
        gap: 16, padding: "25px 50px 10px", width: "100%", maxHeight: "90vh", 
      }}
    >

      {(modules.length > 1 && text) && (
        <h3
          style={{
            margin: "-5px 0 2px", width: "70%", textAlign: "left", flexShrink: 0,
          }}
        >
          {tr("sought", lang)}: "<b>{text}...</b>"
        </h3>
      )}

      {(paginated && text && paginated.length === 0) ? (
        <div>
          <span>
            Ups, no se encontró información relacionado con <b>"{text}"...</b>
          </span>
        </div>
      ) : (
        <>
          {paginated.map(({ url, icon, title, subtitle, description, }, i) => (
            <div
              key={i}
              style={{
                display: "flex", flexDirection: "column", padding: 15, border: "1px solid #ddd",
                width: "70%", borderRadius: 15, cursor: "pointer", boxSizing: "border-box",
                flexShrink: 0, transition: "border-color 0.2s ease", background: "#fff",
              }}
              onClick={() => {}}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 2px 15px 0px rgba(0, 0, 0, 0.3)"}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
            >
              <div style={{ display: "flex" }}>
                <div 
                  style={{ 
                    display: "flex", justifyContent: "center", alignItems: "center",
                    width: "50px", height: "50px", margin: "0 20px 8px 0", 
                    border: "solid .5px #ddd", borderRadius: "50%", fontSize: 25,
                    boxShadow: "0 2px 10px 0px rgba(0, 0, 0, 0.3)"
                  }}
                >
                  {icon}
                </div>

                <div>
                  <h3 style={{ fontWeight: "bold" }}>
                    {highlightText(title, text)}
                  </h3>

                  <h2
                    onClick={() => navigate(url, { replace: true })}
                    style={{ fontStyle: "italic", fontSize: 13, color: "#5272db", }}
                  >
                    {url}
                  </h2>
                </div>
              </div>

              <h2 style={{ fontWeight: "bold", marginBottom: 7, }}> {highlightText(subtitle, text)} </h2>

              <div>
                <p style={{ fontSize: 13, color: "#4e4e4e" }}> {highlightText(description, text)} </p>
              </div>
            </div>
          ))}
          {modules.length > 3 && (
            <div style={{ width: "100%", marginTop: 10, padding: "0 11.8vw 0", }}>
              <Paginator
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                lang={lang}
                border={border}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;
