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

export const GetCompanies = async (): Promise<any> => {
  try {
    const { data } = await axios.get<any>(`${baseURL}/company`);

    return data;
  } catch (error: any) {
    console.error(`Error al obtener las empresas: `, error.response.data);

    return error.response.data;
  }
}

export const DeleteCompany = async (id: number): Promise<any> => {
  try {
    const { data } = await axios.delete<any>(`${baseURL}/company/${id}`);

    return data;
  } catch (error: any) {
    console.error(`Error al eliminar la empresa de id #${id}: `, error.response.data);

    return error.response.data;
  }
}

export const SetCompany = async(dataSend: any): Promise<any> => {
  try {
    const { data } = await axios.post<any>(`${baseURL}/company`, dataSend, config);

    return data;
  } catch (error: any) {
    console.error(`Error al crear la empresa: `, error.response.data);

    return error.response.data;
  }
}

export const PutCompany = async(id: number, dataSend: any): Promise<any> => {
  try {
    const { data } = await axios.put<any>(`${baseURL}/company/${id}`, dataSend, config);

    return data;
  } catch (error: any) {
    console.error(`Error al editar la empresa: `, error.response.data);

    return error.response.data;
  }
}

export const PutCompanyStatus = async(id: number, dataSend: any): Promise<any> => {
  try {
    const { data } = await axios.put<any>(`${baseURL}/company/${id}`, dataSend, config);

    return data;
  } catch (error: any) {
    console.error(`Error al editar la empresa: `, error.response.data);

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
