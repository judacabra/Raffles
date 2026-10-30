import { tr } from "../i18n/translations";
import { Language } from "../store/slices/uiSlice";

export const extract_TIME_AGO = (t: string, f: string, lang: Language): string => {
  const now: Date = new Date();

  // Date: YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(f)) {
    return tr("invalid_date", lang);
  }

  const [year, mounth, day] = f.split("-").map(Number);

  // Hour: HH:mm:ss.S
  const parts: string[] = t.split(":");
  if (parts.length !== 3) return tr("invalid_hour", lang);

  const horas: number = Number(parts[0]);
  const minutos: number = Number(parts[1]);
  const segundos: number = Number(parts[2]);

  if (
    mounth < 1 || mounth > 12 ||
    day < 1 || day > 31 ||
    horas < 0 || horas > 23 ||
    minutos < 0 || minutos > 59 ||
    segundos < 0 || segundos >= 60
  ) {
    return "Fecha u hora inválida";
  }

  const fecha: Date = new Date(
    year, mounth - 1, day, horas, minutos, segundos
  );

  // Validar fechas inexistentes, como el 30 de febrero.
  if (
    fecha.getFullYear() !== year ||
    fecha.getMonth() !== mounth - 1 ||
    fecha.getDate() !== day
  ) {
    return tr("invalid_date", lang);
  }

  const different: number = now.getTime() - fecha.getTime();

  const TOLERANCIA_MS: number = 5 * 60_000;

  if (different < -TOLERANCIA_MS) return "En el futuro";
  if (different < 0) return "Ahora mismo"; 
  if (different < 60_000) return "Hace pocos segundos";

  const totalMin: number = Math.floor(different / 60_000);
  if (totalMin < 60) return `Hace ${totalMin} min`;

  const totalHours: number = Math.floor(different / 3_600_000);
  if (totalHours < 24) {
    return `${tr("ago_a_b", lang, { a: totalHours, b: totalHours === 1 ? tr("hour", lang) : tr("hours", lang) })}`;
  }

  const daysTotales: number = Math.floor(different / 86_400_000);

  if (daysTotales < 7) {
    return `${tr("ago_a_b", lang, { a: daysTotales, b: daysTotales === 1 ? tr("day", lang) : tr("days", lang) })}`;
  }

  if (daysTotales < 30) {
    const semanas: number = Math.floor(daysTotales / 7);
    const days: number = daysTotales % 7;

    return days > 0
      ? `${tr("ago_a_b_and_c_d", lang, 
          { a: semanas, b: semanas === 1 ? tr("week", lang) : tr("weeks", lang), 
            c: days, d: days === 1 ? tr("day", lang) : tr("days", lang) 
          })}`
      : `${tr("ago_a_b", lang, { a: semanas, b: semanas === 1 ? tr("week", lang) : tr("weeks", lang), })}`;
  }

  let mounthes: number =
    (now.getFullYear() - fecha.getFullYear()) * 12 +
    now.getMonth() - fecha.getMonth();

  const aniversario: Date = new Date(fecha);
  aniversario.setDate(1);
  aniversario.setMonth(aniversario.getMonth() + mounthes);
  aniversario.setDate(
    Math.min(
      fecha.getDate(),
      new Date(
        aniversario.getFullYear(),
        aniversario.getMonth() + 1,
        0
      ).getDate()
    )
  );

  if (aniversario > now) mounthes--;

  if (mounthes < 12) {
    return `Hace ${mounthes} ${mounthes === 1 ? "mounth" : "mounthes"}`;
  }

  const years: number = Math.floor(mounthes / 12);
  const mounthesRestantes: number = mounthes % 12;

  return mounthesRestantes > 0
    ? `Hace ${years} ${years === 1 ? "year" : "years"} y ${mounthesRestantes} ${mounthesRestantes === 1 ? "mounth" : "mounthes"}`
    : `Hace ${years} ${years === 1 ? "year" : "years"}`;
};