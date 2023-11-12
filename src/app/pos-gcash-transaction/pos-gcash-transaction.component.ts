import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../shared/auth.service';
import { MongodbService, queryType } from '../shared/mongodb.service';

@Component({
  selector: 'app-pos-gcash-transaction',
  templateUrl: './pos-gcash-transaction.component.html',
  styleUrls: ['./pos-gcash-transaction.component.scss']
})
export class POSGcashTransactionComponent implements OnInit {

  constructor(private dialog: MatDialog ,private http: HttpClient, private mdb: MongodbService,private auth: AuthService) {
    
  }
  ngOnInit(): void {
    this.getData()
  }

  datasource:any = []
  getData(){
      this.datasource = []
     
      this.http.get(this.mdb.getGcashEndPoint(queryType.READ),{ responseType: 'json', headers: this.mdb.headers })
      .subscribe((data:any)=>{
        this.datasource = data.data
           console.log(data.data)
      })
  }

}
