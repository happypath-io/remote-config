import { RemoteConfigError } from './errors';
import apiLoader from './loaders/apiLoader';
import customConfigLoader from './loaders/customConfigLoader';
import fileLoader from './loaders/fileLoader';
import remoteUrlLoader from './loaders/remoteUrlLoader';
import type { Config, Fetcher, Loader } from './types';

interface LoaderArgs {
  filePath?: string;
  remoteUrl?: string;
  customConfig?: Config;
  apiKey?: string;
  host: string;
  fetcher: Fetcher;
}

export default (args: LoaderArgs): Loader => {
  const { filePath, remoteUrl, customConfig, apiKey, host, fetcher } = args;

  if (filePath) {
    return fileLoader({ filePath });
  }

  if (remoteUrl) {
    return remoteUrlLoader({ fetcher, remoteUrl });
  }

  if (customConfig) {
    return customConfigLoader({ customConfig });
  }

  if (apiKey) {
    return apiLoader({ apiKey, host, fetcher });
  }

  throw new RemoteConfigError('Client is not properly initialized.');
};
