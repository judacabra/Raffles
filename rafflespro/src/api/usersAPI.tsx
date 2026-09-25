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

export const SetUser = async(dataSend: any): Promise<any> => {
  try {
    const { data } = await axios.post(`${baseURL}/users`, dataSend);

    return data;
  } catch (error: any) {
    console.error(`Error al guardar el usuario: `, error.response.data);

    return error.response.data;
  }
}

export const GetUsers = async(): Promise<any> => {
  try {
    const { data } = await axios.get(`${baseURL}/users`);

    return data;
  } catch (error: any) {
    console.error(`Error al obtener los usuarios: `, error.response.data);

    return error.response.data;
  }
}

export const GetUserById = async(id: string): Promise<any> => {
  try {
    const { data } = await axios.get(`${baseURL}/users/${id}`, config);

    return data;
  } catch (error: any) {
    console.error(`Error al obtener el usuario de id #${id}: `, error.response.data);

    return error.response.data;
  }
}

export const PutUser = async(id: number, dataSend: any): Promise<any> => {
  try {
    const { data } = await axios.put(`${baseURL}/users/${id}`, dataSend);

    return data;
  } catch (error: any) {
    console.error(`Error al actualizar el usuario de id #${id}: `, error.response.data);

    return error.response.data;
  }
}

export const PutUserStatus = async(id: number, status: boolean): Promise<any> => {
  try {
    const { data } = await axios.put(`${baseURL}/users/status/${id}`, { status });

    return data;
  } catch (error: any) {
    console.error(`Error al actualizar el estado del usuario de id #${id}: `, error.response.data);

    return error.response.data;
  }
}

export const DeleteUser = async(id: number): Promise<any> => {
  try {
    const { data } = await axios.delete(`${baseURL}/users/${id}`);

    return data;
  } catch (error: any) {
    console.error(`Error al eliminar el usuario de id #${id}: `, error.response.data);

    return error.response.data;
  }
}