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

export const GetNotifications = async(idUser: number): Promise<any> => {
  try {
    const { data } = await axios.get(`${baseURL}/notifications/user/${idUser}`, getAuthConfig());

    return data;
  } catch (error: any) {
    console.error(`Error al obtener las notificaciones del usuario con id #${idUser}: `, error);

    return error;
  }
};

export const PutNotification = async(id: number, dataSend: any): Promise<any> => {
  try {
    const { data } = await axios.put(`${baseURL}/notifications/${id}`, dataSend, getAuthConfig());

    return data;
  } catch (error: any) {
    console.error(`Error al actualizar la notificación de id #${id}: `, error);

    return error;
  }
};

export const DeleteNotification = async(id: number): Promise<any> => {
  try {
    const { data } = await axios.delete(`${baseURL}/notifications/${id}`, getAuthConfig());

    return data;
  } catch (error: any) {
    console.error(`Error al eliminar la notificación de id #${id}: `, error);

    return error;
  }
};