
export const extract_TIME_AGO = (t: string, f: string): string => {
  const ahora: Date = new Date();

  // Fecha: AAAA-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(f)) {
    return "Fecha inválida";
  }

  const [año, mes, dia] = f.split("-").map(Number);

  // Hora: HH:mm:ss.S
  const partes: string[] = t.split(":");
  if (partes.length !== 3) return "Hora inválida";

  const horas: number = Number(partes[0]);
  const minutos: number = Number(partes[1]);
  const segundos: number = Number(partes[2]);

  if (
    mes < 1 || mes > 12 ||
    dia < 1 || dia > 31 ||
    horas < 0 || horas > 23 ||
    minutos < 0 || minutos > 59 ||
    segundos < 0 || segundos >= 60
  ) {
    return "Fecha u hora inválida";
  }

  const fecha: Date = new Date(
    año, mes - 1, dia, horas, minutos, segundos
  );

  // Validar fechas inexistentes, como el 30 de febrero.
  if (
    fecha.getFullYear() !== año ||
    fecha.getMonth() !== mes - 1 ||
    fecha.getDate() !== dia
  ) {
    return "Fecha inválida";
  }

  const diferencia: number = ahora.getTime() - fecha.getTime();

  if (diferencia < 0) return "En el futuro";
  if (diferencia < 60_000) return "Hace pocos segundos";

  const minutosTotales: number = Math.floor(diferencia / 60_000);
  if (minutosTotales < 60) return `Hace ${minutosTotales} min`;

  const horasTotales: number = Math.floor(diferencia / 3_600_000);
  if (horasTotales < 24) {
    return `Hace ${horasTotales} ${horasTotales === 1 ? "hora" : "horas"}`;
  }

  const diasTotales: number = Math.floor(diferencia / 86_400_000);

  if (diasTotales < 7) {
    return `Hace ${diasTotales} ${diasTotales === 1 ? "día" : "días"}`;
  }

  if (diasTotales < 30) {
    const semanas: number = Math.floor(diasTotales / 7);
    const dias: number = diasTotales % 7;

    return dias > 0
      ? `Hace ${semanas} ${semanas === 1 ? "semana" : "semanas"} y ${dias} ${dias === 1 ? "día" : "días"}`
      : `Hace ${semanas} ${semanas === 1 ? "semana" : "semanas"}`;
  }

  let meses: number =
    (ahora.getFullYear() - fecha.getFullYear()) * 12 +
    ahora.getMonth() - fecha.getMonth();

  const aniversario: Date = new Date(fecha);
  aniversario.setDate(1);
  aniversario.setMonth(aniversario.getMonth() + meses);
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

  if (aniversario > ahora) meses--;

  if (meses < 12) {
    return `Hace ${meses} ${meses === 1 ? "mes" : "meses"}`;
  }

  const años: number = Math.floor(meses / 12);
  const mesesRestantes: number = meses % 12;

  return mesesRestantes > 0
    ? `Hace ${años} ${años === 1 ? "año" : "años"} y ${mesesRestantes} ${mesesRestantes === 1 ? "mes" : "meses"}`
    : `Hace ${años} ${años === 1 ? "año" : "años"}`;
};