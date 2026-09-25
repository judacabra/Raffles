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
    const { data } = await axios.post<any>(`${baseURL}/roles`, dataSend, config);

    return data;
  } catch (error: any) {
    console.error(`Error al crear la rifa: `, error.response.data);

    return error.response.data;
  }
}

export const PutRaffle = async(id: number, dataSend: any): Promise<any> => {
  try {
    const { data } = await axios.put<any>(`${baseURL}/roles/${id}`, dataSend, config);

    return data;
  } catch (error: any) {
    console.error(`Error al editar la rifa: `, error.response.data);

    return error.response.data;
  }
}

export const DeleteRaffle = async (id: number): Promise<any> => {
  try {
    const { data } = await axios.delete<any>(`${baseURL}/roles/${id}`);

    return data;
  } catch (error: any) {
    console.error(`Error al eliminar la rifa de id #${id}: `, error.response.data);

    return error.response.data;
  }
}