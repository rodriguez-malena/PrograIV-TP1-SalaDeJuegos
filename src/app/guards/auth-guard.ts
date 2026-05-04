import { CanActivateFn } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';


export const authGuard: CanActivateFn = (route,state) => {

  const auth = inject(AuthService);
  const router = inject(Router);


  if (auth.isLoggedIn()) {
    return true;
    
  } else {
    router.navigate(['/login']);
    return false;
  }
};
  

