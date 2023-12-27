import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MongodbService, queryType } from 'src/app/shared/mongodb.service';
import {Location} from '@angular/common'
import { MatDialog } from '@angular/material/dialog';
import { PosDebitRepaymentComponent } from '../pos-debit-repayment/pos-debit-repayment.component';
import { PosDebitHistoryComponent } from '../pos-debit-history/pos-debit-history.component';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
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
  @ViewChild(MatTable) table : MatTable<any>;
  @ViewChild('debitlist') paginator : MatPaginator;
  @ViewChild('debitlistpaid') paginatorpaid : MatPaginator;
  datasource: MatTableDataSource<any>

  debitcolumns: any = ['customer','date','reference','amount','balance','list','status','username','action']

 paiddatasource: MatTableDataSource<any>
  
  paidcolumns: any = ['customer','date','reference','amount','balance','list','status','username','action']




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
      const unpaid = this.filterbystatus('Unpaid');
      const paid = this.filterbystatus('paid')
      this.datasource = new MatTableDataSource<any>(unpaid);
      this.paiddatasource = new MatTableDataSource<any>(paid)
      this.resetSandP();
    })
  }

  resetSandP(){
    this.datasource.paginator = this.paginator;
    this.paiddatasource.paginator = this.paginatorpaid;

    if(this.datasource.paginator){
      this.datasource.paginator.firstPage();
    }
    if(this.paiddatasource.paginator){
      this.paiddatasource.paginator.firstPage();
    }
    this.settingFilter();
  }

  selectedStatus:any = 'Unpaid'


  filterbystatus(status: any){
    this.selectedStatus = status
    const keyword = status.toLowerCase()

    let data:any = []
   data = this.unfilterddebits.filter(
    (item:any) => item.Status.toLowerCase() == keyword
    )

   return data;
  }

  searchv2(event :Event){
    const value = (event.target as HTMLInputElement).value;
    this.datasource.filter = value.trim().toLocaleLowerCase();
  }

  settingFilter(){
    this.datasource.filterPredicate = (option:any,value:string) : boolean =>{
      if(value){
        return (option.Customer.Name)?.trim().toLowerCase().includes(value)
        || (option.Transaction.Id)?.trim().toLowerCase().includes(value)

      }else return false

    }

    this.paiddatasource.filterPredicate = (option:any,value:string) : boolean =>{
      if(value){
        return (option.Customer.Name)?.trim().toLowerCase().includes(value)
        || (option.Transaction.Id)?.trim().toLowerCase().includes(value)

      }else return false

    }
  }

  search(event:any){
    const value = (event.target as HTMLInputElement).value;
    this.paiddatasource.filter = value.trim().toLocaleLowerCase();

  }

  ngOnInit(): void {
    this.clientDebits();
    
  }


   

  openlist(transaction:any){
    console.log(transaction)
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
      window.location.reload();
    });
  }

}
