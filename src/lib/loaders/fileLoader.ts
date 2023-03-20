import { RemoteConfigError } from '../errors';
import type { Loader } from '../types';

export default ({ filePath }: { filePath: string }): Loader => {
  return () => {
    const data = require(filePath);
    if (!data) {
      throw new RemoteConfigError(`Not valid JSON: ${filePath}`);
    }
    return data;
  };
};
