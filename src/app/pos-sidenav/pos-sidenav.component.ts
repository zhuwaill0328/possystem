import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pos-sidenav',
  templateUrl: './pos-sidenav.component.html',
  styleUrls: ['./pos-sidenav.component.scss']
})
export class POSSidenavComponent implements OnInit {

  fullname: any= ""
  role:any = ""
  ngOnInit(): void {
    this.fullname = sessionStorage.getItem('user')
    this.role = sessionStorage.getItem('role')
  }

  collapsed = false;
  navData = [{  
    routerLink:'dashboard',
    icon: 'dashboard',
    label: 'Dashboard'
  },
  {
    routerLink:'products',
    icon: 'category',
    label: 'Products'
  },
  {
    routerLink:'category',
    icon: 'category',
    label: 'Category'
  },
  {
    routerLink:'/pos',
    icon: 'payments',
    label: 'POS Terminal'
  },
  
  {
    routerLink:'transactions',
    icon: 'payments',
    label: 'Transaction'
  }
  ,
  {
    routerLink:'gcash',
    icon: 'payments',
    label: 'Gcash In-Out'
  }
  ,
  {
    routerLink:'users',
    icon: 'payments',
    label: 'Users'
  }


]

}
