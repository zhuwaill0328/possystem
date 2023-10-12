import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pos-gcash-modal',
  templateUrl: './pos-gcash-modal.component.html',
  styleUrls: ['./pos-gcash-modal.component.scss']
})
export class PosGcashModalComponent {


  gcashForm = new FormGroup({
    Customer: new FormGroup({
      Name: new FormControl('',Validators.required),
      Phone: new FormControl('',Validators.required)
    }),
    User: new FormGroup({
      Name: new FormControl('',Validators.required),
      Role: new FormControl('',Validators.required),
      Phone: new FormControl('',Validators.required)
    }),
    TransactionType: new FormControl('',Validators.required),
    ReferenceNumber: new FormControl('',Validators.required),
    Amount: new FormControl('',Validators.required),
    TransactionFee: new FormControl('',Validators.required)
    
  })


  changeFee(amount:number){
    
  }

}
