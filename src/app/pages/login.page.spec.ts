import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { provideGreenKeeperDependencies } from '@composition/index';
import LoginPage from './login.page';
import { LoginUseCase, CheckAuthUseCase } from '@application/index';

describe('LoginPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        ...provideGreenKeeperDependencies(),
        {
          provide: LoginUseCase,
          useClass: class {
            execute = vi.fn().mockResolvedValue(undefined);
          },
        },
        {
          provide: CheckAuthUseCase,
          useClass: class {
            isAuthenticated = vi.fn().mockResolvedValue(false);
          },
        },
      ],
    }).compileComponents();
  });

  it('renders login page with Google button', () => {
    const fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[data-testid="btn-login-google"]')).toBeTruthy();
    expect(root.textContent).toContain('Continuar com Google');
  });

  it('calls login use case when clicking Google button', async () => {
    const fixture = TestBed.createComponent(LoginPage);
    const root = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();

    const loginUseCase = TestBed.inject(LoginUseCase);
    (root.querySelector('[data-testid="btn-login-google"]') as HTMLElement).click();
    fixture.detectChanges();
    expect(loginUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it('redirects to dashboard when already authenticated on init', async () => {
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const checkAuth = TestBed.inject(CheckAuthUseCase);
    vi.spyOn(checkAuth, 'isAuthenticated').mockResolvedValue(true);

    TestBed.createComponent(LoginPage);
    await TestBed.flushEffects();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});
