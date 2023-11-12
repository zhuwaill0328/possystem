import { Component, OnInit, ViewChild } from '@angular/core';
import { MongodbService, queryType } from '../shared/mongodb.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CartitemsComponent } from './cartitems/cartitems.component';

@Component({
  selector: 'app-pos-transaction',
  templateUrl: './pos-transaction.component.html',
  styleUrls: ['./pos-transaction.component.scss']
})
export class POSTransactionComponent  implements OnInit{

  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: any = ['date', 'customer', 'total', 'payment', 'status','user', 'actions'];

  datasource: MatTableDataSource<any> = new MatTableDataSource<any>;



  constructor(private dialog: MatDialog ,private http: HttpClient, private mdb: MongodbService,private auth: AuthService) {
    
  }
  ngOnInit(): void {
    this.getData();
  }

  getPaymentType(type:number){
    return this.mdb.getPaymentType(type);
  }

  results:any = []
  getData(){
    this.results = []

    this.http.get(this.mdb.getTransactionEndPoint(queryType.READ),{ responseType: 'json', headers: this.mdb.headers })
    .subscribe((data:any)=>{
        if(data.status){
          this.results = data.data
          this.datasource= new MatTableDataSource<any>(this.results)
          this.datatableSettings();
        }
      
    })


  }
  openCartitems(cart:any){
    this.dialog.open(CartitemsComponent,{
      data: cart,
      width:'100vw',
      minHeight:'50vh',
      
    })
  }
  datatableSettings() {
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
    this.filterSettings();
  }

  filterSettings() {
    this.datasource.filterPredicate = (data: any, filter: string): boolean => {
      return data.Customer.Name.toLowerCase().includes(filter.toLowerCase())
        || data.User.Name.toLowerCase().includes(filter.toLowerCase())
        || data.Status.toLowerCase().includes(filter.toLowerCase())
    }
  }
storedData :any= []
  sortChange(sort:Sort){
    const data = this.results
    if(!sort.active || sort.direction === ''){
      this.storedData = data;
      return;
    }

    this.storedData = data.sort((a:any,b:any)=>{
      const isAsc = sort.direction === 'asc';
      switch(sort.active){
        case 'customer':
          return this.compare(a.Customer.Name,b.Customer.Name,isAsc)
        case 'user':
          return this.compare(a.User.Name,b.User.Name,isAsc)
        case 'status':
          return this.compare(a.Status,b.Status,isAsc)
        
        default:
          return 0
      }
    })
    
  }

   compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

}
