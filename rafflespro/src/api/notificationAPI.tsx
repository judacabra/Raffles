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

export const GetNotifications = async(idCompany: number): Promise<any> => {
  try {
    const { data } = await axios.get(`${baseURL}/notifications/all/${idCompany}`);

    return data;
  } catch (error: any) {
    console.error(`Error al obtener las notificaciones de la empresa id #${idCompany}: `, error.response.data);

    return error.response.data;
  }
}