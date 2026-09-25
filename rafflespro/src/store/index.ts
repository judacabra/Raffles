import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./slices/uiSlice";
import authReducer from "./slices/authSlice";
import raffleReducer from "./slices/raffleSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    raffle: raffleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
