import axios from 'axios';

interface InitArgs {
  apiKey: string;
  environment: string;
  refreshIntervalSeconds?: number;
  configUrl?: string;
}

interface Config {
  [key: string]: unknown;
}

class Client {
  private config: Config;
  private apiKey?: string;
  private environment: string;
  private refreshIntervalSeconds: number;
  private configUrl: string;

  static ENVIRONMENTS = ['development', 'staging', 'production'];

  constructor() {
    this.config = {};
    this.configUrl = 'www.happypath.io/config';
    this.refreshIntervalSeconds = 30;
    this.environment = '';
  }

  async init(initArgs: InitArgs): Promise<void> {
    const { apiKey, environment, refreshIntervalSeconds, configUrl } = initArgs;
    this.apiKey = apiKey;
    this.environment = environment;
    this.configUrl = configUrl || this.configUrl;
    this.refreshIntervalSeconds = refreshIntervalSeconds || this.refreshIntervalSeconds;
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
    if (!!this.apiKey || !!Client.ENVIRONMENTS.includes(this.environment)) {
      throw new Error(
        'ClientNotInitialized: please set API key and environment via client.init'
      );
    }
  }

  private async load(): Promise<void> {
    try {
      const res = await axios.get(this.configUrl, {
        headers: {
          API_KEY: this.apiKey,
        },
        params: {
          environment: this.environment,
        },
      });
      if (res.data) {
        Object.assign(this.config, res.data);
      }
    } catch (_error) {}
  }

  private isPresent(value?: unknown): boolean {
    return value !== undefined;
  }
}

export default new Client();
