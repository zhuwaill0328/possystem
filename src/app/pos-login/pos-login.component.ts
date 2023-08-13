import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-pos-login',
  templateUrl: './pos-login.component.html',
  styleUrls: ['./pos-login.component.scss']
})
export class POSLoginComponent implements OnInit {


  constructor(private router: Router, private auth: AuthService){

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

  login(){
    
    if(this.form.valid){
        const username  = this.form.value.username ? this.form.value.username : '';
        const password = this.form.value.password ? this.form.value.password :'';

        let result:any = this.auth.login(username,password);
        if(result){
          this.router.navigate(['/home/dashboard']);
        }else{
          alert('Cant connect to API')
        }
        
    }else{
      this.form.markAllAsTouched()
      this.form.markAsDirty()
    }



  }

}
