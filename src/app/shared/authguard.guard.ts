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

class posAuthGuard{

  constructor(private auth: AuthService){}

  canActivate (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

     
      const user = this.auth.getCurrentUser()

        if(user.role == "") return false
        else return true

  }

}

export const IsAdminGuard: CanActivateFn = (route :ActivatedRouteSnapshot , state : RouterStateSnapshot): boolean=>{
  
  return inject(authguardGuard).canActivate(route,state);

}

export const PosAdminGuard: CanActivateFn = (route :ActivatedRouteSnapshot , state : RouterStateSnapshot): boolean=>{
  
  return inject(posAuthGuard).canActivate(route,state);

}