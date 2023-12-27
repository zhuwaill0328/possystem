import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pos-login',
  templateUrl: './pos-login.component.html',
  styleUrls: ['./pos-login.component.scss']
})
export class POSLoginComponent implements OnInit {


  constructor(private router: Router, private auth: AuthService,private http: HttpClient){

  }
  //declarations

  form = new FormGroup({
    username: new FormControl('',Validators.required),
    password: new FormControl('',Validators.required)

  })

  defaultAlert: any = [{
    type:'',
    msg:'',
    timeout: 1
  }];

  ngOnInit(): void {
    this.checkUserLoggedIn();
    
  }

  checkUserLoggedIn(){
    let result =  this.auth.isLoggedIn();
    
    if(result) this.router.navigate(['/home/dashboard'])
  }

  async openonlineview(){
    this.router.navigate(['onlineview'])
  }


  async login() {

    if(this.form.valid){
      const username  = this.form.value.username ? this.form.value.username : '';
      const password = this.form.value.password ? this.form.value.password :'';
      const bodyData={
        Username: username,
        Password: password
      }
      await this.http.post(environment.EndPoint + 'user/login', bodyData,{responseType :'json'})
      .subscribe((result:any)=>{
  
        if(result.status){
          sessionStorage.setItem('token', result.token);
          sessionStorage.setItem('user_id',result.data._id);
          sessionStorage.setItem('user',result.data.Name.Firstname + " " +  result.data.Name.Lastname);
          sessionStorage.setItem('role', result.data.Role);
          sessionStorage.setItem('uname', result.data.Name.Firstname)
          this.router.navigate(['/home/dashboard']);
          
        }else{
          this.form.markAllAsTouched()
          this.form.markAsDirty()
          alert("Invalid username or password");
        }
        
      });

    }


  }

}
