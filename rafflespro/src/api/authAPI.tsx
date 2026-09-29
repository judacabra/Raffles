import axios from "axios";

import { appConfig } from "../config";

const { baseURL } = appConfig;

const config: Object = {
  headers: {
    'Content-Type': 'application/json',
  }
};

export const Auth = async(dataSend: any): Promise<any> => {
  try {
    const { data } = await axios.post(`${baseURL}/auth/signin`, dataSend, config);

    return data;
  } catch (error: any) {
    if (error.response) {
      console.error(`Error del servidor:`, error.response.data);
      return error.response.data;
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