import https from 'https';
import { RemoteConfigError } from './errors';

export interface InitArgs {
  apiKey: string;
  refreshIntervalSeconds?: number;
  host?: string;
  logger?: (args: any) => void;
  fetcher?: (url: string) => Promise<Config>;
  customRemoteUrl?: string;
  customFilePath?: string;
  customConfig?: Config;
}

interface Config {
  [key: string]: unknown;
}

type Loader = () => Promise<Config | undefined>;

class Client {
  private config: Config;
  private apiKey?: string;
  private refreshIntervalSeconds: number;
  private host: string;
  private isConfigLoaded = false;
  private logger: (message: string, error: unknown) => void;
  private fetcher: (url: string) => Promise<Config>;
  private customFilePath?: string;
  private customRemoteUrl?: string;
  private customConfig?: Config;

  constructor(opts: InitArgs) {
    const {
      host = 'https://storage.googleapis.com/happypath-public',
      refreshIntervalSeconds = 30,
      apiKey,
      logger = console.log,
      fetcher = Client.httpGet,
      customConfig,
      customFilePath,
      customRemoteUrl,
    } = opts;
    this.customFilePath = customFilePath;
    this.customRemoteUrl = customRemoteUrl;
    this.customConfig = customConfig;
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
    this.validateInit();
    const value = this.config[key] as T;
    if (!this.isPresent(value) && this.isPresent(defaultValue)) {
      return defaultValue!;
    }
    if (!this.isPresent(value)) {
      throw new RemoteConfigError(`Key is not defined in config: ${key}`);
    }
    return value;
  }

  getConfig(): Config {
    return this.config;
  }

  private validateInit(): void {
    if (!this.isConfigLoaded) {
      throw new RemoteConfigError(
        'Config is not initialized. Forgot to run "await config.init()" ?'
      );
    }
  }

  getLoader(): Loader {
    if (this.customFilePath) {
      return () => {
        const data = require(this.customFilePath!);
        if (!data) {
          throw new RemoteConfigError(`Not valid JSON: ${this.customFilePath}`);
        }
        return data;
      };
    }
    if (this.customRemoteUrl) {
      return async () => {
        const data = await this.fetcher(this.customRemoteUrl!);
        return data;
      };
    }
    if (this.customConfig) {
      return () => Promise.resolve(this.customConfig);
    }
    return async () => {
      if (!this.apiKey) {
        throw new RemoteConfigError(
          `No API key found. Please go to happypath.io to create one.`
        );
      }
      const data = await this.fetcher(
        `${this.host}/configs/${this.apiKey}/config.json`
      );
      return data;
    };
  }

  private async load(): Promise<void> {
    const loader = this.getLoader();
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

  private isPresent(value?: unknown): boolean {
    return value !== undefined;
  }

  static getClient(opts: InitArgs): Client {
    return new Client(opts);
  }

  static httpGet(url: string): Promise<Config> {
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
}

export default Client.getClient;
