
import { tr } from "../i18n/translations";
import "../styles/Paginator.css";

export interface PaginatorProps {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  lang: "es" | "en";
  border?: any;
}

const Paginator = ({
  page,
  totalPages,
  onPageChange,
  lang,
  border = { top: false, right: false, bottom: false, left: false, radius: false },
}: PaginatorProps): React.JSX.Element => {

  const pages = Array.from(
    { length: totalPages },
    (_, i) => i + 1
  );

  const goTo = (p: number): void => {
    if (p < 1 || p > totalPages || p === page) return;
    onPageChange(p);
  };

  if (totalPages <= 0) return <></>;

  return (
    <div 
      id="paginator" 
      style={{ 
        borderTop: border.top ? "solid .5px #ddd" : "none",
        borderRight: border.right ? "solid .5px #ddd" : "none",
        borderBottom: border.bottom ? "solid .5px #ddd" : "none",
        borderLeft: border.left ? "solid .5px #ddd" : "none",
        borderRadius: border.radius ? "15px" : "0",
      }}
    >
      <div className="paginator-controls">
        {totalPages > 4 && (
          <>
            <button
              className="paginator-nav"
              disabled={page === 1}
              onClick={() => goTo(1)}
              title={tr("go_to_start", lang)}
            >
              «
            </button>

            <button
              className="paginator-nav"
              disabled={page === 1}
              onClick={() => goTo(page - 1)}
              title={tr("previous", lang)}
            >
              ‹
            </button>
          </>
        )}

        {pages.map((p) => {
          const active = p === page;

          return (
            <button
              key={p}
              className={`paginator-page ${active ? "active" : ""}`}
              onClick={() => goTo(p)}
              aria-current={active ? "page" : undefined}
            >
              {p}
            </button>
          );
        })}

        {totalPages > 4 && (
          <>
            <button
              className="paginator-nav"
              disabled={page === totalPages}
              onClick={() => goTo(page + 1)}
              title={tr("next", lang)}
            >
              ›
            </button>

            <button
              className="paginator-nav"
              disabled={page === totalPages}
              onClick={() => goTo(totalPages)}
              title={tr("go_to_end", lang)}
            >
              »
            </button>
          </>
        )}

      </div>

      <small className="paginator-info">
        {tr("page", lang)} {page} {tr("of", lang)} {totalPages}
      </small>

    </div>
  );
};

export default Paginator;
