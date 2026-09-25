import { ConfigEnvironment } from "src/interfaces/config.interfaces";

const configProd: ConfigEnvironment = {  
  baseURL: 'https://cobralo.duckdns.org/api',
  uploadsFolder: 'https://cobralo.duckdns.org/',
  apiIP: 'https://v4.ident.me/json',  
  printURL: 'http://127.0.0.1:9021/playtech/print',
};

export default configProd;
