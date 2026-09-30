import axios from "axios";

import { appConfig } from "../config";

const { baseURL } = appConfig;

const config: Object = {
  headers: {
    'Content-Type': 'application/json',
  }
};

export const GetRaffles = async (idCompany: number): Promise<any> => {
  try {
    const { data } = await axios.get<any>(`${baseURL}/raffles/${idCompany}/all`);

    return data;
  } catch (error: any) {
    console.error(`Error al obtener las rifas: `, error.response.data);

    return error.response.data;
  }
}

export const SetRaffle = async(dataSend: any): Promise<any> => {
  try {
    const { data } = await axios.post<any>(`${baseURL}/raffles`, dataSend, config);

    return data;
  } catch (error: any) {
    console.error(`Error al crear la rifa: `, error.response.data);

    return error.response.data;
  }
}