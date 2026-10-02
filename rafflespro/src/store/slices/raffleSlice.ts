import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { NumberStatus } from "@/types/raffle.types";
import { Raffle, RaffleState } from "@/interfaces/raffle.interfaces";

const initialState: RaffleState = {
  raffles: [],
  activeRaffle: null,
  editorStep: 0,
  editorDraft: {
    theme: "default", fontFamily: "Inter",
    bgColor: "#1A365D",
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

export const { setActiveRaffle, updateNumberStatus, updateEditorDraft, saveRaffle } = raffleSlice.actions;
export default raffleSlice.reducer;
