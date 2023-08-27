import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MongodbService, queryType } from '../shared/mongodb.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-pos-cashier',
  templateUrl: './pos-cashier.component.html',
  styleUrls: ['./pos-cashier.component.scss']
})
export class POSCashierComponent implements OnInit {

  constructor(private auth:AuthService ,private http: HttpClient,private mdb: MongodbService){}

  admin:boolean =true;
  ngOnInit(): void {
    if(sessionStorage.getItem('role') == 'Cashier') this.admin =false;

    this.getData();
    this.loadCategories();
    this.datasource = new MatTableDataSource<any>(this.results);

  }

  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  datasource: MatTableDataSource<any> = new MatTableDataSource<any>;
  results:any = []
  products:any =[]
  displayedColumns: any = ['name','quantity','actions'];

delete(data:any){
  const index :number = this.results.indexOf(data);
  if(index !== -1){
    this.results.splice(index, 1)
    this.table.renderRows();
  }
  
}
logout(){
  this.auth.logout();
}
  addData(data:any){

    if(this.results.length > 0){
      let index :any = this.results.indexOf(data);
      console.log(index)
      if(index !== -1){
        data.Stocks.Quantity  = data.Stocks.Quantity + 1;
        this.results.items[index] = data;
    
      }else{
        this.results.push(data);
      }

    }else{
      this.results.push(data);
    }
    this.table.renderRows();
  }

  categories:any = []

  loadCategories() {

    this.categories = [];
    this.http.get(this.mdb.getCategoryEndPoint(queryType.READ), { responseType: 'json', headers: this.mdb.headers }).subscribe((data: any) => {

      this.categories = data.data;
      console.log(this.categories)

    })

  }

  async getData() {

    this.results = [];
    this.http.get(this.mdb.getProductEndpoint(queryType.READ), { responseType: 'json', headers: this.mdb.headers }).subscribe((data: any) => {

      this.products = data.data;

    })

  }



}
