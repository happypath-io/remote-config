import { Loader, Config } from '../types';

export default ({ customConfig }: { customConfig: Config }): Loader => {
  return () => Promise.resolve(customConfig);
};
