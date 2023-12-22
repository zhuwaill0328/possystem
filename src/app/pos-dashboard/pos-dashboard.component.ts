import { Component, OnInit } from '@angular/core';
import { MongodbService, queryType } from '../shared/mongodb.service';
import { HttpClient } from '@angular/common/http';

export interface CardData {
  title: '',
  data: '',
  message: ''
}

@Component({
  selector: 'app-pos-dashboard',
  templateUrl: './pos-dashboard.component.html',
  styleUrls: ['./pos-dashboard.component.scss']
})


export class POSDashboardComponent implements OnInit {

  constructor(private mdb: MongodbService,private http : HttpClient){

  }
  
   paid: number = 0
   unpaid : number = 0
   totalItems: number = 0;
   totalSales: number= 0;
   totalLowItems: number = 0;
   totaldebitUnpaid: number = 0;
   
   datasource:any = []


  ngOnInit(): void {


    this.loadTransactionData()
    this.loadDebits();
    this.loadAllItems();
  }

  loadAllItems(){
    this.totalItems = 0;
    this.http.get(this.mdb.getProductEndpoint(queryType.READ), {responseType: 'json',headers : this.mdb.headers})
    .subscribe((data:any)=>{
        if(data.status){
          const result:any[] = data.data
          this.totalItems = result.length;
        }
    })
  }


  loadDebits(){
    this.totaldebitUnpaid = 0;
    this.http.get(this.mdb.getDebitEndPoint(queryType.READ), {responseType: 'json',headers : this.mdb.headers})
    .subscribe((data:any)=>{
        if(data.status){
          const result:any[] = data.data
          
          result.forEach((item:any)=>{
             if(item.Staus == 'Unpaid'){
               this.totaldebitUnpaid += item.Transaction.Balance
             }
          })
        }
    })
  }

  loadTransactionData(){
    this.datasource = []

    this.http.get(this.mdb.getTransactionEndPoint(queryType.READ),{ responseType: 'json', headers: this.mdb.headers })
    .subscribe((data:any)=>{
        if(data.status){
         const res:any[] = data.data
         this.paid = 0;
         this.unpaid = 0;
         res.forEach((item:any)=>{

            if(item.Status == 'Paid') this.paid += item.Payment.Total;
            else this.unpaid += item.Payment.Total;
            this.totalSales+=item.Payment.Amount;

         })
          
        }
      
    })


  }







}
