import {
  BrowserDeviceSignalsAdapter,
  BrowserPwaRegistrationAdapter,
  InMemoryDashboardRepository,
  normalizeAppEnv,
  readDefaultBrowserDeviceSource,
  ViteEnvConfigAdapter,
} from './index';

describe('Infrastructure Adapters', () => {
  it('stores and returns snapshots in InMemoryDashboardRepository', () => {
    const repo = new InMemoryDashboardRepository();
    const initial = repo.getSnapshot();
    expect(initial.humidityPercent).toBe(64);
    const updated = repo.saveSnapshot({ ...initial, humidityPercent: 55 });
    expect(updated.humidityPercent).toBe(55);
    expect(repo.getSnapshot().humidityPercent).toBe(55);
  });

  it('normalizes and reads environment variables in ViteEnvConfigAdapter', () => {
    expect(normalizeAppEnv('production')).toBe('production');
    expect(normalizeAppEnv('test')).toBe('test');
    expect(normalizeAppEnv('development')).toBe('development');
    expect(normalizeAppEnv(undefined)).toBe('development');

    const defaultAdapter = new ViteEnvConfigAdapter();
    expect(defaultAdapter.getConfig().appEnv).toBeDefined();

    const customAdapter = new ViteEnvConfigAdapter({
      VITE_APP_ENV: 'production',
      VITE_SUPABASE_URL: 'https://example.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'anon-key',
      VITE_AUTH0_DOMAIN: 'example.us.auth0.com',
      VITE_AUTH0_CLIENT_ID: 'client-123',
    });
    expect(customAdapter.getConfig()).toEqual({
      appEnv: 'production',
      supabaseUrl: 'https://example.supabase.co',
      supabaseAnonKey: 'anon-key',
      auth0Domain: 'example.us.auth0.com',
      auth0ClientId: 'client-123',
    });
  });

  it('reads browser device signals with default and custom providers', () => {
    const defaultSignals = new BrowserDeviceSignalsAdapter().readSignals();
    expect(typeof defaultSignals.userAgent).toBe('string');

    const withMatchMedia = readDefaultBrowserDeviceSource(
      {
        innerWidth: 390,
        location: { search: '?mobilePreview=1' },
        matchMedia: () => ({ matches: true }),
      } as unknown as Window,
      {
        userAgent: 'Pixel',
        userAgentData: { mobile: true },
        maxTouchPoints: 5,
      } as unknown as Navigator,
    );
    expect(withMatchMedia.matchesCoarsePointer).toBe(true);
    expect(withMatchMedia.userAgentDataMobile).toBe(true);

    const withoutMatchMedia = readDefaultBrowserDeviceSource(
      {
        innerWidth: 1024,
        location: { search: '' },
      } as unknown as Window,
      {
        userAgent: 'Desktop',
      } as unknown as Navigator,
    );
    expect(withoutMatchMedia.matchesCoarsePointer).toBe(false);
    expect(withoutMatchMedia.maxTouchPoints).toBe(0);
    expect(withoutMatchMedia.userAgentDataMobile).toBeNull();

    const customSignals = new BrowserDeviceSignalsAdapter(() => ({
      userAgent: 'CustomUA',
      maxTouchPoints: 2,
      innerWidth: 400,
      search: '?mobilePreview=1',
      matchesCoarsePointer: true,
    })).readSignals();
    expect(customSignals.devOverrideRequested).toBe(true);
    expect(customSignals.userAgentDataMobile).toBeNull();
  });

  it('handles PWA service worker registration in all scenarios', async () => {
    const defaultPwa = new BrowserPwaRegistrationAdapter();
    await expect(defaultPwa.registerServiceWorker()).resolves.toBe(false);

    const fakeSw = {
      register: vi.fn().mockResolvedValue({}),
    };
    Object.defineProperty(navigator, 'serviceWorker', {
      value: fakeSw,
      configurable: true,
    });
    await expect(new BrowserPwaRegistrationAdapter().registerServiceWorker()).resolves.toBe(true);
    delete (navigator as unknown as Record<string, unknown>)['serviceWorker'];

    const successAdapter = new BrowserPwaRegistrationAdapter(() => ({
      register: async () => ({}),
    }));
    await expect(successAdapter.registerServiceWorker()).resolves.toBe(true);

    const failingAdapter = new BrowserPwaRegistrationAdapter(() => ({
      register: async () => {
        throw new Error('SW failed');
      },
    }));
    await expect(failingAdapter.registerServiceWorker()).resolves.toBe(false);
  });
});
