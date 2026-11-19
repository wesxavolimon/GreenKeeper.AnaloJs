import { TestBed } from '@angular/core/testing';
import {
  AdjustHumidifierUseCase,
  AppConfigPort,
  CheckAuthUseCase,
  CompletePlantTaskUseCase,
  EvaluateDeviceAccessUseCase,
  LoadDashboardUseCase,
  LoginUseCase,
  LogoutUseCase,
  RegisterPwaUseCase,
  SelectRoomUseCase,
  ToggleFocusFavoriteUseCase,
  TriggerPlannedFeatureNoticeUseCase,
} from '@application/index';
import { Auth0Adapter } from '@infrastructure/index';
import {
  APP_CONFIG_PORT,
  AUTH_PORT,
  DASHBOARD_REPOSITORY_PORT,
  DEVICE_SIGNALS_PORT,
  provideGreenKeeperDependencies,
  PWA_REGISTRATION_PORT,
} from './index';

describe('Composition Root', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...provideGreenKeeperDependencies()],
    });
  });

  it('wires all ports and use cases via Angular DI', async () => {
    expect(TestBed.inject(APP_CONFIG_PORT).getConfig().appEnv).toBeDefined();
    expect(TestBed.inject(DEVICE_SIGNALS_PORT).readSignals()).toBeDefined();
    expect(TestBed.inject(DASHBOARD_REPOSITORY_PORT).getSnapshot()).toBeDefined();
    await expect(
      TestBed.inject(PWA_REGISTRATION_PORT).registerServiceWorker(),
    ).resolves.toBe(false);

    expect(TestBed.inject(EvaluateDeviceAccessUseCase).execute()).toBeDefined();
    expect(TestBed.inject(LoadDashboardUseCase).execute().humidityPercent).toBe(64);
    expect(TestBed.inject(SelectRoomUseCase).execute('corredor').activeRoomId).toBe(
      'corredor',
    );
    expect(
      TestBed.inject(CompletePlantTaskUseCase).execute('banheiro').rooms.find(
        (r) => r.id === 'banheiro',
      )?.pendingWatering,
    ).toBe(false);
    expect(
      TestBed.inject(ToggleFocusFavoriteUseCase).execute().focusPlant.isFavorite,
    ).toBe(true);
    expect(
      TestBed.inject(AdjustHumidifierUseCase).execute(1).humidityPercent,
    ).toBe(65);
    expect(
      TestBed.inject(TriggerPlannedFeatureNoticeUseCase).execute('Notificações')
        .lastNotice,
    ).toContain('Notificações');
    await expect(TestBed.inject(RegisterPwaUseCase).execute()).resolves.toBe(
      false,
    );

    expect(TestBed.inject(AUTH_PORT)).toBeDefined();
    expect(TestBed.inject(LoginUseCase)).toBeDefined();
    expect(TestBed.inject(LogoutUseCase)).toBeDefined();
    expect(TestBed.inject(CheckAuthUseCase)).toBeDefined();
  });
});
