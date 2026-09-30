import axios from "axios";

import { appConfig } from "../config";

const { baseURL } = appConfig;

const token = localStorage.getItem('accessToken');

const config: Object = {
  headers: {
    'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${token}`,
  }
};

export const GetCompanyPayments = async (idCompany: number): Promise<any> => {
  try {
    const { data } = await axios.get<any>(`${baseURL}/company/${idCompany}/payments`);

    return data;
  } catch (error: any) {
    console.error(`Error al obtener las empresas: `, error.response.data);

    return error.response.data;
  }
}

export const SetCompanyPayment = async(idCompany: number, dataSend: any): Promise<any> => {
  try {
    const { data } = await axios.post<any>(`${baseURL}/company/${idCompany}/payments`, dataSend, config);

    return data;
  } catch (error: any) {
    console.error(`Error al crear la empresa: `, error.response.data);

    return error.response.data;
  }
}


export const GetCompanyHistory = async (idCompany: number): Promise<any> => {
  try {
    const { data } = await axios.get<any>(`${baseURL}/company/${idCompany}/payment-history`);

    return data;
  } catch (error: any) {
    console.error(`Error al obtener el historial de pagos de la empresa: `, error.response.data);

    return error.response.data;
  }
}
