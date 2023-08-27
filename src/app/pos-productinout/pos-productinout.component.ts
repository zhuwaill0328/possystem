import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MongodbService, queryType } from '../shared/mongodb.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-pos-productinout',
  templateUrl: './pos-productinout.component.html',
  styleUrls: ['./pos-productinout.component.scss']
})
export class PosProductinoutComponent implements OnInit {

  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: any = ['date', 'category', 'product', 'description'];

  datasource: MatTableDataSource<any> = new MatTableDataSource<any>;


  constructor(private http: HttpClient, private mdb: MongodbService) { }

  ngOnInit(): void {
    this.loadData();

  }
  panelOpenState = false;
  results: any = []
  loadData() {

    this.results = []
    this.http.get(this.mdb.getStockHistoryEndPoint(), { responseType: 'json', headers: this.mdb.headers }).subscribe((data: any) => {

      this.results = data.data;
      this.datasource = new MatTableDataSource<any>(this.results);
      this.datatableSettings();

    })



  }


   datatableSettings(){
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
    this.filterSettings();
  }

  filterSettings(){
    this.datasource.filterPredicate = (data:any,filter: string) : boolean =>{
      return data.Product.Category.toLowerCase().includes(filter.toLowerCase())
      || data.Product.Name.toLowerCase().includes(filter.toLowerCase()) 
      || data.User.Name.toLowerCase().includes(filter.toLowerCase())
      || data.User.Role.toLowerCase().includes(filter.toLowerCase())
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datasource.filter = filterValue.trim().toLowerCase();
  }


}
