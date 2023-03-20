import { Fetcher, Loader } from '../types';

export default ({
  remoteUrl,
  fetcher,
}: {
  remoteUrl: string;
  fetcher: Fetcher;
}): Loader => {
  return async () => {
    const data = await fetcher(remoteUrl);
    return data;
  };
};
