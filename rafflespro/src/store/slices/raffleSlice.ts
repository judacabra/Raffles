import { GetRaffles } from "../../api/raffleAPI";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useEffect } from "react";

export type NumberStatus = "available" | "reserved" | "sold" | "winner";

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
  image?: string;
  status: "draft" | "active" | "closed" | "completed";
  winnerNumber?: number;
  winnerName?: string;
  theme: "default" | "christmas" | "sports" | "lottery";
  fontFamily: string;
  bgColor: string;
  numColor: string;
  numbers: RaffleNumber[];
  createdAt: string;
}

interface RaffleState {
  raffles: Raffle[];
  activeRaffle: Raffle | null;
  editorStep: number;
  editorDraft: Partial<Raffle>;
}

function makeNumbers(total: number): RaffleNumber[] {
  const nums: RaffleNumber[] = [];
  const statuses: NumberStatus[] = ["available", "available", "available", "sold", "reserved"];
  for (let i = 0; i < total; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    nums.push({
      num: i,
      status,
      buyer: status !== "available" ? ["Ana García", "Luis Torres", "María López", "Pedro Ruiz"][i % 4] : undefined,
      phone: status !== "available" ? `+57 300 ${String(Math.floor(Math.random() * 9000000) + 1000000)}` : undefined,
    });
  }
  return nums;
}

const MOCK_RAFFLES: Raffle[] = [
  {
    id: "r1", name: "Gran Rifa Navideña 2024",
    description: "Participa y gana increíbles premios este diciembre",
    drawDate: "2024-12-31T20:00:00",
    totalNumbers: 100, digits: 2, pricePerNumber: 10000,
    status: "active", theme: "christmas", fontFamily: "Inter",
    bgColor: "#1A365D", numColor: "#FFFFFF",
    numbers: makeNumbers(100), createdAt: "2024-11-01",
    image: "https://images.unsplash.com/photo-1545048702-79362596cdc9?w=800&h=400&fit=crop&auto=format",
  },
  {
    id: "r2", name: "Rifa del Auto del Año",
    description: "Un Mazda CX-5 2024 para el ganador",
    drawDate: "2026-09-24T23:00:00",
    totalNumbers: 1000, digits: 3, pricePerNumber: 50000,
    status: "active", theme: "default", fontFamily: "Poppins",
    bgColor: "#2D3748", numColor: "#F6AD55",
    numbers: makeNumbers(1000), createdAt: "2024-10-15",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=400&fit=crop&auto=format",
  },
  {
    id: "r3", name: "Rifa Solidaria Pro Niños",
    description: "Apoya a los niños más vulnerables",
    drawDate: "2024-11-15T18:00:00",
    totalNumbers: 500, digits: 3, pricePerNumber: 5000,
    status: "completed", winnerNumber: 247, winnerName: "Jorge Martínez",
    theme: "default", fontFamily: "Inter", bgColor: "#276749", numColor: "#FFFFFF",
    numbers: makeNumbers(500), createdAt: "2024-09-01",
  },
];

const initialState: RaffleState = {
  raffles: MOCK_RAFFLES,
  activeRaffle: null,
  editorStep: 0,
  editorDraft: {
    theme: "default", fontFamily: "Inter",
    bgColor: "#1A365D", numColor: "#FFFFFF",
    totalNumbers: 100, digits: 2,
  },
};

const raffleSlice = createSlice({
  name: "raffle",
  initialState,
  reducers: {
    setActiveRaffle(state, action: PayloadAction<string>) {
      state.activeRaffle = state.raffles.find((r) => r.id === action.payload) ?? null;
    },
    updateNumberStatus(state, action: PayloadAction<{ raffleId: string; num: number; status: NumberStatus; buyer?: string; phone?: string }>) {
      const raffle = state.raffles.find((r) => r.id === action.payload.raffleId);
      if (raffle) {
        const n = raffle.numbers.find((n) => n.num === action.payload.num);
        if (n) {
          n.status = action.payload.status;
          n.buyer = action.payload.buyer;
          n.phone = action.payload.phone;
          n.soldAt = new Date().toISOString();
        }
        if (state.activeRaffle?.id === action.payload.raffleId) {
          state.activeRaffle = { ...raffle };
        }
      }
    },
    setEditorStep(state, action: PayloadAction<number>) {
      state.editorStep = action.payload;
    },
    updateEditorDraft(state, action: PayloadAction<Partial<Raffle>>) {
      state.editorDraft = { ...state.editorDraft, ...action.payload };
    },
    saveRaffle(state, action: PayloadAction<Raffle>) {
      const idx = state.raffles.findIndex((r) => r.id === action.payload.id);
      if (idx >= 0) {
        state.raffles[idx] = action.payload;
      } else {
        state.raffles.unshift(action.payload);
      }
      state.editorDraft = {};
      state.editorStep = 0;
    },
  },
});

export const { setActiveRaffle, updateNumberStatus, setEditorStep, updateEditorDraft, saveRaffle } = raffleSlice.actions;
export default raffleSlice.reducer;
