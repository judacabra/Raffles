export const date_AAAA_MM_DD = (d: Date): string => {
  return d.toISOString().split("T")[0];
}

export const nextMounth = (): string => {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return date_AAAA_MM_DD(d);
}
