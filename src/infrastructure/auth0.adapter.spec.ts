const mockAuth0 = vi.hoisted(() => ({
  loginWithRedirect: vi.fn(),
  logout: vi.fn(),
  getUser: vi.fn(),
  isAuthenticated: vi.fn(),
}));

const shouldThrow = vi.hoisted(() => ({ value: false }));

vi.mock('@auth0/auth0-spa-js', () => ({
  Auth0Client: class {
    constructor() {
      if (shouldThrow.value) {
        throw new Error('secure origin required');
      }
      return mockAuth0;
    }
    loginWithRedirect = mockAuth0.loginWithRedirect;
    logout = mockAuth0.logout;
    getUser = mockAuth0.getUser;
    isAuthenticated = mockAuth0.isAuthenticated;
  },
}));

import { Auth0Adapter } from './auth0.adapter';

const mockAppConfig = {
  getConfig: vi.fn().mockReturnValue({
    auth0Domain: 'example.us.auth0.com',
    auth0ClientId: 'client-123',
  }),
};

describe('Auth0Adapter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls loginWithRedirect on login', async () => {
    mockAuth0.loginWithRedirect.mockResolvedValue(undefined);
    const adapter = new Auth0Adapter(mockAppConfig as never);
    await adapter.login();
    expect(mockAuth0.loginWithRedirect).toHaveBeenCalledTimes(1);
  });

  it('calls logout with returnTo on logout', async () => {
    mockAuth0.logout.mockResolvedValue(undefined);
    const adapter = new Auth0Adapter(mockAppConfig as never);
    await adapter.logout();
    expect(mockAuth0.logout).toHaveBeenCalledTimes(1);
    expect(mockAuth0.logout).toHaveBeenCalledWith({
      logoutParams: { returnTo: window.location.origin },
    });
  });

  it('returns null when getUser returns null', async () => {
    mockAuth0.getUser.mockResolvedValue(null);
    const adapter = new Auth0Adapter(mockAppConfig as never);
    expect(await adapter.getUser()).toBeNull();
  });

  it('maps Auth0 user to User entity', async () => {
    mockAuth0.getUser.mockResolvedValue({
      sub: 'auth0|123',
      email: 'user@example.com',
      name: 'User Name',
      picture: 'https://example.com/photo.jpg',
    });
    const adapter = new Auth0Adapter(mockAppConfig as never);
    const user = await adapter.getUser();
    expect(user).toEqual({
      id: 'auth0|123',
      email: 'user@example.com',
      name: 'User Name',
      picture: 'https://example.com/photo.jpg',
      provider: 'google',
    });
  });

  it('maps missing optional fields to defaults', async () => {
    mockAuth0.getUser.mockResolvedValue({});
    const adapter = new Auth0Adapter(mockAppConfig as never);
    const user = await adapter.getUser();
    expect(user).toEqual({
      id: '',
      email: '',
      name: '',
      picture: null,
      provider: 'google',
    });
  });

  it('delegates isAuthenticated to auth0 client', async () => {
    mockAuth0.isAuthenticated.mockResolvedValue(true);
    const adapter = new Auth0Adapter(mockAppConfig as never);
    expect(await adapter.isAuthenticated()).toBe(true);
    expect(mockAuth0.isAuthenticated).toHaveBeenCalledTimes(1);

    mockAuth0.isAuthenticated.mockResolvedValue(false);
    expect(await adapter.isAuthenticated()).toBe(false);
  });

  it('handles null client gracefully', async () => {
    const adapter = new Auth0Adapter(mockAppConfig as never);
    (adapter as any).auth0Promise = Promise.resolve(null);
    await expect(adapter.login()).resolves.toBeUndefined();
    await expect(adapter.logout()).resolves.toBeUndefined();
    await expect(adapter.getUser()).resolves.toBeNull();
    await expect(adapter.isAuthenticated()).resolves.toBe(false);
  });

  it('catches Auth0Client constructor error', async () => {
    shouldThrow.value = true;
    const adapter = new Auth0Adapter(mockAppConfig as never);
    await expect(adapter.login()).resolves.toBeUndefined();
    shouldThrow.value = false;
  });
});
