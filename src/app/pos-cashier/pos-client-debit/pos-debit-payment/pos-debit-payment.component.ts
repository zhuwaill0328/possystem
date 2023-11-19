import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MongodbService } from 'src/app/shared/mongodb.service';

@Component({
  selector: 'app-pos-debit-payment',
  templateUrl: './pos-debit-payment.component.html',
  styleUrls: ['./pos-debit-payment.component.scss']
})
export class PosDebitPaymentComponent {

  constructor(private http: HttpClient,
    private mdb : MongodbService,
    public dialogref: MatDialogRef<PosDebitPaymentComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any)
      {
        
      }

}
