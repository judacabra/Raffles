import axios from "axios";

import { store } from "../store";

import { appConfig } from "../config";

const { baseURL } = appConfig;

const getAuthConfig = (files: boolean = false): any => {
  const token: string | null = store.getState().auth.accessToken;

  return {
    headers: {
      "Content-Type": files ? "multipart/form-data" : "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
};

export const GetCompanies = async (): Promise<any> => {
  try {
    const { data } = await axios.get<any>(`${baseURL}/company`, getAuthConfig(true));

    return data;
  } catch (error: any) {
    console.error(`Error al obtener las empresas: `, error);

    return error;
  }
};

export const DeleteCompany = async (id: number): Promise<any> => {
  try {
    const { data } = await axios.delete<any>(`${baseURL}/company/${id}`, getAuthConfig());

    return data;
  } catch (error: any) {
    console.error(`Error al eliminar la empresa de id #${id}: `, error);

    return error;
  }
};

export const SetCompany = async(dataSend: any): Promise<any> => {
  try {
    const { data } = await axios.post<any>(`${baseURL}/company`, dataSend, getAuthConfig(true));

    return data;
  } catch (error: any) {
    console.error(`Error al crear la empresa: `, error);

    return error;
  }
};

export const PutCompany = async(id: number, dataSend: any): Promise<any> => {
  try {
    const { data } = await axios.put<any>(`${baseURL}/company/${id}`, dataSend, getAuthConfig(true));

    return data;
  } catch (error: any) {
    console.error(`Error al editar la empresa: `, error);

    return error;
  }
};

export const PutCompanyStatus = async(id: number, status: boolean): Promise<any> => {
  try {
    const { data } = await axios.put(`${baseURL}/company/status/${id}`, { status }, getAuthConfig());

    return data;
  } catch (error: any) {
    console.error(`Error al editar la empresa: `, error);

    return error;
  }
};
