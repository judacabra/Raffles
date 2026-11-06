import { useEffect, useState, type ReactNode } from "react";

import { Language } from "../../store/slices/uiSlice";

import { useAppSelector } from "../../store/hooks";

import { Carousel } from "../../components/Carousel";
import { CompanyCard } from "../../components/CompanyCard";
import { CompanyRow } from "../../interfaces/company.interfaces";
import { GetCompanies } from "../../api/companiesAPI";

import { tr } from "../../i18n/translations";

import "../../styles/Landing.css";

const MOCK_COMPANIES: any[] = [
  {
    id: 3,
    name: "Imperio Rifa",
    location: "California, LA",
    tag: "Autos premium",
    logoURL:
      "https://images.unsplash.com/photo-1606590526453-9b8ee4569a70?auto=format&fit=crop&w=900&q=85",
    href: "/rifas/imperio",
    mark: "IR",
    color: "var(--color-gold)",
  },
  {
    id: 4,
    name: "La Número Uno",
    location: "Monterrey, N.L.",
    tag: "Sorteos semanales",
    logoURL:
      "https://images.unsplash.com/photo-1637947112681-17485e3a32ba?auto=format&fit=crop&w=900&q=85",
    href: "/rifas/la-numero-uno",
    mark: "01",
    color: "#fb5c38",
  },
  {
    id: 5,
    name: "Sorteos del Norte",
    location: "Chihuahua, Chih.",
    tag: "Pickups y efectivo",
    logoURL:
      "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=900&q=85",
    href: "/rifas/sorteos-del-norte",
    mark: "SN",
    color: "#80df9a",
  },
  {
    id: 6,
    name: "Rifas 24K",
    location: "Guadalajara, Jal.",
    tag: "Experiencias únicas",
    logoURL:
      "https://images.unsplash.com/photo-1645400379459-f6fd3d963fd4?auto=format&fit=crop&w=900&q=85",
    href: "/rifas/24k",
    mark: "24K",
    color: "#d5ae62",
  },
  {
    id: 7,
    name: "Gran Fortuna",
    location: "Hermosillo, Son.",
    tag: "Premios exclusivos",
    logoURL:
      "https://images.unsplash.com/photo-1567808291548-fc3ee04dbcf0?auto=format&fit=crop&w=900&q=85",
    href: "/rifas/gran-fortuna",
    mark: "GF",
    color: "#75b7ff",
  },
];

const faqs: any[] = [
  {
    question: "¿Rifas Pro organiza los sorteos?",
    answer:
      "Rifas Pro es la plataforma tecnológica que utilizan empresas independientes para administrar y publicar sus sorteos. Cada empresa es responsable de sus dinámicas, permisos, premios y entrega.",
  },
  {
    question: "¿Cómo sé si mi boleto quedó registrado?",
    answer:
      "Al completar tu compra recibirás una confirmación con tus números. También puedes consultar el estatus directamente en el sitio de la empresa organizadora.",
  },
  {
    question: "¿Dónde puedo ver los resultados?",
    answer:
      "Cada empresa publica sus resultados y transmisiones en su propia landing. Desde nuestro directorio puedes entrar al perfil oficial de cada organizador.",
  },
  {
    question: "¿Puedo pagar de forma segura?",
    answer:
      "Las empresas conectadas a Rifas Pro pueden habilitar métodos de pago y validaciones propias. Siempre verifica que estás dentro del perfil oficial listado en esta página.",
  },
];

function Icon({
  children,
  size = 20,
  className = "",
}: {
  children: ReactNode;
  size?: number;
  className?: string;
}) {
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
}

function Arrow({ direction = "right" }: { direction?: "left" | "right" }) {
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
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a
      className="group flex items-center gap-2.5"
      href="/"
      aria-label="Rifas Pro, inicio"
    >
      <img
        src="/images/icon_rifas.png"
        alt="icono_de_rifas"
        style={{ width: 40, background: "#fff", borderRadius: 10 }}
      />
      {!compact && (
        <span className="text-lg font-extrabold tracking-[-0.04em] text-white">
          RIFAS<span className="text-[var(--color-gold)]">PRO</span>
        </span>
      )}
    </a>
  );
}

const LandingPage = () => {
  const lang: Language = useAppSelector((s) => s.ui.language);

  const [openFaq, setOpenFaq] = useState<number>(0);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [companiesFounded, setCompaniesFounded] = useState<boolean>(false);

  const filteredCompanies: any[] = companies.filter((c: any) => c.id !== 200);

  const icons: any = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  const formatterCompany = (c: any[]): void => {
    const dataCompanies: any[] = [...c, ...MOCK_COMPANIES];
    setCompanies(dataCompanies);
  };

  const fetchCompanies = async (): Promise<void> => {
    try {
      const data: CompanyRow[] = await GetCompanies();
      if (data) formatterCompany(data);
    } catch (err: any) {
      console.error("Error al obtener las empresas: ", err);
    } finally {
      setCompaniesFounded(true);
    }
  };

  useEffect(() => {
    if (!companiesFounded) fetchCompanies();
  }, [companiesFounded]);

  return (
    <main id="landing" className="min-h-screen bg-[#0c0e0d] text-[#f5f5ef]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.07] bg-[#0c0e0d]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-5 lg:px-8">
          <Logo />
          <nav className="hidden items-center gap-8 text-[13px] font-semibold text-white/65 lg:flex">
            {[
              [tr("nav_nosotros", lang), "#nosotros"],
              [tr("nav_como_funciona", lang), "#como-funciona"],
              [tr("nav_empresas", lang), "#empresas"],
              [tr("nav_testimonios", lang), "#testimonios"],
              [tr("nav_preguntas", lang), "#preguntas"],
            ].map(([label, href]) => (
              <a
                className="transition hover:text-white"
                href={href}
                key={label}
              >
                {label}
              </a>
            ))}
          </nav>
          <a
            className="hidden items-center gap-2 rounded-full bg-[var(--color-gold)] px-5 py-3 text-[12px] font-extrabold text-[#10120f] transition hover:bg-[var(--color-gold-light)] lg:flex"
            href="#empresas"
          >
            {tr("nav_explorar_rifas", lang)} <Arrow />
          </a>
          <button
            aria-expanded={menuOpen}
            aria-label={tr("nav_abrir_menu", lang)}
            className="grid size-11 place-items-center rounded-full border border-white/10 lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon>
              {menuOpen ? (
                <path
                  d="m6 6 12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.8"
                />
              ) : (
                <path
                  d="M5 8h14M5 16h14"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.8"
                />
              )}
            </Icon>
          </button>
        </div>
        {menuOpen && (
          <nav className="border-t border-white/10 bg-[#0c0e0d] px-5 py-5 lg:hidden">
            {[
              [tr("nav_nosotros", lang), "#nosotros"],
              [tr("nav_como_funciona", lang), "#como-funciona"],
              [tr("nav_empresas", lang), "#empresas"],
              [tr("nav_testimonios", lang), "#testimonios"],
              [tr("nav_preguntas", lang), "#preguntas"],
            ].map(([label, href]) => (
              <a
                className="block border-b border-white/[0.06] py-3.5 text-sm font-semibold text-white/75"
                href={href}
                key={label}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <section
        id="inicio"
        className="relative min-h-[900px] pt-[26px] lg:min-h-[860px]"
      >
        <div className="absolute inset-0">
          <img
            alt={tr("hero_img_alt", lang)}
            className="h-full w-full object-cover object-[66%_center] opacity-75"
            src="https://images.unsplash.com/photo-1606590526453-9b8ee4569a70?auto=format&fit=crop&w=2000&q=90"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#0c0e0d_0%,rgba(12,14,13,.95)_36%,rgba(12,14,13,.46)_67%,rgba(12,14,13,.55)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,#0c0e0d_0%,transparent_33%)]" />
          <div className="noise absolute inset-0 opacity-30" />
        </div>

        <div className="relative mx-auto flex max-w-[1240px] px-5 pb-48 pt-24 lg:px-8 lg:pt-32">
          <div className="max-w-[680px]">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[var(--color-gold)]/25 bg-[var(--color-gold)]/[0.08] px-3 py-2 text-[10px] font-extrabold tracking-[0.17em] text-[var(--color-gold)]">
              <span className="size-1.5 rounded-full bg-[var(--color-gold)] shadow-[0_0_9px_var(--color-gold)]" />
              {tr("hero_badge", lang)}
            </div>
            <h1 
              className="max-w-[650px] text-[150px] font-extrabold leading-[0.95] tracking-[-0.065em] sm:text-[72px] lg:text-[88px]" 
              style={{ fontSize: 93, }}
            >
              {tr("hero_title_part1", lang)} <br />
              <span className="text-[var(--color-gold)]">{tr("hero_title_part2", lang)}</span>
            </h1>
            <p className="mt-7 max-w-[540px] text-base leading-7 text-white/58 sm:text-lg">
              {tr("hero_subtitle", lang)}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                className="flex items-center justify-center gap-3 rounded-full bg-[var(--color-gold)] px-7 py-4 text-[12px] font-extrabold tracking-[0.03em] text-[#11130f] transition hover:-translate-y-0.5 hover:bg-[#fff179]"
                href="#empresas"
              >
                {tr("hero_cta_primary", lang)} <Arrow />
              </a>
              <a
                className="flex items-center justify-center gap-3 rounded-full border border-white/15 bg-white/[0.04] px-7 py-4 text-[12px] font-bold backdrop-blur transition hover:bg-white/10"
                href="#nosotros"
              >
                {tr("hero_cta_secondary", lang)}
              </a>
            </div>
            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 text-[11px] font-semibold tracking-wide text-white/45">
              <span className="flex items-center gap-2">
                <Icon size={17}>
                  <path
                    d="m5 12 4 4L19 6"
                    stroke="var(--color-gold)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </Icon>
                {tr("hero_feature_verified", lang)}
              </span>
              <span className="flex items-center gap-2">
                <Icon size={17}>
                  <path
                    d="M12 3 5 6v5c0 4.4 2.7 8.2 7 10 4.3-1.8 7-5.6 7-10V6l-7-3Z"
                    stroke="var(--color-gold)"
                    strokeLinejoin="round"
                    strokeWidth="1.7"
                  />
                </Icon>
                {tr("hero_feature_secure", lang)}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 border-y border-white/[0.07] bg-[#101210]/75 backdrop-blur-md">
          <div className="mx-auto grid max-w-[1240px] grid-cols-2 px-5 lg:grid-cols-4 lg:px-8">
            {[
              ["+120", tr("stat_companies", lang)],
              ["+2.4M", tr("stat_tickets", lang)],
              ["$85M", tr("stat_prizes", lang)],
              ["99.9%", tr("stat_uptime", lang)],
            ].map(([value, label], index) => (
              <div
                className={`py-7 lg:py-8 ${index % 2 ? "border-l border-white/[0.07] pl-6" : ""} ${index > 1 ? "border-t border-white/[0.07] lg:border-t-0" : ""} ${index > 0 ? "lg:border-l lg:pl-9" : ""}`}
                key={label}
              >
                <strong className="block text-2xl font-extrabold tracking-[-0.04em] text-white lg:text-3xl">
                  {value}
                </strong>
                <span className="mt-1 block text-[9px] font-bold tracking-[0.14em] text-white/38">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="nosotros" className="relative py-24 sm:py-32">
        <div className="soft-grid absolute inset-0 opacity-40" />
        <div className="relative mx-auto grid max-w-[1240px] gap-16 px-5 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:px-8">
          <div className="relative mx-auto w-full max-w-[500px]">
            <div className="absolute -inset-4 rounded-[32px] border border-[var(--color-gold)]/10" />
            <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-[#171916] p-3 shadow-2xl">
              <img
                alt={tr("about_img_alt", lang)}
                className="aspect-[4/5] w-full rounded-[18px] object-cover object-center opacity-70"
                src="https://images.unsplash.com/photo-1645400379459-f6fd3d963fd4?auto=format&fit=crop&w=1000&q=85"
              />
              <div className="absolute inset-3 rounded-[18px] bg-gradient-to-t from-black via-black/10 to-transparent" />
              <div className="absolute bottom-9 left-9 right-9 rounded-2xl border border-white/10 bg-[#11130f]/90 p-5 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-bold tracking-[.15em] text-white/40">
                      {tr("about_next_raffle", lang)}
                    </p>
                    <p className="mt-1 text-lg font-extrabold">
                      Mustang GT 2025
                    </p>
                  </div>
                  <span className="grid size-11 place-items-center rounded-xl bg-[var(--color-gold)] font-extrabold text-[#10120f]">
                    78%
                  </span>
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[78%] rounded-full bg-[var(--color-gold)]" />
                </div>
              </div>
            </div>
            <div className="absolute -right-5 top-12 rounded-2xl border border-white/10 bg-[#171916] px-2 py-2 shadow-xl">
              <div
                className="animate-toast-in"
                style={{
                  display: "flex", gap: 12, alignItems: "center", background: "#171916",
                  border: `1px solid var(--color-gold-light)`, borderRadius: 8, padding: "12px 16px", 
                  color: "var(--color-gold-light)", boxShadow: "0 4px 12px #0000001A", 
                  fontFamily: "var(--font-sans)", fontSize: 14, cursor: "pointer",
                }}
              >
                <span
                  style={{
                    width: 24, height: 24, borderRadius: "50%", background: "var(--color-success)",
                    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, fontSize: 12, fontWeight: 700,
                  }}
                >
                  {icons["success"]}
                </span>
                <span style={{ flex: 1, fontWeight: 500 }}>
                  {" "}
                  {tr("about_toast_confirmed", lang)}{" "}
                </span>
                <span style={{ opacity: 0.5, fontSize: 18, lineHeight: 1 }}>
                  ×
                </span>
              </div>
            </div>
          </div>

          <div>
            <p className="eyebrow" style={{ color: "var(--color-gold)", fontSize: 13, }}> {tr("about_eyebrow", lang)} </p>
            <h2 className="section-title mt-5"> {tr("about_title", lang)} </h2>
            <p className="mt-7 max-w-[580px] text-base leading-7 text-white/55">
              {tr("about_p1", lang)}
            </p>
            <p className="mt-4 max-w-[580px] text-base leading-7 text-white/55">
              {tr("about_p2", lang)}
            </p>
            <div className="mt-10 grid gap-7 sm:grid-cols-2">
              {[
                [
                  "01",
                  tr("about_val1_title", lang),
                  tr("about_val1_desc", lang),
                ],
                [
                  "02",
                  tr("about_val2_title", lang),
                  tr("about_val2_desc", lang),
                ],
                [
                  "03",
                  tr("about_val3_title", lang),
                  tr("about_val3_desc", lang),
                ],
                [
                  "04",
                  tr("about_val4_title", lang),
                  tr("about_val4_desc", lang),
                ],
              ].map(([number, title, description]) => (
                <div className="border-t border-white/10 pt-5" key={number}>
                  <span className="text-[10px] font-extrabold text-[var(--color-gold)]">
                    {number}
                  </span>
                  <h3 className="mt-2 text-sm font-bold">{title}</h3>
                  <p className="mt-2 text-xs leading-5 text-white/42">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="como-funciona"
        className="border-y border-white/[0.07] bg-[#111310] py-24 sm:py-28"
      >
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">{tr("how_eyebrow", lang)}</p>
              <h2 className="section-title mt-5 max-w-[620px]">
                {tr("how_title", lang)}
              </h2>
            </div>
            <p className="max-w-[360px] text-sm leading-6 text-white/45">
              {tr("how_subtitle", lang)}
            </p>
          </div>
          <div className="mt-14 grid gap-4 lg:grid-cols-3">
            {[
              [
                "01",
                tr("how_step1_title", lang),
                tr("how_step1_desc", lang),
                "M12 3v18M3 12h18",
              ],
              [
                "02",
                tr("how_step2_title", lang),
                tr("how_step2_desc", lang),
                "M4 7h16v12H4zM7 4v6M17 4v6M8 14h2M14 14h2",
              ],
              [
                "03",
                tr("how_step3_title", lang),
                tr("how_step3_desc", lang),
                "m5 12 4 4L19 6",
              ],
            ].map(([number, title, description, path]) => (
              <article
                className="group relative overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#161815] p-7 transition hover:-translate-y-1 hover:border-[var(--color-gold)]/30"
                key={number}
              >
                <span className="absolute right-4 top-0 text-[92px] font-black leading-none tracking-[-.08em] text-white/[0.025]">
                  {number}
                </span>
                <span className="grid size-12 place-items-center rounded-2xl border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/[0.08] text-[var(--color-gold)]">
                  <Icon size={21}>
                    <path
                      d={path}
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.7"
                    />
                  </Icon>
                </span>
                <p className="mt-10 text-[9px] font-extrabold tracking-[.16em] text-[var(--color-gold)]">
                  {tr("how_step_label", lang)} {number}
                </p>
                <h3 className="mt-2 text-xl font-extrabold tracking-[-.03em]">
                  {title}
                </h3>
                <p className="mt-3 max-w-[310px] text-sm leading-6 text-white/42">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="empresas" className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="eyebrow">{tr("companies_eyebrow", lang)}</p>
              <h2 className="section-title mt-5 max-w-[700px]">
                {tr("companies_title", lang)}
              </h2>
              <p className="mt-5 max-w-[560px] text-sm leading-6 text-white/45">
                {tr("companies_subtitle", lang)}
              </p>
            </div>
          </div>

          {filteredCompanies.length < 4 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: 20,
                height: filteredCompanies.length === 0 ? "70vh" : "",
              }}
            >
              {filteredCompanies.length === 0 ? (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    padding: "40px",
                    textAlign: "center",
                    color: "var(--text-muted)",
                  }}
                >
                  {tr("no_companies_found", lang)}
                </div>
              ) : (
                filteredCompanies.map((c: any) => (
                  <CompanyCard key={c.id} c={c} />
                ))
              )}
            </div>
          ) : (
            <Carousel
              lang={lang}
              items={filteredCompanies.map((c: any) => (
                <CompanyCard key={c.id} c={c} />
              ))}
            />
          )}
        </div>
      </section>

      <section
        id="testimonios"
        className="relative overflow-hidden border-y border-white/[0.07] bg-[#f1efe7] py-24 text-[#11130f] sm:py-28"
      >
        <div className="testimonial-lines absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-[1120px] px-5 text-center lg:px-8">
          <p className="text-[10px] font-extrabold tracking-[.18em] text-black/45">
            {tr("testimonials_eyebrow", lang)}
          </p>
          <div className="mx-auto mt-8 grid size-12 place-items-center rounded-full bg-[var(--color-gold)]">
            <Icon size={22}>
              <path
                d="M7 11h3v7H4v-7c0-3.5 1.4-5.7 4.2-7M17 11h3v7h-6v-7c0-3.5 1.4-5.7 4.2-7"
                fill="currentColor"
              />
            </Icon>
          </div>
          <blockquote className="mx-auto mt-8 max-w-[900px] text-[30px] font-extrabold leading-[1.15] tracking-[-.045em] sm:text-[44px] lg:text-[52px]">
            {tr("testimonials_quote", lang)}
          </blockquote>
          <div className="mt-9 flex items-center justify-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-[#171916] text-xs font-black text-[var(--color-gold)]">
              JM
            </span>
            <div className="text-left">
              <b className="block text-sm">
                {tr("testimonials_winner_name", lang)}
              </b>
              <span className="text-[11px] text-black/45">
                {tr("testimonials_winner_info", lang)}
              </span>
            </div>
          </div>
          <div className="mt-12 flex justify-center gap-2">
            <span className="h-1.5 w-8 rounded-full bg-[#151713]" />
            <span className="size-1.5 rounded-full bg-black/20" />
            <span className="size-1.5 rounded-full bg-black/20" />
          </div>
        </div>
      </section>

      <section id="preguntas" className="py-24 sm:py-32">
        <div className="mx-auto grid max-w-[1120px] gap-14 px-5 lg:grid-cols-[.72fr_1.28fr] lg:px-8">
          <div>
            <p className="eyebrow">{tr("faq_eyebrow", lang)}</p>
            <h2 className="section-title mt-5">{tr("faq_title", lang)}</h2>
            <p className="mt-5 max-w-[350px] text-sm leading-6 text-white/45">
              {tr("faq_subtitle", lang)}
            </p>
            <a
              className="mt-8 inline-flex items-center gap-2 text-xs font-extrabold text-[var(--color-gold)]"
              href="mailto:soporte@rifaspro.com"
            >
              {tr("faq_contact_support", lang)} <Arrow />
            </a>
          </div>
          <div>
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div className="border-b border-white/10" key={faq.question}>
                  <button
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-5 py-6 text-left"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  >
                    <span className="text-base font-bold sm:text-lg">
                      {faq.question}
                    </span>
                    <span
                      className={`grid size-9 shrink-0 place-items-center rounded-full border transition ${isOpen ? "rotate-45 border-[var(--color-gold)] bg-[var(--color-gold)] text-[#10120f]" : "border-white/15"}`}
                    >
                      <Icon size={16}>
                        <path
                          d="M12 5v14M5 12h14"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeWidth="1.8"
                        />
                      </Icon>
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[650px] text-sm leading-6 text-white/45">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 pb-6 lg:px-8">
        <div className="relative mx-auto max-w-[1240px] overflow-hidden rounded-[28px] bg-[var(--color-gold)] px-6 py-16 text-[#10120f] sm:px-12 sm:py-20">
          <div className="cta-rings absolute -right-36 -top-52 size-[580px] rounded-full" />
          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <p className="text-[10px] font-extrabold tracking-[.17em] text-black/45">
                {tr("cta_eyebrow", lang)}
              </p>
              <h2 className="mt-4 max-w-[700px] text-[39px] font-extrabold leading-[1] tracking-[-.055em] sm:text-[58px]">
                {tr("cta_title", lang)}
              </h2>
            </div>
            <a
              className="flex shrink-0 items-center gap-3 rounded-full bg-[#11130f] px-7 py-4 text-xs font-extrabold text-white transition hover:-translate-y-1"
              href="#empresas"
            >
              {tr("cta_button", lang)} <Arrow />
            </a>
          </div>
        </div>
      </section>

      <footer className="pt-16">
        <div className="mx-auto grid max-w-[1240px] gap-12 px-5 pb-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_.7fr_.7fr_1fr] lg:px-8">
          <div>
            <Logo />
            <p className="mt-5 max-w-[300px] text-xs leading-5 text-white/38">
              {tr("footer_tagline", lang)}
            </p>
          </div>
          <div>
            <h3 className="footer-title">{tr("footer_explore", lang)}</h3>
            <a className="footer-link" href="#nosotros">
              {tr("footer_about", lang)}
            </a>
            <a className="footer-link" href="#empresas">
              {tr("footer_companies", lang)}
            </a>
            <a className="footer-link" href="#testimonios">
              {tr("footer_winners", lang)}
            </a>
          </div>
          <div>
            <h3 className="footer-title">{tr("footer_help", lang)}</h3>
            <a className="footer-link" href="#preguntas">
              {tr("footer_faq", lang)}
            </a>
            <a className="footer-link" href="mailto:soporte@rifaspro.com">
              {tr("footer_contact", lang)}
            </a>
            <a className="footer-link" href="/">
              {tr("footer_privacy", lang)}
            </a>
          </div>
          <div>
            <h3 className="footer-title">
              {tr("footer_organizers_title", lang)}
            </h3>
            <p className="mt-4 text-xs leading-5 text-white/38">
              {tr("footer_organizers_desc", lang)}
            </p>
            <a
              className="mt-5 inline-flex items-center gap-2 text-[11px] font-extrabold text-[var(--color-gold)]"
              href="mailto:ventas@rifaspro.com"
            >
              {tr("footer_platform_cta", lang)} <Arrow />
            </a>
          </div>
        </div>
        <div className="border-t border-white/[0.07]">
          <div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-3 px-5 py-6 text-[9px] font-semibold tracking-[.08em] text-white/25 sm:flex-row lg:px-8">
            <p>{tr("footer_copyright", lang)}</p>
            <p>{tr("footer_disclaimer", lang)}</p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;
