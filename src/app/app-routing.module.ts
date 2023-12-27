import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { POSMainComponent } from './pos-main/pos-main.component';
import { POSLoginComponent } from './pos-login/pos-login.component';
import { POSDashboardComponent } from './pos-dashboard/pos-dashboard.component';
import { POSProductsComponent } from './pos-products/pos-products.component';
import { POSCategoryComponent } from './pos-category/pos-category.component';
import { POSCashierComponent } from './pos-cashier/pos-cashier.component';
import { POSTransactionComponent } from './pos-transaction/pos-transaction.component';
import { POSGcashTransactionComponent } from './pos-gcash-transaction/pos-gcash-transaction.component';
import { POSUserComponent } from './pos-user/pos-user.component';
import { IsAdminGuard, PosAdminGuard } from './shared/authguard.guard';
import { PosProductinoutComponent } from './pos-productinout/pos-productinout.component';
import { PosSystemComponent } from './pos-system/pos-system.component';
import { CustomerCrudComponent } from './pos-customer/customer-crud/customer-crud.component';
import { POSCustomerComponent } from './pos-customer/pos-customer.component';
import { PosClientDebitComponent } from './pos-cashier/pos-client-debit/pos-client-debit.component';
import { PosOnlineDashboardComponent } from './pos-online-dashboard/pos-online-dashboard.component';

const routes: Routes = [
  {
    component: POSMainComponent,
    path: 'home', canActivate: [IsAdminGuard] ,
    children: [{
      path: 'dashboard',canActivate: [IsAdminGuard]  ,component: POSDashboardComponent
    },
    {
      path: 'products',canActivate: [IsAdminGuard]  ,component: POSProductsComponent
    },
    { path: 'stockinout', canActivate:[IsAdminGuard], component: PosProductinoutComponent},
    {
      path: 'category',canActivate: [IsAdminGuard]  , component: POSCategoryComponent
    },
    {
      path: 'transactions',canActivate: [IsAdminGuard]  , component: POSTransactionComponent
    },
    {
      path: 'gcash',canActivate: [IsAdminGuard]  , component: POSGcashTransactionComponent
    },
    {
      path: 'users',canActivate: [IsAdminGuard]  , component: POSUserComponent
    },
    {
      path: 'system',canActivate: [IsAdminGuard]  , component: PosSystemComponent
    },
    {
      path: 'customer',canActivate: [IsAdminGuard]  , component: POSCustomerComponent
    },

    ]
  },
  {
    path: 'pos',canActivate: [IsAdminGuard]  ,
    children: [{
      path: 'client-debit',canActivate: [IsAdminGuard], component : PosClientDebitComponent

    },{
      path: 'terminal',canActivate: [IsAdminGuard]  , component: POSCashierComponent,
  
    }]
  },
  {
    component: POSLoginComponent,
    path: 'login', pathMatch: "full"
  },
  {
    path: '', redirectTo:'login' , pathMatch: "full"
  },
  {
    component : PosOnlineDashboardComponent,
    path :'onlineview',pathMatch : 'full'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
