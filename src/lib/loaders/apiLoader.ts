import { Fetcher, Loader } from '../types';
import { RemoteConfigError } from '../errors';

export default ({
  apiKey,
  host,
  fetcher,
}: {
  apiKey: string;
  host: string;
  fetcher: Fetcher;
}): Loader => {
  return async () => {
    if (!apiKey) {
      throw new RemoteConfigError(
        `No API key found. Please go to happypath.io to create one.`
      );
    }
    const data = await fetcher(`${host}/configs/${apiKey}/config.json`);
    return data;
  };
};
