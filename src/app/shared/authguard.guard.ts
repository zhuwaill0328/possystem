import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

 class authguardGuard{

  constructor(private auth: AuthService){}

  canActivate (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

      return this.auth.isLoggedIn();
  }

}

export const IsAdminGuard: CanActivateFn = (route :ActivatedRouteSnapshot , state : RouterStateSnapshot): boolean=>{
  
  return inject(authguardGuard).canActivate(route,state);

}