import { RemoteConfigError } from './errors';
import { httpGet, isPresent } from './utils';
import type { Config, Fetcher } from './types';
import getLoader from './loaderFactory';

export interface InitArgs {
  apiKey?: string;
  refreshIntervalSeconds?: number;
  host?: string;
  logger?: (args: any) => void;
  fetcher?: Fetcher;
  remoteUrl?: string;
  filePath?: string;
  config?: Config;
}

class Client {
  private config: Config;
  private apiKey?: string;
  private refreshIntervalSeconds: number;
  private host: string;
  private isConfigLoaded = false;
  private logger: (message: string, error: unknown) => void;
  private fetcher: (url: string) => Promise<Config>;
  private filePath?: string;
  private remoteUrl?: string;
  private customConfig?: Config;

  static VALID_CONFIG_OPTIONS = ['apiKey', 'filePath', 'remoteUrl', 'config'];

  constructor(opts: InitArgs) {
    const {
      host = 'https://storage.googleapis.com/happypath-public',
      refreshIntervalSeconds = 30,
      apiKey,
      logger = console.log,
      fetcher = httpGet,
      config,
      filePath,
      remoteUrl,
    } = opts;
    this.filePath = filePath;
    this.remoteUrl = remoteUrl;
    this.customConfig = config;
    this.config = {};
    this.host = host;
    this.refreshIntervalSeconds = refreshIntervalSeconds;
    this.apiKey = apiKey;
    this.logger = logger;
    this.fetcher = fetcher;
  }

  async init(): Promise<void> {
    await this.load();
    setInterval(this.load.bind(this), this.refreshIntervalSeconds * 1000);
  }

  get<T>(key: string, defaultValue?: T): T {
    const value = this.config[key] as T;
    if (!isPresent(value) && isPresent(defaultValue)) {
      return defaultValue!;
    }
    if (!isPresent(value)) {
      this.logger(`Key is not defined in config: ${key}`, undefined);
    }
    return value;
  }

  getConfig(): Config {
    return this.config;
  }

  waitUntilLoaded(): Promise<void> {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (this.isConfigLoaded) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  private async load(): Promise<void> {
    const loader = getLoader({
      filePath: this.filePath,
      remoteUrl: this.remoteUrl,
      customConfig: this.customConfig,
      apiKey: this.apiKey,
      host: this.host,
      fetcher: this.fetcher,
    });

    let data;
    try {
      data = await loader();
    } catch (error) {
      this.logger('Failed to fetch config', error);
    }
    if (!data && !this.isConfigLoaded) {
      throw new RemoteConfigError(
        `Could not fetch API config. Visit happypath.io for more details.`
      );
    }
    if (data) {
      Object.assign(this.config, data);
      this.isConfigLoaded = true;
    }
  }

  static getClient(opts: InitArgs): Client {
    if (!opts.apiKey && !opts.filePath && !opts.remoteUrl && !opts.config) {
      throw new RemoteConfigError(
        `No configuration options provided! Provide one of: ${Client.VALID_CONFIG_OPTIONS.join(
          ', '
        )}`
      );
    }
    return new Client(opts);
  }
}

export default Client.getClient;
