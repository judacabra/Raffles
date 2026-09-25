import { ConfigEnvironmentType } from '../types/config.types';

import configDev from './config.dev';
import configProd from './config.prod';

const environment: ConfigEnvironmentType = 'DEV' as ConfigEnvironmentType;

export const appConfig =
  environment === ('DEV' as ConfigEnvironmentType)
    ? {...configDev}
    : {...configProd};
