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
   
  }

  logout(){

    this.auth.logout();
  }

}
