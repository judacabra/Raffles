import packageJson from './package.json';

import type { ConfigValue } from './src/types/config.types';

export const CONFIG: ConfigValue = {
  appName: "Rifas PRO",
  appVersion: packageJson.version,
};
