import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const user = localStorage.getItem('user');

  if (user) {
    const parsedUser = JSON.parse(user);
    if (parsedUser.role === 'ADMIN') {
      return true;
    }
  }

  router.navigate(['/']);
  return false;
};