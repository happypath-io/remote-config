import axios from 'axios';

interface Response {
  data?: Record<string, unknown>;
}

export interface InitArgs {
  apiKey: string;
  refreshIntervalSeconds?: number;
  host?: string;
  logger?: (args: any) => void;
  fetcher: (url: string) => Promise<Response>;
}

interface Config {
  [key: string]: unknown;
}

class Client {
  private config: Config;
  private apiKey?: string;
  private refreshIntervalSeconds: number;
  private host: string;
  private isConfigLoaded = false;
  private logger: (message: string, error: unknown) => void;
  private fetcher: (url: string) => Promise<Response>;

  constructor(opts: InitArgs) {
    this.config = {};
    this.host = opts.host || 'www.happypath.io';
    this.refreshIntervalSeconds = opts.refreshIntervalSeconds || 30;
    this.apiKey = opts.apiKey;
    this.logger = opts.logger || console.log;
    this.fetcher = opts.fetcher || axios.get;
  }

  async init(): Promise<void> {
    await this.load();
    setInterval(this.load, this.refreshIntervalSeconds * 1000);
  }

  get<T>(key: string, defaultValue?: T): T {
    this.validateInit();
    const value = this.config[key] as T;
    if (!this.isPresent(value) && this.isPresent(defaultValue)) {
      return defaultValue!;
    }
    return value;
  }

  private validateInit(): void {
    if (!this.apiKey) {
      throw new Error('Missing API key');
    }
    if (!this.isConfigLoaded) {
      throw new Error(
        'Config is not initialized. Did you forget to run "await config.init()"?'
      );
    }
  }

  private async load(): Promise<void> {
    let response;
    try {
      response = await this.fetcher(
        `${this.host}/configs/${this.apiKey}/config.json`
      );
    } catch (error) {
      this.logger('Failed to fetch config', error);
    }
    const data = response?.data;
    if (!data && !this.isConfigLoaded) {
      throw new Error(`Invalid API key`);
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
}

export default Client.getClient;
