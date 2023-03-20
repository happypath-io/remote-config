export interface Config {
  [key: string]: unknown;
}

export type Loader = () => Promise<Config | undefined>;

export type Fetcher = (url: string) => Promise<Config>
