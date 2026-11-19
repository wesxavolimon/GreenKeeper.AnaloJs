import { InjectionToken, Provider } from '@angular/core';
import {
  AdjustHumidifierUseCase,
  AppConfigPort,
  AuthPort,
  CheckAuthUseCase,
  CompletePlantTaskUseCase,
  DashboardRepositoryPort,
  DeviceSignalsPort,
  EvaluateDeviceAccessUseCase,
  LoadDashboardUseCase,
  LoginUseCase,
  LogoutUseCase,
  PwaRegistrationPort,
  RegisterPwaUseCase,
  SelectRoomUseCase,
  ToggleFocusFavoriteUseCase,
  TriggerPlannedFeatureNoticeUseCase,
} from '@application/index';
import {
  Auth0Adapter,
  BrowserDeviceSignalsAdapter,
  BrowserPwaRegistrationAdapter,
  InMemoryDashboardRepository,
  ViteEnvConfigAdapter,
} from '@infrastructure/index';

export const APP_CONFIG_PORT = new InjectionToken<AppConfigPort>(
  'APP_CONFIG_PORT',
);
export const DEVICE_SIGNALS_PORT = new InjectionToken<DeviceSignalsPort>(
  'DEVICE_SIGNALS_PORT',
);
export const DASHBOARD_REPOSITORY_PORT =
  new InjectionToken<DashboardRepositoryPort>('DASHBOARD_REPOSITORY_PORT');
export const PWA_REGISTRATION_PORT = new InjectionToken<PwaRegistrationPort>(
  'PWA_REGISTRATION_PORT',
);
export const AUTH_PORT = new InjectionToken<AuthPort>('AUTH_PORT');

export function provideGreenKeeperDependencies(): Provider[] {
  return [
    {
      provide: APP_CONFIG_PORT,
      useFactory: () => new ViteEnvConfigAdapter(),
    },
    {
      provide: DEVICE_SIGNALS_PORT,
      useFactory: () => new BrowserDeviceSignalsAdapter(),
    },
    {
      provide: DASHBOARD_REPOSITORY_PORT,
      useFactory: () => new InMemoryDashboardRepository(),
    },
    {
      provide: PWA_REGISTRATION_PORT,
      useFactory: () => new BrowserPwaRegistrationAdapter(),
    },
    {
      provide: EvaluateDeviceAccessUseCase,
      useFactory: (
        signals: DeviceSignalsPort,
        config: AppConfigPort,
      ) => new EvaluateDeviceAccessUseCase(signals, config),
      deps: [DEVICE_SIGNALS_PORT, APP_CONFIG_PORT],
    },
    {
      provide: LoadDashboardUseCase,
      useFactory: (repo: DashboardRepositoryPort) =>
        new LoadDashboardUseCase(repo),
      deps: [DASHBOARD_REPOSITORY_PORT],
    },
    {
      provide: SelectRoomUseCase,
      useFactory: (repo: DashboardRepositoryPort) =>
        new SelectRoomUseCase(repo),
      deps: [DASHBOARD_REPOSITORY_PORT],
    },
    {
      provide: CompletePlantTaskUseCase,
      useFactory: (repo: DashboardRepositoryPort) =>
        new CompletePlantTaskUseCase(repo),
      deps: [DASHBOARD_REPOSITORY_PORT],
    },
    {
      provide: ToggleFocusFavoriteUseCase,
      useFactory: (repo: DashboardRepositoryPort) =>
        new ToggleFocusFavoriteUseCase(repo),
      deps: [DASHBOARD_REPOSITORY_PORT],
    },
    {
      provide: AdjustHumidifierUseCase,
      useFactory: (repo: DashboardRepositoryPort) =>
        new AdjustHumidifierUseCase(repo),
      deps: [DASHBOARD_REPOSITORY_PORT],
    },
    {
      provide: TriggerPlannedFeatureNoticeUseCase,
      useFactory: (repo: DashboardRepositoryPort) =>
        new TriggerPlannedFeatureNoticeUseCase(repo),
      deps: [DASHBOARD_REPOSITORY_PORT],
    },
    {
      provide: RegisterPwaUseCase,
      useFactory: (pwa: PwaRegistrationPort) => new RegisterPwaUseCase(pwa),
      deps: [PWA_REGISTRATION_PORT],
    },
    {
      provide: AUTH_PORT,
      useFactory: (config: AppConfigPort) => new Auth0Adapter(config),
      deps: [APP_CONFIG_PORT],
    },
    {
      provide: LoginUseCase,
      useFactory: (auth: AuthPort) => new LoginUseCase(auth),
      deps: [AUTH_PORT],
    },
    {
      provide: LogoutUseCase,
      useFactory: (auth: AuthPort) => new LogoutUseCase(auth),
      deps: [AUTH_PORT],
    },
    {
      provide: CheckAuthUseCase,
      useFactory: (auth: AuthPort) => new CheckAuthUseCase(auth),
      deps: [AUTH_PORT],
    },
  ];
}
