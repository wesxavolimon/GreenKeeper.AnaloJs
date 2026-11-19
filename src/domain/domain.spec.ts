import {
  clampHumidityLevel,
  countPendingTasks,
  DashboardSnapshot,
  DeviceSignals,
  evaluateDeviceAccess,
  getActiveRoom,
} from './index';

const sampleSnapshot: DashboardSnapshot = {
  activeRoomId: 'banheiro',
  rooms: [
    {
      id: 'corredor',
      roomName: 'Corredor',
      plantName: 'Jiboia',
      tone: 'emerald',
      metrics: { waterPercent: 60, lightPercent: 70 },
      pendingWatering: false,
    },
    {
      id: 'banheiro',
      roomName: 'Banheiro',
      plantName: 'Calathea',
      tone: 'light',
      metrics: { waterPercent: 18, lightPercent: 98 },
      pendingWatering: true,
    },
  ],
  focusPlant: {
    plantName: 'Aloe Arborescens',
    isFavorite: false,
    tasks: [
      {
        id: 't1',
        category: 'Rega',
        frequencyLabel: '1-2 vezes na semana',
        tone: 'emerald',
        completed: false,
      },
      {
        id: 't2',
        category: 'Inspeção',
        frequencyLabel: '2 vezes por mês',
        tone: 'white',
        completed: true,
      },
    ],
  },
  humidityPercent: 64,
  lastNotice: null,
};

describe('Domain Rules', () => {
  it('clamps humidity levels between 0 and 100 and rounds integers', () => {
    expect(clampHumidityLevel(-15)).toBe(0);
    expect(clampHumidityLevel(0)).toBe(0);
    expect(clampHumidityLevel(64.4)).toBe(64);
    expect(clampHumidityLevel(100)).toBe(100);
    expect(clampHumidityLevel(125)).toBe(100);
  });

  it('counts pending tasks across rooms and focus plant', () => {
    expect(countPendingTasks(sampleSnapshot)).toBe(2);
  });

  it('returns active room or falls back to the first room when id is not found', () => {
    expect(getActiveRoom(sampleSnapshot).id).toBe('banheiro');
    expect(
      getActiveRoom({ ...sampleSnapshot, activeRoomId: 'unknown' }).id,
    ).toBe('corredor');
  });

  it('allows access when userAgentData reports mobile phone', () => {
    const signals: DeviceSignals = {
      userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) Mobile',
      userAgentDataMobile: true,
      coarsePointer: true,
      maxTouchPoints: 5,
      viewportWidth: 390,
      devOverrideRequested: false,
    };
    expect(evaluateDeviceAccess(signals, 'production')).toEqual({
      allowed: true,
      reason: 'mobile-device',
    });
  });

  it('allows access when UA matches iPhone or touch phone viewport even without userAgentData', () => {
    const iphoneSignals: DeviceSignals = {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
      userAgentDataMobile: null,
      coarsePointer: false,
      maxTouchPoints: 0,
      viewportWidth: 390,
      devOverrideRequested: false,
    };
    expect(evaluateDeviceAccess(iphoneSignals, 'production')).toEqual({
      allowed: true,
      reason: 'mobile-device',
    });

    const touchViewportSignals: DeviceSignals = {
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
      userAgentDataMobile: false,
      coarsePointer: false,
      maxTouchPoints: 2,
      viewportWidth: 412,
      devOverrideRequested: false,
    };
    expect(evaluateDeviceAccess(touchViewportSignals, 'production')).toEqual({
      allowed: true,
      reason: 'mobile-device',
    });

    const coarseViewportSignals: DeviceSignals = {
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
      userAgentDataMobile: false,
      coarsePointer: true,
      maxTouchPoints: 0,
      viewportWidth: 412,
      devOverrideRequested: false,
    };
    expect(evaluateDeviceAccess(coarseViewportSignals, 'production')).toEqual({
      allowed: true,
      reason: 'mobile-device',
    });
  });

  it('blocks iPad, Android tablets, and desktop viewports in production even with devOverrideRequested', () => {
    const ipadSignals: DeviceSignals = {
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)',
      userAgentDataMobile: false,
      coarsePointer: true,
      maxTouchPoints: 5,
      viewportWidth: 820,
      devOverrideRequested: true,
    };
    expect(evaluateDeviceAccess(ipadSignals, 'production')).toEqual({
      allowed: false,
      reason: 'blocked-non-mobile',
    });

    const desktopSignals: DeviceSignals = {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      userAgentDataMobile: false,
      coarsePointer: false,
      maxTouchPoints: 0,
      viewportWidth: 1280,
      devOverrideRequested: true,
    };
    expect(evaluateDeviceAccess(desktopSignals, 'production')).toEqual({
      allowed: false,
      reason: 'blocked-non-mobile',
    });
  });

  it('allows desktop access only when appEnv is not production and devOverrideRequested is true', () => {
    const desktopOverride: DeviceSignals = {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      userAgentDataMobile: false,
      coarsePointer: false,
      maxTouchPoints: 0,
      viewportWidth: 1280,
      devOverrideRequested: true,
    };
    expect(evaluateDeviceAccess(desktopOverride, 'development')).toEqual({
      allowed: true,
      reason: 'dev-override',
    });
    expect(
      evaluateDeviceAccess(
        { ...desktopOverride, devOverrideRequested: false },
        'development',
      ),
    ).toEqual({
      allowed: false,
      reason: 'blocked-non-mobile',
    });
  });
});
