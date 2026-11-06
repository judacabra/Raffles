import axios from "axios";

import { store } from "../store";

const getAuthConfig = (files: boolean = false): any => {
  const token: string | null = store.getState().auth.accessToken;

  return {
    headers: {
      "Content-Type": files ? "multipart/form-data" : "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
};

export const GetRaffles = async (): Promise<any> => {
  try {
    const { data } = await axios.get<any>(`/api/raffle/all`, getAuthConfig(true));
    return data;
  } catch (error: any) {
    console.error(`Error al obtener las rifas: `, error.response.data);
    return error.response.data;
  }
};

export const SetRaffle = async(dataSend: any): Promise<any> => {
  try {
    const { data } = await axios.post<any>(`/api/raffle`, dataSend, getAuthConfig(true));
    return data;
  } catch (error: any) {
    console.error(`Error al crear la rifa: `, error.response.data);
    return error.response.data;
  }
};