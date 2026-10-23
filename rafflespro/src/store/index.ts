// store/index.ts
import { persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, } from "redux-persist";
import { configureStore } from "@reduxjs/toolkit";

import uiReducer from "./slices/uiSlice";
import raffleReducer from "./slices/raffleSlice";
import { persistedAuthReducer } from "./persist";


export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: persistedAuthReducer, 
    raffle: raffleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;