import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MongodbService } from 'src/app/shared/mongodb.service';
import { PosDebitRepaymentComponent } from '../pos-debit-repayment/pos-debit-repayment.component';

@Component({
  selector: 'app-pos-debit-history',
  templateUrl: './pos-debit-history.component.html',
  styleUrls: ['./pos-debit-history.component.scss']
})
export class PosDebitHistoryComponent {


  history: any = []
  customer:any 
  constructor(private http: HttpClient,
    private mdb : MongodbService,
    public dialogref: MatDialogRef<PosDebitHistoryComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any)
      {
       this.history = this.data.history
       this.customer = this.data.customer
      }

      close(){
        this.dialogref.close()
      }
}
