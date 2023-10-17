import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MongodbService, queryType } from 'src/app/shared/mongodb.service';
import { PosPaymentModalComponent } from '../pos-payment-modal/pos-payment-modal.component';

@Component({
  selector: 'app-pos-gcash-modal',
  templateUrl: './pos-gcash-modal.component.html',
  styleUrls: ['./pos-gcash-modal.component.scss']
})
export class PosGcashModalComponent {

  selectedUser:any
  userVisible: boolean =false
  transactionType: any


  constructor(private http:HttpClient,
    private mdb: MongodbService, private fb:FormBuilder,
    public dialogref: MatDialogRef<PosGcashModalComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any
    ){
      this.getUsers()
      this.getGcashRates()
      this.transactionType = this.data.type
  }

  users:any = []
  gcashForm = new FormGroup({
    Customer: new FormGroup({
      Name: new FormControl('',Validators.required),
      Phone: new FormControl('',Validators.required)
    }),
    User: new FormGroup({
      Name: new FormControl('',Validators.required),
      Role: new FormControl(''),
      Phone: new FormControl('')
    }),
    TransactionType: new FormControl('',Validators.required),
    ReferenceNumber: new FormControl('',Validators.required),
    Amount: new FormControl('',Validators.required),
    TransactionFee: new FormControl('',Validators.required)
    
  })


  changeFee(amount:any){
    const value:number = amount.target.value
    this.computeRates(value)
    
  }

  get UserControl(){
    return this.gcashForm.controls['User'] as FormGroup
  }

  userValueChange(event:any){
    this.selectedUser = event
    this.userVisible =true
    this.UserControl.controls['Name'].patchValue(this.selectedUser.Name.Firstname + ' ' + this.selectedUser.Name.Lastname)
    this.UserControl.controls['Phone'].patchValue(this.selectedUser.Phone)
    this.UserControl.controls['Role'].patchValue(this.selectedUser.Role)
  }
   getUsers() {

    this.users = [];
    this.http.get(this.mdb.getUserEndPoint(queryType.READ), { responseType: 'json', headers: this.mdb.headers }).subscribe((data: any) => {

     this.users = data.data

    })

  }

  rates:any = []

  computeRates(amount:number){


  if(amount<= 0){
    this.gcashForm.controls['TransactionFee'].patchValue('0')
    return;
  }
  for(var x of  this.rates){
    if(amount <= x.amount){
      this.gcashForm.controls['TransactionFee'].patchValue(x.fee)
     return;
    }
  }

  }

  getCurrentUserId(){

    for(var user of this.users){
      if(user._id == sessionStorage.getItem('user_id') ){
         this.userValueChange(user)
        return user
    }
    }


    
  }

  getGcashRates() {

    this.http.get(this.mdb.getSystemEndPoint(queryType.READ), { responseType: 'json', headers: this.mdb.headers }).subscribe((data: any) => {

    const rate = data.data
      this.rates=[]
    if(rate.length > 0){
      let sys = rate[0]

   
      for(var x of sys.GcashRates){
         this.rates.push(x)
      }
     

    }

    })

  }


}
