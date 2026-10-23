import { persistReducer } from "redux-persist";
import { encryptTransform } from "@shanie1331/redux-persist-transform-encrypt";

import authReducer from "./slices/authSlice";

const storage = {
  getItem: (key: string) => Promise.resolve(window.localStorage.getItem(key)),
  setItem: (key: string, value: string) => Promise.resolve(window.localStorage.setItem(key, value)),
  removeItem: (key: string) => Promise.resolve(window.localStorage.removeItem(key)),
};

const persistConfig = {
  key: "auth",
  storage,
  transforms: [
    encryptTransform({
      secretKey: import.meta.env.VITE_PERSIST_SECRET,
      onError: (err) => {
        console.error("Error encriptando el estado persistido:", err);
        localStorage.removeItem("persist:auth");
      },
    }),
  ],
};

export const persistedAuthReducer = persistReducer(persistConfig, authReducer);