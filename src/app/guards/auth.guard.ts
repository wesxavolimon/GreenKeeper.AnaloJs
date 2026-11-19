import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { CheckAuthUseCase } from '@application/index';

export const authGuard: CanActivateFn = (): Promise<boolean | UrlTree> => {
  const checkAuth = inject(CheckAuthUseCase);
  const router = inject(Router);

  return checkAuth.isAuthenticated().then((authenticated) => {
    if (authenticated) {
      return true;
    }
    return router.parseUrl('/login');
  });
};
