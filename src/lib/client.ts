import axios from 'axios';

interface Response {
  data?: Record<string, unknown>;
}

export interface InitArgs {
  apiKey: string;
  refreshIntervalSeconds?: number;
  host?: string;
  logger?: (args: any) => void;
  fetcher?: (url: string) => Promise<Response>;
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
    const {
      host = 'https://storage.googleapis.com/happypath-public',
      refreshIntervalSeconds = 30,
      apiKey,
      logger = console.log,
      fetcher = axios.get,
    } = opts;
    if (!apiKey) {
      throw new Error('Missing API key');
    }
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
    return value;
  }

  getConfig(): Config {
    return this.config;
  }

  private validateInit(): void {
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
