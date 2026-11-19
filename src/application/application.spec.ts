import {
  AdjustHumidifierUseCase,
  CompletePlantTaskUseCase,
  EvaluateDeviceAccessUseCase,
  LoadDashboardUseCase,
  RegisterPwaUseCase,
  SelectRoomUseCase,
  ToggleFocusFavoriteUseCase,
  TriggerPlannedFeatureNoticeUseCase,
} from './index';
import { InMemoryDashboardRepository } from '@infrastructure/in-memory-dashboard.repository';

describe('Application Use Cases', () => {
  it('evaluates device access using ports', () => {
    const useCase = new EvaluateDeviceAccessUseCase(
      {
        readSignals: () => ({
          userAgent: 'iPhone',
          userAgentDataMobile: true,
          coarsePointer: true,
          maxTouchPoints: 5,
          viewportWidth: 390,
          devOverrideRequested: false,
        }),
      },
      {
        getConfig: () => ({
          appEnv: 'production',
          supabaseUrl: '',
          supabaseAnonKey: '',
          auth0Domain: '',
          auth0ClientId: '',
        }),
      },
    );

    expect(useCase.execute()).toEqual({
      allowed: true,
      reason: 'mobile-device',
    });
  });

  it('loads and mutates dashboard state through repository port', () => {
    const repo = new InMemoryDashboardRepository();
    const load = new LoadDashboardUseCase(repo);
    const selectRoom = new SelectRoomUseCase(repo);
    const completeTask = new CompletePlantTaskUseCase(repo);
    const toggleFav = new ToggleFocusFavoriteUseCase(repo);
    const adjustHumidifier = new AdjustHumidifierUseCase(repo);
    const triggerNotice = new TriggerPlannedFeatureNoticeUseCase(repo);

    expect(load.execute().activeRoomId).toBe('banheiro');

    expect(selectRoom.execute('non-existent').activeRoomId).toBe('banheiro');
    expect(selectRoom.execute('corredor').activeRoomId).toBe('corredor');

    const afterComplete = completeTask.execute('banheiro');
    expect(
      afterComplete.rooms.find((r) => r.id === 'banheiro')?.pendingWatering,
    ).toBe(false);

    expect(toggleFav.execute().focusPlant.isFavorite).toBe(true);
    expect(adjustHumidifier.execute(6).humidityPercent).toBe(70);
    expect(triggerNotice.execute('Câmera').lastNotice).toContain('Câmera');
  });

  it('delegates PWA registration to port', async () => {
    const registerOk = new RegisterPwaUseCase({
      registerServiceWorker: async () => true,
    });
    await expect(registerOk.execute()).resolves.toBe(true);
  });
});
