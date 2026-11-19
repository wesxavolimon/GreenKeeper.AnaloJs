import {
  CheckAuthUseCase,
  LoginUseCase,
  LogoutUseCase,
} from './index';

describe('Auth Application Use Cases', () => {
  it('LoginUseCase delegates to authPort.login', async () => {
    const login = vi.fn().mockResolvedValue(undefined);
    const useCase = new LoginUseCase({ login } as never);
    await useCase.execute();
    expect(login).toHaveBeenCalledTimes(1);
  });

  it('LogoutUseCase delegates to authPort.logout', async () => {
    const logout = vi.fn().mockResolvedValue(undefined);
    const useCase = new LogoutUseCase({ logout } as never);
    await useCase.execute();
    expect(logout).toHaveBeenCalledTimes(1);
  });

  it('CheckAuthUseCase.execute returns user from authPort.getUser', async () => {
    const user = { id: '1', email: 'a@b.com', name: 'A', picture: null, provider: 'google' as const };
    const getUser = vi.fn().mockResolvedValue(user);
    const useCase = new CheckAuthUseCase({ getUser } as never);
    expect(await useCase.execute()).toBe(user);
    expect(getUser).toHaveBeenCalledTimes(1);
  });

  it('CheckAuthUseCase.isAuthenticated delegates to authPort.isAuthenticated', async () => {
    const isAuthenticated = vi.fn().mockResolvedValue(true);
    const useCase = new CheckAuthUseCase({ isAuthenticated } as never);
    expect(await useCase.isAuthenticated()).toBe(true);
    expect(isAuthenticated).toHaveBeenCalledTimes(1);
  });
});
