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
  } catch (err: any) {
    console.error(err.response?.data?.message, err);

    return { 
      error: true, 
      message: err.response?.data?.message, 
    };
  }
};

export const FirstLogin = async(dataSend: any): Promise<any> => {
  try {
    const { data } = await axios.post(`${baseURL}/auth/first-login`, dataSend, getAuthConfig());
    return data;
  } catch (err: any) {
    console.error(err.response?.data?.message, err);
    
    return { 
      error: true, 
      message: err.response?.data?.message, 
    };
  }
};