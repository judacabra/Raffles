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

export const SetUser = async(dataSend: any): Promise<any> => {
  try {
    const { data } = await axios.post(`/api/user`, dataSend, getAuthConfig(true));
    return data;
  } catch (error: any) {
    console.error(`Error al guardar el usuario: `, error);
    return error;
  }
};

export const GetUsers = async(): Promise<any> => {
  try {
    const { data } = await axios.get(`/api/user/all`, getAuthConfig(true));

    return data;
  } catch (error: any) {
    console.error(`Error al obtener los usuarios: `, error);

    return error;
  }
};

export const PutUser = async(id: number, dataSend: any): Promise<any> => {
  try {
    const { data } = await axios.put(`/api/user/${id}`, dataSend, getAuthConfig(true));

    return data;
  } catch (error: any) {
    console.error(`Error al actualizar el usuario de id #${id}: `, error);

    return error;
  }
};

export const PutUserStatus = async(id: number, status: boolean): Promise<any> => {
  try {
    const { data } = await axios.put(`/api/user/status/${id}`, { status }, getAuthConfig());

    return data;
  } catch (error: any) {
    console.error(`Error al actualizar el estado del usuario de id #${id}: `, error);

    return error;
  }
};

export const DeleteUser = async(id: number): Promise<any> => {
  try {
    const { data } = await axios.delete(`/api/user/${id}`, getAuthConfig());

    return data;
  } catch (error: any) {
    console.error(`Error al eliminar el usuario de id #${id}: `, error);

    return error;
  }
};