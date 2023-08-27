import { HttpClient } from '@angular/common/http';
import { Injectable, assertPlatform } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private http: HttpClient,private router:Router) { }

  isLoggedIn(){
    
    if(sessionStorage.getItem('token')){

      return true;
    }else{
      this.router.navigate(['/login'])
      return false;
    }
  
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate(['/login'])
  }

 
}
