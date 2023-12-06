import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MongodbService, queryType } from 'src/app/shared/mongodb.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pos-debit-repayment',
  templateUrl: './pos-debit-repayment.component.html',
  styleUrls: ['./pos-debit-repayment.component.scss']
})
export class PosDebitRepaymentComponent {

  paymentgroup = new FormGroup({
    balance: new FormControl('',Validators.required),
    amount: new FormControl('',Validators.required)
  })

  transaction: any 

  constructor(private http: HttpClient,
    private mdb : MongodbService,
    public dialogref: MatDialogRef<PosDebitRepaymentComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any)
      {
        this.transaction = data.data
        this.paymentgroup.controls['balance'].patchValue(data.data.Transaction.Balance ? data.data.Transaction.Balance : data.data.Transaction.Amount)
      }
    

    compute(): any {
      const bal:any = this.paymentgroup.value.balance
      const amount:any = this.paymentgroup.value.amount
      let newamount = 0;
      let changed = 0;
      if(amount > bal) {
        newamount = 0
        changed = amount - bal
      }
      else  newamount =  bal - amount 
      const data = {
          amount : amount,
          newBalance : newamount,
          changed: changed
      }

      return data
     
    }

    displayError(title:any){
      Swal.fire({
        title : title,
        icon: 'error'
      })
    }

    saveData(){
      if(this.paymentgroup.invalid){
          this.displayError('Invalid Amount!')
      }else{
        const bal:any = this.paymentgroup.value.balance
        const amount:any = this.paymentgroup.value.amount
  
        if(amount == 0 ){
          this.displayError('Zero Amount is not valid for re-payment!')
          return
        }
        const data = this.compute()
        const returnService = {
            newBalance: data.newBalance.toFixed(2),
            amount: data.amount.toFixed(2),
            changed:  data.changed.toFixed(2) ,
            transaction: this.transaction
        }
        if(data.newBalance == 0){
          this.transaction.Status ='Paid'
        }
        this.transaction.Transaction.Balance = data.newBalance.toFixed(2)
        this.transaction.Transaction.PaymentHistory.push({
          Amount : data.amount.toFixed(2),
          Date: Date.now(),
          User: sessionStorage.getItem('user'),
          Changed: data.changed.toFixed(2)
        })

        const bodyData = this.transaction
        console.log(bodyData)

        const transactionData = {
          Id: bodyData.Transaction.Id,
          Status: data.newBalance <= 0 ? 'Paid' : 'Unpaid'
        }

        this.http.patch(this.mdb.getTransactionEndPoint(queryType.UPDATE),
       transactionData ,{responseType: 'json', headers : this.mdb.headers})
       .subscribe((result:any)=>{
          console.log(result)
          if(result.status){
            this.http.patch(this.mdb.getDebitEndPoint(queryType.UPDATE),bodyData, {responseType: 'json', headers: this.mdb.headers} )
            .subscribe((results:any)=>{

              if(results.status){
                this.dialogref.close()
          }
          
        })

          }
       });
        
      }
    }


}
