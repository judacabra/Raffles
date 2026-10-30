export const truncarText = (text: string, maxCaracteres: number, widthSuspensivePoints: boolean = false): string => {
  if (text.length <= maxCaracteres) return text;
  return `${text.substring(0, maxCaracteres)}${widthSuspensivePoints ? '...' : ''}`;
}

export const firstLetterUppercase = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};