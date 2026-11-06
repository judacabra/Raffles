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

export const GetRoles = async (idCompany: number): Promise<any> => {
  try {
    const { data } = await axios.get<any>(`/api/role/all/${idCompany}`, getAuthConfig());
    return data;
  } catch (error: any) {
    console.error(`Error al obtener los roles: `, error.response.data);
    return error.response.data;
  }
};

export const DeleteRole = async (id: number): Promise<any> => {
  try {
    const { data } = await axios.delete<any>(`/api/role/${id}`, getAuthConfig());
    return data;
  } catch (error: any) {
    console.error(`Error al eliminar el rol de id #${id}: `, error.response.data);
    return error.response.data;
  }
};

export const SetRole = async(dataSend: any): Promise<any> => {
  try {
    const { data } = await axios.post<any>(`/api/role`, dataSend, getAuthConfig());
    return data;
  } catch (error: any) {
    console.error(`Error al crear el rol: `, error.response.data);
    return error.response.data;
  }
};

export const PutRole = async(id: number, dataSend: any): Promise<any> => {
  try {
    const { data } = await axios.put<any>(`/api/role/${id}`, dataSend, getAuthConfig());
    return data;
  } catch (error: any) {
    console.error(`Error al editar el rol: `, error.response.data);
    return error.response.data;
  }
};