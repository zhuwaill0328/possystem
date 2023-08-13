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

  login(username: String,password: String) {

    const bodyData={
      Username: username,
      Password: password
    }

    
   return this.http.post(environment.EndPoint + 'user/login', bodyData,{responseType :'json'})
    .subscribe((result:any)=>{

      if(result.status){
        sessionStorage.setItem('token', result.token);
        sessionStorage.setItem('user_id',result.data._id);
        sessionStorage.setItem('user',result.data.Name.Firstname + " " +  result.data.Name.Lastname);
        sessionStorage.setItem('role', result.data.Role);
          return true;
      }else{

        return false;
      }
      
    });

 

  }
}
