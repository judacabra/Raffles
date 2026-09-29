export const truncarText = (text: string, maxCaracteres: number, widthSuspensivePoints: boolean = false): string => {
  if (text.length <= maxCaracteres) return text;
  return `${text.substring(0, maxCaracteres)} ${widthSuspensivePoints ? '...' : ''}`;
}