import { Container, Service, Token } from 'typedi';

@Service()
export class ConfigService {
  getUnpackedDir = () => this.get('UNPACKED_DIR');
  getEnableServiceWorker = () => this.getBool('ENABLE_SERVICE_WORKER');
  getAnalyticsCode = () => this.get('POSTHOG_ANALYTICS_CODE');

  //
  packageVersion = () => this.get('npm_package_version');

  get(property: string, defaultValue?: string): string {
    const value = process?.env?.[property];
    if (defaultValue != null) {
      return value ?? defaultValue;
    }
    return value ?? '';
  }
  getBool = (property: string, defaultValue?: string) =>
    this.get(property, defaultValue).toLowerCase() == 'true';
  getNumber = (property: string, defaultValue?: number) =>
    Number(this.get(property, defaultValue?.toString?.()));
}

export const BOT_PATH = new Token<string>('BOT_PATH');
export const getBotPath = () => Container.get(BOT_PATH);

export const getConfig = () => Container.get(ConfigService);
