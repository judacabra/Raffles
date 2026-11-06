import { ConfigEnvironmentType, } from '../types/config.types';
import { EnvironmentEnum } from '../enums/config.enums';

import configDev from './config.dev';
import configProd from './config.prod';

const environment: ConfigEnvironmentType = import.meta.env.VITE_ENVIRONMENT;

export const appConfig =
  environment === EnvironmentEnum.DEV
    ? {...configDev}
    : {...configProd};
