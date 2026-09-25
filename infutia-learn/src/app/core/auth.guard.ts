import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** Only signed-in authors may enter the portal; everyone else is bounced to /login. */
export const authorPortalGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn()) return true;
  // Remember where they were headed so the login page can offer "return to studio".
  try {
    sessionStorage.setItem('infutia-redirect', state.url);
  } catch {
    /* SSR-safe */
  }
  return router.createUrlTree(['/login']);
};
