import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { provideGreenKeeperDependencies } from '@composition/index';
import { CheckAuthUseCase } from '@application/index';
import { authGuard } from './auth.guard';

describe('AuthGuard', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        ...provideGreenKeeperDependencies(),
      ],
    }).compileComponents();
  });

  it('allows access when authenticated', async () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        ...provideGreenKeeperDependencies(),
        {
          provide: CheckAuthUseCase,
          useClass: class {
            isAuthenticated = async () => true;
          },
        },
      ],
    });

    const result = TestBed.runInInjectionContext(() =>
      authGuard(
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot,
      ),
    );
    await expect(result).resolves.toBe(true);
  });

  it('redirects to /login when not authenticated', async () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        ...provideGreenKeeperDependencies(),
        {
          provide: CheckAuthUseCase,
          useClass: class {
            isAuthenticated = async () => false;
          },
        },
      ],
    });

    const result = (await TestBed.runInInjectionContext(() =>
      authGuard(
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot,
      ),
    )) as UrlTree;
    expect(result.toString()).toBe('/login');
  });
});
