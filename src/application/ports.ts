import {
  AppEnvironment,
  DashboardSnapshot,
  DeviceSignals,
} from '@domain/index';

export interface AppConfig {
  readonly appEnv: AppEnvironment;
  readonly supabaseUrl: string;
  readonly supabaseAnonKey: string;
  readonly auth0Domain: string;
  readonly auth0ClientId: string;
}

export interface AppConfigPort {
  getConfig(): AppConfig;
}

export interface DeviceSignalsPort {
  readSignals(): DeviceSignals;
}

export interface DashboardRepositoryPort {
  getSnapshot(): DashboardSnapshot;
  saveSnapshot(snapshot: DashboardSnapshot): DashboardSnapshot;
}

export interface PwaRegistrationPort {
  registerServiceWorker(): Promise<boolean>;
}
