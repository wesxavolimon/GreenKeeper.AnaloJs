import {
  CheckAuthUseCase,
  LoginUseCase,
  LogoutUseCase,
} from './index';

describe('Auth Application Use Cases', () => {
  it('LoginUseCase delegates to authPort.login', () => {
    const login = vi.fn();
    const useCase = new LoginUseCase({ login } as never);
    useCase.execute();
    expect(login).toHaveBeenCalledTimes(1);
  });

  it('LogoutUseCase delegates to authPort.logout', () => {
    const logout = vi.fn();
    const useCase = new LogoutUseCase({ logout } as never);
    useCase.execute();
    expect(logout).toHaveBeenCalledTimes(1);
  });

  it('CheckAuthUseCase.execute returns user from authPort.getUser', () => {
    const user = { id: '1', email: 'a@b.com', name: 'A', picture: null, provider: 'google' as const };
    const getUser = vi.fn().mockReturnValue(user);
    const useCase = new CheckAuthUseCase({ getUser } as never);
    expect(useCase.execute()).toBe(user);
    expect(getUser).toHaveBeenCalledTimes(1);
  });

  it('CheckAuthUseCase.isAuthenticated delegates to authPort.isAuthenticated', () => {
    const isAuthenticated = vi.fn().mockReturnValue(true);
    const useCase = new CheckAuthUseCase({ isAuthenticated } as never);
    expect(useCase.isAuthenticated()).toBe(true);
    expect(isAuthenticated).toHaveBeenCalledTimes(1);
  });
});
