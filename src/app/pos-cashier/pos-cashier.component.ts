import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MongodbService, queryType } from '../shared/mongodb.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../shared/auth.service';
import { environment } from 'src/environments/environment.development';
import { MatDialog } from '@angular/material/dialog';
import { PosPaymentModalComponent } from './pos-payment-modal/pos-payment-modal.component';
import { PosGcashModalComponent } from './pos-gcash-modal/pos-gcash-modal.component';
import Swal from 'sweetalert2';
import { POSCustomerComponent } from '../pos-customer/pos-customer.component';
import { PosCustomerDisplayComponent } from '../pos-customer/pos-customer-display/pos-customer-display.component';
import { PosSelectCustomerComponent } from './pos-select-customer/pos-select-customer.component';
import { PosDebitPaymentComponent } from './pos-debit-payment/pos-debit-payment.component';
import { PosClientDebitComponent } from './pos-client-debit/pos-client-debit.component';

enum PaymentType{
  CASH = 0,
  GCASH = 1,
  CREDIT = 2,
  CASHIN = 3,
  CASHOUT = 4
}

@Component({
  selector: 'app-pos-cashier',
  templateUrl: './pos-cashier.component.html',
  styleUrls: ['./pos-cashier.component.scss']
})
export class POSCashierComponent implements OnInit {

  constructor(private auth: AuthService, private http: HttpClient, private mdb: MongodbService, private dialog: MatDialog) {
    
   }

  admin: boolean = true;
  ngOnInit(): void {

    this.results = [];
    if (sessionStorage.getItem('role') == 'Cashier') this.admin = false;

    this.getData();
    this.loadCategories();
    this.datasource = new MatTableDataSource<any>(this.results);

  }

  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  datasource: MatTableDataSource<any> = new MatTableDataSource<any>;
  results: any = []
  products: any = []
  filteredProduct: any = []
  displayedColumns: any = ['quantity', 'name', 'subtotal', 'actions'];

  delete(data: any) {
    const index: number = this.results.indexOf(data);
    if (index !== -1) {
      this.results.splice(index, 1)
      this.table.renderRows();
    }

  }
  logout() {
    this.auth.logout();
  }


  @ViewChild('yourInput', {static: false}) yourInput: ElementRef;

modalOpen:boolean =false;
onBlur(event:any) {

  if(!this.modalOpen){
    this.yourInput.nativeElement.focus()
  }
  
}
  addData(data: any, isadd: boolean = true) {
    
    if (this.results.length > 0) {
      let index: any = this.results.indexOf(data);
      if (index !== -1) {

        if (isadd == true) {

          if(data.Stocks.Quantity <=0 ){
            return;
          }

          if (data.Stocks.Quantity == 0) return;
          data.Stocks.Quantity--;
          data.Qty++;
        } else {
          data.Stocks.Quantity++
          if (data.Qty == 1) {
            this.delete(data);
            return;
          }
          data.Qty--;
        }



      } else {
        data.Stocks.Quantity--;
        data.Qty = 1;
        this.results.push(data);
      }

    } else {
      data.Stocks.Quantity--;
      data.Qty = 1;
      this.results.push(data);
    }
    this.table.renderRows();
    this.scrollto()
  }

  categories: any = []

  loadCategories() {

    this.categories = [];
    this.http.get(this.mdb.getCategoryEndPoint(queryType.READ), { responseType: 'json', headers: this.mdb.headers }).subscribe((data: any) => {

      this.categories = data.data
    })

  }

  async getData() {

   
    this.http.get(this.mdb.getProductEndpoint(queryType.READ),
      { responseType: 'json', headers: this.mdb.headers }).subscribe((data: any) => {
        this.products = [];

        this.products = data.data.filter((data: any) => data.Stocks.Quantity > 0);

        this.filteredProduct =this.products


      })

  }

  getImage(row: any) {

    return environment.EndPoint + "uploads/img_" + row.Image;

  }

  geticons(file:any){
    return environment.EndPoint + "uploads/" + file;
  }
  value = ""
  getTotalCost() {
    let count = 0;

    const data: any[] = this.results;

    data.forEach((info: any) => {

      count += (info.Qty * info.Price)
    })

    return count;
  }


  filterProducts(value: any) {

    this.filteredProduct = this.products.filter((data: any) => data.Category.toLowerCase().includes(value.toLowerCase()));


  }

  scrollto(){
    const element = document.getElementById('table-bottom')
    element?.scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    })
  }

  searchProduct(control: any) {
    const filter = control.target.value;
    this.filteredProduct = this.products.filter((data: any) =>
      data.Name.toLowerCase().includes(filter.toLowerCase()) || data.Serials.Barcode == filter);
  }

  searchBarcode(control:any){
    const filter = control.target.value;
    
    //this.filteredProduct = this.products.filter((data: any) =>
     // data.Name.toLowerCase().includes(filter.toLowerCase()) || data.Serials.Barcode == filter);

      const item:any = this.products.filter((data: any) => data.Serials.Barcode == filter);

      if(item.length == 1){
        this.addData(item[0])
        
      }
      control.target.value = ""
      
  }
  customer:any 
  openCustomer(){
    this.modalOpen = true
    let result = this.dialog.open(PosClientDebitComponent,{
      minWidth:'50vw'
    })
    .afterClosed().subscribe((data:any)=>{
      this.customer =data
      this.modalOpen = false
    })

  }

  openGcash(type: PaymentType = PaymentType.CASHIN ){
    this.modalOpen = true
    let dialogref = this.dialog.open(PosGcashModalComponent,{
      disableClose:true,
      width: '90vw',
      data: {
        type: type
      }

    })

    dialogref.afterClosed().subscribe(data=>{
      this.modalOpen = false
    })
  }


  selectedCustomer:any = null

  processPayment(paymentType: PaymentType) {
    this.modalOpen = true
    switch(paymentType){
      case PaymentType.CASH:
        this.processCashPayment('Walk-in');
        break;
      case PaymentType.CREDIT:
        this.processDebitPayment()
        break;
    }
   

  }

  clearQtty(){
    this.qtty = 1;
  }

  addQtty(event:any){
    const value :any = event
    this.qtty =value;
  }
  qtty: any = 1;
  processDebitPayment(){
    if(this.results.length > 0){
      let result = this.dialog.open(PosDebitPaymentComponent,{
        minWidth: '30vw',
        minHeight: '40vh',
        data : {
          amount : this.getTotalCost(),
          cart : this.results
        }
     })
 
     result.afterClosed().subscribe((data:any)=>{
      this.modalOpen = false
        if(data.submitFlag){
           
          while(this.results.length > 0){
            this.results.splice(0,1)
        }
        this.results = []

        
        this.table.renderRows();
        this.getTotalCost()
        this.customer= ''
       
        }
     })
    }
  }


  processCashPayment(customer: any = null){
    if(this.results.length > 0){

      let dialogref = this.dialog.open(PosPaymentModalComponent, {
        disableClose: true,
        data: {
          cart: this.results,
          transaction: {
            total: this.getTotalCost()
          },
          customer:customer.Name? customer.Name : 'Walk-in'
        }
      })
  
      dialogref.afterClosed().subscribe((result: any) => {
        this.modalOpen = false
        if (result.submitFlag) {
  
          
          while(this.results.length > 0){
              this.results.splice(0,1)
          }
          this.results = []

          
          this.table.renderRows();
          this.getTotalCost()
          this.customer= ''
          Swal.fire({
            title: parseFloat(result.changes).toFixed(2),
            text: "Changed",
            confirmButtonText: "New Transaction"
          })
        }
  
      })


    }
  }





}
