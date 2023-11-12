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
    const selected = sessionStorage?.getItem('selectedTab')
    this.selected(selected? parseInt(selected):0)
  }

  



  isAdmin:boolean=false;
  isStandard:boolean =false;
  iscashier: boolean =false;

  collapsed = false;
  navData = [{  
    routerLink:'dashboard',
    icon: 'dashboard',
    label: 'Dashboard',
    allowed: true,
    selected : false
  },
  
  {
    routerLink:'category',
    icon: 'category',
    label: 'Category',
    allowed: this.isAdmin ,
    selected : false
  },
  {
    routerLink:'products',
    icon: 'category',
    label: 'Products',
    allowed: this.isAdmin ,
    selected : false
  },
  {
    routerLink:'stockinout',
    icon: 'category',
    label: 'Stock History',
    allowed: this.isAdmin ,
    selected : false
  },
  {
    routerLink:'/pos',
    icon: 'payments',
    label: 'POS Terminal',
    allowed: this.isAdmin || this.iscashier,
    selected : false
  },
  
  {
    routerLink:'transactions',
    icon: 'list',
    label: 'Transaction',
    allowed: true,
    selected : false
  },
  {
    routerLink:'gcash',
    icon: 'list',
    label: 'Gcash In-Out',
    allowed: true,
    selected : false
  }
  ,
  
  {
    routerLink:'customer',
    icon: 'group',
    label: 'Customers',
    allowed: true,
    selected : false
  }
  
  ,
  {
    routerLink:'users',
    icon: 'group',
    label: 'Users',
    allowed: this.isAdmin,
    selected : false
  }
  ,
  {
    routerLink:'system',
    icon: 'settings',
    label: 'System',
    allowed: this.isAdmin,
    selected : false
  }


]
selectedTab = 0;
selected(index:number){
this.selectedTab = index
sessionStorage.setItem('selectedTab',this.selectedTab.toString())
this.clearSelection()
if(index!=4)this.setSelected(index)

}

clearSelection(){
  for(var d of this.navData){
    d.selected =false
  }
}

setSelected(index:number){
let data = this.navData[index]
data.selected = true
this.navData[index]=data
}

}
