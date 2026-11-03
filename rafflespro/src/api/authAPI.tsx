import axios from "axios";

import { appConfig } from "../config";
import { store } from "../store";

const { baseURL } = appConfig;

const getAuthConfig = (files: boolean = false): any => {
  const token: string | null = store.getState().auth.accessToken;

  return {
    headers: {
      "Content-Type": files ? "multipart/form-data" : "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
};

export const Auth = async(dataSend: any): Promise<any> => {
  try {
    const { data } = await axios.post(`${baseURL}/auth/signin`, dataSend, getAuthConfig());

    return data;
  } catch (error: any) {
    if (error.response) {
      console.error(`Error del servidor:`, error);
      return error;
    }
    
    if (error.request) {
      console.error(`Error de red: No se recibió respuesta del servidor`);
      return { 
        error: true, 
        message: 'No se pudo conectar con el servidor. Verifica tu conexión.' 
      };
    }
    console.error(`Error:`, error.message);
    return { 
      error: true, 
      message: error.message || 'Error desconocido al autenticar' 
    };
  }
}

export const FirstLogin = async(dataSend: any): Promise<any> => {
  try {
    const { data } = await axios.post(`${baseURL}/auth/first-login`, dataSend, getAuthConfig());

    return data;
  } catch (error: any) {
    if (error.response) {
      console.error(`Error del servidor:`, error);
      return error;
    }
    
    if (error.request) {
      console.error(`Error de red: No se recibió respuesta del servidor`);
      return { 
        error: true, 
        message: 'No se pudo conectar con el servidor. Verifica tu conexión.' 
      };
    }
    console.error(`Error:`, error.message);
    return { 
      error: true, 
      message: error.message || 'Error desconocido al autenticar' 
    };
  }
}