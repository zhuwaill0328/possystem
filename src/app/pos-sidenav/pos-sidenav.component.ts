import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-pos-sidenav',
  templateUrl: './pos-sidenav.component.html',
  styleUrls: ['./pos-sidenav.component.scss']
})
export class POSSidenavComponent implements OnInit {

  fullname: any= ""
  role:any = ""
  logourl = environment.logourl;
  ngOnInit(): void {
    if(sessionStorage.getItem('role') == 'Cashier') this.iscashier =true;
    else if(sessionStorage.getItem('role') == 'Standard') this.isStandard =true;
    else this.isAdmin =true;

    this.fullname = sessionStorage.getItem('user')
    this.role = sessionStorage.getItem('role')
  }



  isAdmin:boolean=false;
  isStandard:boolean =false;
  iscashier: boolean =false;

  collapsed = false;
  navData = [{  
    routerLink:'dashboard',
    icon: 'dashboard',
    label: 'Dashboard',
    allowed: true
  },
  
  {
    routerLink:'category',
    icon: 'category',
    label: 'Category',
    allowed: this.isAdmin 
  },
  {
    routerLink:'products',
    icon: 'category',
    label: 'Products',
    allowed: this.isAdmin 
  },
  {
    routerLink:'stockinout',
    icon: 'category',
    label: 'Stock History',
    allowed: this.isAdmin 
  },
  {
    routerLink:'/pos',
    icon: 'payments',
    label: 'POS Terminal',
    allowed: this.isAdmin || this.iscashier
  },
  
  {
    routerLink:'transactions',
    icon: 'payments',
    label: 'Transaction',
    allowed: true
  }
  ,
  {
    routerLink:'gcash',
    icon: 'payments',
    label: 'Gcash In-Out',
    allowed: true
  }
  ,
  {
    routerLink:'users',
    icon: 'payments',
    label: 'Users',
    allowed: this.isAdmin
  }
  ,
  {
    routerLink:'system',
    icon: 'settings',
    label: 'System',
    allowed: this.isAdmin
  }


]
selectedTab = 0;
selected(index:number){
this.selectedTab = index
}

}
