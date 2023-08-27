import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-pos-main',
  templateUrl: './pos-main.component.html',
  styleUrls: ['./pos-main.component.scss']
})
export class POSMainComponent implements OnInit {

  constructor(private auth: AuthService){}

  openSidenav:boolean =false;

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
