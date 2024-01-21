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
import { PosSearchproductComponent } from './pos-searchproduct/pos-searchproduct.component';
import { PosBarcodeScannerComponent } from './pos-barcode-scanner/pos-barcode-scanner.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { tap } from 'rxjs';
import { PosCalcComponent } from './pos-calc/pos-calc.component';

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

  constructor(private fs: AngularFirestore,
    private auth: AuthService, private http: HttpClient, private mdb: MongodbService, private dialog: MatDialog) {
    
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

setQuantitytoOne(){
  this.qtty = 1;
}

addQtyonCart(product:any , numberofitems: any){
  product.Qty = parseFloat(product.Qty) + parseFloat(numberofitems);

}
  addData(data: any, isadd: boolean = true) {
    let quantty: number = 0;
    this.qttyAccept =false
    if (this.qtty == ""){
      quantty = 1
    }else{
      quantty = parseFloat(this.qtty)
    }

    if(data.Stocks.Quantity < quantty){
      
      this.clearQtty();
      return;
    }
    
    if (this.results.length > 0) {
      let index: any = this.results.indexOf(data);
      if (index !== -1) {

        if (isadd == true) {

          if(data.Stocks.Quantity <=0 ){
            this.clearQtty();
            return;
          }

          if (data.Stocks.Quantity == 0){
            this.clearQtty();
            return;
          } 

          data.Stocks.Quantity--;
         this.addQtyonCart(data,quantty)

        } else {
          data.Stocks.Quantity++
          if (data.Qty == 1) {
            this.delete(data);
            this.clearQtty();
            return;
          }
          data.Qty--;
          this.clearQtty();
        }



      } else {
        data.Stocks.Quantity--;
        data.Qty = quantty
        this.results.push(data);
      }

    } else {
      data.Stocks.Quantity--;
      data.Qty = quantty
      this.results.push(data);
    }
    this.clearQtty();
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
        this.filterProducts('')


      })

  }

  openCamera(){
    this.dialog.open(PosBarcodeScannerComponent,{
      width: '90vw',
      height: '90vh'
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
    const keyword  = value.toLowerCase();
    if (keyword == ''){
      this.filteredProduct = this.products.filter((data: any) => data.Essentials === true);


    }else{
      this.filteredProduct = this.products.filter((data: any) => data.Category.toLowerCase().includes(keyword));


    }

  
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
    this.filteredProduct = this.products.filter((data: any) => data.Serials.Barcode == filter
    || data.Name.toLowerCase().includes(filter.toLowerCase()));
    if (this.filteredProduct.length > 0){
      this.addData(this.filteredProduct[0],true)
      control.target.value =""
      this.filteredProduct = []
    }
    


  }

  openSearch(){
    this.modalOpen = true
    this.dialog.open(PosSearchproductComponent,{
      width : '90vw',
      height : '90vh'
    }).afterClosed().subscribe((data:any)=>{
      if(data){
        if(data.submitFlag){
          this.addData(data.item,true)
        }
         
      }

      this.modalOpen =false
      
    })
    //this.filteredProduct = this.products.filter((data: any) =>
    //  data.Name.toLowerCase().includes(filter.toLowerCase()) || data.Serials.Barcode == filter);
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
  customer:any = {
    Name: "Walk-In"
  }
  openCustomer(){
    this.modalOpen = true
    let result = this.dialog.open(PosSelectCustomerComponent,{
      minWidth:'50vw'
    })
    .afterClosed().subscribe((data:any)=>{
      this.customer =data.data
      console.log(this.customer)
      this.modalOpen = false
    })

  }

  openDebitList(){
    this.modalOpen = true;

    this.dialog.open(PosDebitPaymentComponent,{
      width: '90vw',
    }).afterClosed().subscribe(()=>{
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

  saveToFireStore(type:any,customer:any,id:any, payment: number = 0.00){
    const transaction_data = {
       Payment: type,
       Amount: this.getTotalCost(),
       Customer: customer,
       TransactionId: id,
       InitialPayment: payment,
       Date: Date.now()
    }
    this.fs.collection('Pos Transactions').add(transaction_data)
  }


  clearQtty(){
    this.qtty = "";
    this.qttyAccept =true 
 
  }

  qttyAccept:boolean =true
  openQty(){

    if(this.qttyAccept == true) this.qttyAccept =false;
    else this.qttyAccept =true;

    this.qtty = ""
    /**
     * this.modalOpen =true;
   let result =  this.dialog.open(PosCalcComponent,{
    width: '30vw',



    })

    result.afterClosed().subscribe((data:any)=>{
      this.modalOpen =false
    })

     */

  }

  recentvalue: any = "";
  clear:boolean =false;
  addQtty(event:any){
    const value :any = event
    if(value == "."){
      if(this.qtty.toString().includes(".")){
        return;
      }else{
        let val:any = this.qtty + value;
        this.qtty = val
      }

    }else{

      let val:any = this.qtty + value;
      this.qtty = val
      



     
    
    }
  
  }
  qtty: any = 1;

  processDebitPayment(){
    if(this.results.length > 0){
      let result = this.dialog.open(PosDebitPaymentComponent,{
        minWidth: '30vw',
        minHeight: '40vh',
        data : {
          amount : this.getTotalCost(),
          cart : this.results,
          customer: this.customer
        }
     })
 
     result.afterClosed().subscribe((data:any)=>{
      this.modalOpen = false
        if(data.submitFlag){

          this.saveToFireStore('Debit Payment',data.customer, data.id,data.balance)
           
          while(this.results.length > 0){
            this.results.splice(0,1)
        }
        this.results = []
        this.datasource = new MatTableDataSource(this.results)
        
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
  
          this.saveToFireStore('Cash Payment','Walk-in',result.id,this.getTotalCost())
          
          while(this.results.length > 0){
              this.results.splice(0,1)
          }
          this.results = []
          this.datasource = new MatTableDataSource(this.results)

          
          this.table.renderRows();
          this.getTotalCost()
          this.customer= ''
          Swal.fire({
            title: parseFloat(result.changes).toFixed(2),
            text: "Changed",
            confirmButtonText: "New Transaction"
          }).then(()=>{
            //window.location.reload();
          })
        }
  
      })


    }
  }





}
