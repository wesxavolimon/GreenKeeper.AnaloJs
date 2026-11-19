import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { EvaluateDeviceAccessUseCase } from '@application/index';

export const mobileOnlyGuard: CanActivateFn = (): boolean | UrlTree => {
  const evaluateAccess = inject(EvaluateDeviceAccessUseCase);
  const router = inject(Router);
  const decision = evaluateAccess.execute();

  if (decision.allowed) {
    return true;
  }

  return router.parseUrl('/desktop-info');
};
