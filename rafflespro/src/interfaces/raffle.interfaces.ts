import { NumberStatus } from "@/types/raffle.types";

export interface RaffleNumber {
  num: number;
  status: NumberStatus;
  buyer?: string;
  phone?: string;
  soldAt?: string;
}

export interface Raffle {
  id: string;
  name: string;
  description: string;
  drawDate: string;
  totalNumbers: number;
  digits: number;
  pricePerNumber: number;
  status: "draft" | "active" | "closed" | "completed";
  winnerNumber?: number;
  winnerName?: string;
  theme: "default" | "christmas" | "sports" | "lottery";
  fontFamily: string;
  bgColor: string;
  numColor: string;
  numbers: RaffleNumber[];
  createdAt?: string;
  image?: string;
  hourAt?: string;
  companyId?: number;
}

export interface RaffleState {
  raffles: Raffle[];
  activeRaffle: Raffle | null;
  editorStep: number;
  editorDraft: Partial<Raffle>;
}