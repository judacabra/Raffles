import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate, useSearchParams } from "react-router-dom";

import { useAppSelector, } from "../../store/hooks";
import { Language } from "../../store/slices/uiSlice";

import { tr } from "../../i18n/translations";

import { Module } from "../../interfaces/module.interfaces";
import { MODULES } from "../../constants/modules";

const SearchPage = () => {
  const navigate: NavigateFunction = useNavigate();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const urlText: string | null = searchParams.get("text");

  const lang: Language = useAppSelector((s: any) => s.ui.language);
  
  const [infoFounded, setInfoFounded] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [searched, setSearched] = useState<string>("");

  const modules: Module[] = MODULES.filter((m: Module) =>
    m.title.toLowerCase().includes(text.toLowerCase()) ||
    m.description.toLowerCase().includes(text.toLowerCase())
  );

  const highlightText = (description: string, text: string) => {
    if (!text) return description;

    const parts: string[] = description.split(new RegExp(`(${text})`, "gi"));

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
      setText(urlText);

      searchParams.delete("text");
      setSearchParams(searchParams, { replace: true });
    }
  }, []);

  return (
    <div
      className="search-results"
      style={{
        display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center",
        gap: 16, padding: "25px 50px", width: "100%", maxHeight: "90vh", overflowY: "auto",
        boxSizing: "border-box", 
      }}
    >
      {!text && (
        <h3 style={{ margin: "0 0 15px" }}>
          {tr("please_write_something_for_search", lang)}
        </h3>
      )}

      {modules.length > 1 && text && (
        <h3
          style={{
            margin: "0 0 10px", width: "70%", textAlign: "left", flexShrink: 0,
          }}
        >
          {tr("sought", lang)}: "<b>{text}...</b>"
        </h3>
      )}

      {modules && text && modules.length === 0 ? (
        <div>
          <span>
            Ups, no se encontró información relacionado con <b>"{text}"...</b>
          </span>
        </div>
      ) : (
        modules.map(({ url, icon, title, subtitle, description, }, i) => (
          <div
            key={i}
            style={{
              display: "flex", flexDirection: "column", padding: 15, border: "1px solid #c2c2c2",
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
                  width: "50px", height: "50px", margin: "0 20px 10px 0", 
                  border: "solid .5px #c2c2c2", borderRadius: "50%", fontSize: 25,
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
                  {highlightText(url, text)}
                </h2>
              </div>
            </div>

            <h2 style={{ fontWeight: "bold", marginBottom: 7, }}> {highlightText(subtitle, text)} </h2>

            <div>
              <p style={{ fontSize: 13, color: "#4e4e4e" }}> {highlightText(description, text)} </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SearchPage;
