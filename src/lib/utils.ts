import https from 'https';
import type { Config } from './types';

export function httpGet(url: string): Promise<Config> {
  return new Promise((resolve) => {
    let data = '';
    https.get(url, (res) => {
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    });
  });
}

export function isPresent(value?: unknown): boolean {
  return value !== undefined;
}

