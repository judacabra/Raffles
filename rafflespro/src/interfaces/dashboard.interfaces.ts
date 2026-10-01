export interface Time {
  days: number, 
  hours: number, 
  mins: number, 
  secs: number
}

export interface StatusColor {
    bg: string; 
    color: string;
}

export interface KPIs {
    label: string;
    value: string; 
    icon: string; 
    color: string; 
    bg: string; 
}