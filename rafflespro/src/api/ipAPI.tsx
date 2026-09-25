import axios from "axios";

import { appConfig } from "../config";

const { apiIP } = appConfig;

export const IP = async(): Promise<any> => {
  try {
    const { data } = await axios.get(`${apiIP}`);

    return data.ip;
  } catch (error: any) {
    console.error(`Error al obtener la IP del CPU: `, error.response.data);

    return error.response.data;
  }
}