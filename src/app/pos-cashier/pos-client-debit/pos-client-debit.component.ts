import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MongodbService, queryType } from 'src/app/shared/mongodb.service';

@Component({
  selector: 'app-pos-client-debit',
  templateUrl: './pos-client-debit.component.html',
  styleUrls: ['./pos-client-debit.component.scss']
})
export class PosClientDebitComponent {

  constructor(private http: HttpClient,private mdb:MongodbService){
    this.getCustomers();
  }

  customers:any= []
  getCustomers(){
    this.http.get(this.mdb.getCustomerEndpoint(queryType.READ),{responseType:'json',headers:this.mdb.headers})
    .subscribe((data:any)=>{
      this.customers =data.data
    })
  }

}
