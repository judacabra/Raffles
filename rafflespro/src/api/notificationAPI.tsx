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

export const GetNotifications = async(idC: number): Promise<any> => {
  try {
    const { data } = await axios.get(`${baseURL}/notifications/all/${idC}`);

    return data;
  } catch (error: any) {
    console.error(`Error al obtener las notificaciones de la empresa id #${idC}: `, error.response.data);

    return error.response.data;
  }
}