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

export const GetCompanyPayments = async (idCompany: number): Promise<any> => {
  try {
    const { data } = await axios.get<any>(`/api/company/${idCompany}/payments`, getAuthConfig(true));
    return data;
  } catch (error: any) {
    console.error(`Error al obtener las empresas: `, error);
    return error;
  }
};

export const SetCompanyPayment = async(idCompany: number, dataSend: any): Promise<any> => {
  try {
    const { data } = await axios.post<any>(`/api/company/${idCompany}/payments`, dataSend, getAuthConfig(true));
    return data;
  } catch (error: any) {
    console.error(`Error al crear la empresa: `, error);
    return error;
  }
};
