import { Component, OnInit, ViewChild } from '@angular/core';
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

  constructor(private auth: AuthService, private http: HttpClient, private mdb: MongodbService, private dialog: MatDialog) { }

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
  addData(data: any, isadd: boolean = true) {
    if(data.Stocks.Quantity <=0 ){
      return;
    }
    if (this.results.length > 0) {
      let index: any = this.results.indexOf(data);
      if (index !== -1) {

        if (isadd == true) {

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

  searchProduct(control: any) {
    const filter = control.target.value;
    this.filteredProduct = this.products.filter((data: any) =>
      data.Name.toLowerCase().includes(filter.toLowerCase()) || data.Serials.Barcode == filter);


  }

  openGcash(type: PaymentType = PaymentType.CASHIN ){

    let dialogref = this.dialog.open(PosGcashModalComponent,{
      disableClose:true,
      width: '90vw',
      data: {
        type: type
      }

    })

    dialogref.afterClosed().subscribe(data=>{
      
    })
  }


  processPayment(paymentType: PaymentType) {

    if(this.results.length > 0){

      let dialogref = this.dialog.open(PosPaymentModalComponent, {
        disableClose: true,
        data: {
          cart: this.results,
          transaction: {
            total: this.getTotalCost()
          },
          customer: "Rhomnel Saguinsin"
        }
      })
  
      dialogref.afterClosed().subscribe((result: any) => {
        
        if (result.submitFlag) {
  
       
          while(this.results.length > 0){
              this.results.splice(0,1)
          }
          this.results = []

          
          this.table.renderRows();
          
  
        }
  
      })


    }



   


  }






}
