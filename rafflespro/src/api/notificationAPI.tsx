import axios from "axios";

import { appConfig } from "../config";

const { baseURL } = appConfig;

const token = localStorage.getItem('accessToken');

const config: Object = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }
};

export const GetNotifications = async(idUser: number): Promise<any> => {
  try {
    const { data } = await axios.get(`${baseURL}/notifications/user/${idUser}`, config);

    return data;
  } catch (error: any) {
    console.error(`Error al obtener las notificaciones del usuario con id #${idUser}: `, error.response.data);

    return error.response.data;
  }
}

export const PutNotification = async(id: number, dataSend: any): Promise<any> => {
  try {
    const { data } = await axios.put(`${baseURL}/notifications/${id}`, dataSend, config);

    return data;
  } catch (error: any) {
    console.error(`Error al actualizar la notificación de id #${id}: `, error.response.data);

    return error.response.data;
  }
}

export const DeleteNotification = async(id: number): Promise<any> => {
  try {
    const { data } = await axios.delete(`${baseURL}/notifications/${id}`, config);

    return data;
  } catch (error: any) {
    console.error(`Error al eliminar la notificación de id #${id}: `, error.response.data);

    return error.response.data;
  }
}