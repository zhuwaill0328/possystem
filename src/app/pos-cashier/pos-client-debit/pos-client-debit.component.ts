import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MongodbService, queryType } from 'src/app/shared/mongodb.service';
import {Location} from '@angular/common'
import { MatDialog } from '@angular/material/dialog';
import { PosDebitRepaymentComponent } from '../pos-debit-repayment/pos-debit-repayment.component';
import { PosDebitHistoryComponent } from '../pos-debit-history/pos-debit-history.component';
@Component({
  selector: 'app-pos-client-debit',
  templateUrl: './pos-client-debit.component.html',
  styleUrls: ['./pos-client-debit.component.scss']
})
export class PosClientDebitComponent implements OnInit {

  constructor(private http: HttpClient,
    private mdb:MongodbService,
    private _location: Location,
    private dialog: MatDialog){
    
  }
  ngOnInit(): void {
    this.clientDebits();
  }


  goback(){
    this._location.back();
  }

debits: any = []
storeddebits:any = []
unfilterddebits:any = []
  clientDebits(){
    this.debits = []
    this.http.get(this.mdb.getDebitEndPoint(queryType.READ),{responseType: 'json',headers : this.mdb.headers})
    .subscribe((data:any)=>{
      this.debits = data.data
      this.storeddebits =  data.data
      this.unfilterddebits = data.data
      this.filterbystatus('Unpaid')
    })
  }

  selectedStatus:any = 'Unpaid'


  filterbystatus(status: any){
    this.selectedStatus = status
    const keyword = status.toLowerCase()

    let data:any = []
   data = this.unfilterddebits.filter(
    (item:any) => item.Status.toLowerCase() == keyword
    )

    this.storeddebits = data;
    this.debits =this.storeddebits
  }

  search(event:any){
   const keyword = event.target.value.toLowerCase()
    let data:any = []
   data = this.storeddebits.filter(
    (item:any) => item.Customer.Name.toLowerCase().includes(keyword)
    || item.Transaction.Id.toLowerCase().includes(keyword)
    )

    this.debits = data;

  }

  openlist(transaction:any){
    this.dialog.open(PosDebitHistoryComponent,{
      data : {
        history : transaction.Transaction.PaymentHistory,
        customer:{
          Name : transaction.Customer.Name,
          Total : transaction.Transaction.Amount.toFixed(2),
          Balance: transaction.Transaction?.Balance.toFixed(2) | 0.00
        }
      }
    })
  }

  updatePayments(transaction:any){
    let result = this.dialog.open(PosDebitRepaymentComponent,{
      data: {
        data : transaction
      }
    })

    result.afterClosed().subscribe((data:any)=>{
      console.log(data)
    });
  }

}
