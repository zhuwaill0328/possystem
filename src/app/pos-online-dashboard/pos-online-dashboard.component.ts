import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { filter } from 'rxjs';

@Component({
  selector: 'app-pos-online-dashboard',
  templateUrl: './pos-online-dashboard.component.html',
  styleUrls: ['./pos-online-dashboard.component.scss']
})
export class PosOnlineDashboardComponent implements OnInit {

  constructor(private fs: AngularFirestore){

  }

  transactions :any = []
  gcashtransactions: any = []
  ngOnInit(): void {

    this.loadGcash();
    this.loadTransactions();
   
  }

  loadGcash(){
    this.fs.collection('Gcash Transaction',filter => filter.orderBy('Date','desc')).snapshotChanges()
    .pipe().subscribe((data:any)=>{
      this.gcashtransactions =[]
      this.totalCashIn = 0;
      this.totalCashOut = 0;
      data.forEach((item:any)=>{
        let transaction:any = item.payload.doc.data();
        if(transaction.Type == 'CASH IN') this.totalCashIn+= transaction.Amount;
        else {
          this.totalCashOut += (transaction.Amount - transaction.Fee)
        }
        this.gcashtransactions.push(transaction);
      })
    })
    
  }

  totalTransactionCash: number =0;
  totalTransactionDebit: number = 0;
  totalCashIn: number = 0;
  totalCashOut: number = 0;

  loadTransactions(){
    this.fs.collection('Pos Transactions',filter => filter.orderBy('Date','desc')).snapshotChanges()
    .pipe().subscribe((data:any)=>{
      this.transactions =[]
      this.totalTransactionCash = 0;
      this.totalTransactionDebit = 0;
      data.forEach((item:any)=>{
        let transaction:any = item.payload.doc.data();
       
       
        this.transactions.push(transaction);
      });
      for(var transaction of this.transactions){
        this.totalTransactionCash += transaction.InitialPayment;
  
        if(transaction.Payment == 'Debit Payment'){
          this.totalTransactionDebit += (transaction.Amount - transaction.InitialPayment);
          
        }
      }
    })

   
    
  }

}
