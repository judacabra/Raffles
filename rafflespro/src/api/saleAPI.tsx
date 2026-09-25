import axios from "axios";

import { appConfig } from "../config";

const { baseURL } = appConfig;

const config: Object = {
  headers: {
    'Content-Type': 'application/json',
  }
};

export const GetSales = async (idCompany: number): Promise<any> => {
  try {
    const { data } = await axios.get<any>(`${baseURL}/sales/${idCompany}/all`);

    return data;
  } catch (error: any) {
    console.error(`Error al obtener las ventas: `, error.response.data);

    return error.response.data;
  }
}

export const SetSale = async(dataSend: any): Promise<any> => {
  try {
    const { data } = await axios.post<any>(`${baseURL}/sales`, dataSend, config);

    return data;
  } catch (error: any) {
    console.error(`Error al guardar la venta: `, error.response.data);

    return error.response.data;
  }
}
