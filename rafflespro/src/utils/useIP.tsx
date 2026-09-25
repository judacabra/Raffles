import { IP } from "../api/ipAPI";

export const useIP = () => {
  const getIP = async (): Promise<string> => {
    try {
      const ip = await IP();

      return ip;
    } catch (error) {
      console.error("Error al obtener la IP del CPU: ", error);
      
      return '';
    }
  }

  return { getIP }
}