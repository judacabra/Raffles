import { ConfigEnvironment } from "../interfaces/config.interfaces";

const configDev: ConfigEnvironment = {
  baseURL: 'http://localhost:3000/api',
  uploadsFolder: 'http://localhost:3000',
  apiIP: 'https://v4.ident.me/json',  
  printURL: 'http://127.0.0.1:9021/playtech/print',
};

export default configDev;
