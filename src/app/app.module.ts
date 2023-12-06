import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { POSMainComponent } from './pos-main/pos-main.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatCommonModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { POSLoginComponent } from './pos-login/pos-login.component';
import { POSProductsComponent } from './pos-products/pos-products.component';
import { POSCustomerComponent } from './pos-customer/pos-customer.component';
import { POSCategoryComponent } from './pos-category/pos-category.component';
import { POSTransactionComponent } from './pos-transaction/pos-transaction.component';
import { POSCashierComponent } from './pos-cashier/pos-cashier.component';
import { POSGcashTransactionComponent } from './pos-gcash-transaction/pos-gcash-transaction.component';
import { POSUserComponent } from './pos-user/pos-user.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import{POSSidenavComponent} from './pos-sidenav/pos-sidenav.component';
import {HttpClientModule} from '@angular/common/http';
import{ AlertModule} from 'ngx-bootstrap/alert';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { FlexLayoutModule } from "@angular/flex-layout";
import { PosProductinoutComponent } from './pos-productinout/pos-productinout.component';
import { PosInoutmodalComponent } from './pos-inoutmodal/pos-inoutmodal.component';
import { DialogComponent } from './dialog/dialog.component';
import { PosPaymentModalComponent } from './pos-cashier/pos-payment-modal/pos-payment-modal.component';
import { PosGcashModalComponent } from './pos-cashier/pos-gcash-modal/pos-gcash-modal.component';
import { PosSystemComponent } from './pos-system/pos-system.component';
import { CommonModule } from '@angular/common';
import { CartitemsComponent} from './pos-transaction/cartitems/cartitems.component'
import {CustomerCrudComponent} from './pos-customer/customer-crud/customer-crud.component';
import { PosCustomerDisplayComponent } from './pos-customer/pos-customer-display/pos-customer-display.component';
import { PosClientDebitComponent } from './pos-cashier/pos-client-debit/pos-client-debit.component';
import { PosSelectCustomerComponent } from './pos-cashier/pos-select-customer/pos-select-customer.component';
import { PosDebitPaymentComponent } from './pos-cashier/pos-debit-payment/pos-debit-payment.component';
import { PosDebitRepaymentComponent } from './pos-cashier/pos-debit-repayment/pos-debit-repayment.component';
import { PosDebitHistoryComponent } from './pos-cashier/pos-debit-history/pos-debit-history.component';
import { PosSearchproductComponent } from './pos-cashier/pos-searchproduct/pos-searchproduct.component'


@NgModule({
  declarations: [
    AppComponent,
    POSMainComponent,
    POSLoginComponent,
    POSProductsComponent,
    POSCustomerComponent,
    POSCategoryComponent,
    POSTransactionComponent,
    POSCashierComponent,
    POSGcashTransactionComponent,
    POSUserComponent,
    POSSidenavComponent,
    PosProductinoutComponent,
    PosInoutmodalComponent,
    DialogComponent,
    PosPaymentModalComponent,
    PosGcashModalComponent,
    PosSystemComponent,
    CartitemsComponent,
    CustomerCrudComponent,
    PosCustomerDisplayComponent,
    PosClientDebitComponent,
    PosSelectCustomerComponent,
    PosDebitPaymentComponent,
    PosDebitRepaymentComponent,
    PosDebitHistoryComponent,
    PosSearchproductComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TypeaheadModule,
    AlertModule,
    FlexLayoutModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatButtonModule,
    MatBadgeModule,
    MatAutocompleteModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatCommonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatSelectModule,
    MatSliderModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
