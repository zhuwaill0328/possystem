import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-pos-main',
  templateUrl: './pos-main.component.html',
  styleUrls: ['./pos-main.component.scss']
})
export class POSMainComponent implements OnInit {

  constructor(private auth: AuthService,private breakpoint: BreakpointObserver){
    this.breakpoint.observe(["(min-width: 768px)"])
    .subscribe((result:BreakpointState)=>{
      if(result.matches){
        this.resohigh = true
      }else{
        this.resohigh =false
      }
    })
  }

  openSidenav:boolean =false;
  resohigh: boolean =true;
  ngOnInit(): void {
    if(sessionStorage.getItem('role') == 'Cashier') this.isAdmin =false;
    else if(sessionStorage.getItem('role') == 'Standard') this.isStandard =true;


  }

  isAdmin:boolean=true;
  isStandard:boolean =false;
  logout(){

    this.auth.logout();
  }

}
