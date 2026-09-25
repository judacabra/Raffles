import axios from "axios";

import { appConfig } from "src/config";

const { baseURL } = appConfig;

const config: Object = {
  headers: {
    'Content-Type': 'application/json',
  }
};

export const Roles = async (idCompany: number): Promise<any> => {
  try {
    const { data } = await axios.get<any>(`${baseURL}/roles/${idCompany}/all`);

    return data;
  } catch (error: any) {
    console.error(`Error al obtener los roles: `, error.response.data);

    return error.response.data;
  }
}

export const RolesForAdmin = async (): Promise<any> => {
  try {
    const { data } = await axios.get<any>(`${baseURL}/roles/forAdmin`);

    return data;
  } catch (error: any) {
    console.error(`Error al obtener los roles para admin: `, error.response.data);

    return error.response.data;
  }
}

export const deleteRole = async (id: number): Promise<any> => {
  try {
    const { data } = await axios.delete<any>(`${baseURL}/roles/${id}`);

    return data;
  } catch (error: any) {
    console.error(`Error al eliminar el rol de id #${id}: `, error.response.data);

    return error.response.data;
  }
}

export const CreateRole = async(dataSend: any): Promise<any> => {
  try {
    const { data } = await axios.post<any>(`${baseURL}/roles`, dataSend, config);

    return data;
  } catch (error: any) {
    console.error(`Error al crear el rol: `, error.response.data);

    return error.response.data;
  }
}

export const UpdateRole = async(id: number, dataSend: any): Promise<any> => {
  try {
    const { data } = await axios.put<any>(`${baseURL}/roles/${id}`, dataSend, config);

    return data;
  } catch (error: any) {
    console.error(`Error al editar el rol: `, error.response.data);

    return error.response.data;
  }
}