import { AppConfig, AppConfigPort } from '@application/index';
import { AppEnvironment } from '@domain/index';

export interface RawEnvSource {
  readonly VITE_APP_ENV?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_AUTH0_DOMAIN?: string;
  readonly VITE_AUTH0_CLIENT_ID?: string;
}

export function normalizeAppEnv(raw?: string): AppEnvironment {
  if (raw === 'production' || raw === 'test') {
    return raw;
  }
  return 'development';
}

export class ViteEnvConfigAdapter implements AppConfigPort {
  constructor(
    private readonly rawEnv: RawEnvSource = import.meta.env as RawEnvSource,
  ) {}

  getConfig(): AppConfig {
    return {
      appEnv: normalizeAppEnv(this.rawEnv.VITE_APP_ENV),
      supabaseUrl: this.rawEnv.VITE_SUPABASE_URL ?? '',
      supabaseAnonKey: this.rawEnv.VITE_SUPABASE_ANON_KEY ?? '',
      auth0Domain: this.rawEnv.VITE_AUTH0_DOMAIN ?? '',
      auth0ClientId: this.rawEnv.VITE_AUTH0_CLIENT_ID ?? '',
    };
  }
}
