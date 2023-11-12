import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MongodbService, queryType } from 'src/app/shared/mongodb.service';
import { PosPaymentModalComponent } from '../pos-payment-modal/pos-payment-modal.component';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-pos-gcash-modal',
  templateUrl: './pos-gcash-modal.component.html',
  styleUrls: ['./pos-gcash-modal.component.scss']
})
export class PosGcashModalComponent implements OnInit {

  selectedUser:any
  userVisible: boolean =false
  transactionType: any
  gcash_rates:any = []

  constructor(private http:HttpClient,
    private mdb: MongodbService, private fb:FormBuilder,
    public dialogref: MatDialogRef<PosGcashModalComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any
    ){
      this.getUsers()
      
      this.transactionType = this.data.type
      
  }
  ngOnInit(): void {
    this.getGcashRates()
    this.gcashForm.controls['TransactionType'].patchValue(this.transactionType == 3? 'CASH IN': 'CASH OUT')
   
  }
  isdeducted:boolean =false

  ammountToReceived(){
    const x:any = this.gcashForm.value.Amount
    const y:any = this.gcashForm.value.TransactionFee
    const total = this.compute(x,y)
    return isNaN(total)? 0 : total <= 0 ? 0 : total
  }

  compute(x:any,y:any){
    return parseFloat(x) - parseFloat(y)
  }


  users:any = []
  gcashForm = new FormGroup({
    Customer: new FormGroup({
      Name: new FormControl('',Validators.required),
      Phone: new FormControl('',[Validators.required,Validators.minLength(11),Validators.maxLength(11)])
    }),
    User: new FormGroup({
      Name: new FormControl('',Validators.required),
      Role: new FormControl(''),
      Phone: new FormControl('')
    }),
    TransactionType: new FormControl('',Validators.required),
    ReferenceNumber: new FormControl('',Validators.required),
    Amount: new FormControl('',[Validators.required,Validators.min(1)]),
    TransactionFee: new FormControl('0.00',Validators.required),
    CurrentUser: new FormControl(''),
    FeeDeducted: new FormControl(false)
    
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
     this.userValueChange(this.getCurrentUserId())

    })

  }

  processedGcash(){

    if(this.gcashForm.valid){
      const bodyData : Record<string,any> = this.gcashForm.value

      this.http.post(this.mdb.getGcashEndPoint(queryType.INSERT),bodyData, { responseType: 'json', headers: this.mdb.headers})
      .subscribe((data:any)=>{
        if(data.status){
          
          this.dialogref.close()

          Swal.fire({
            title: 'Success',
            icon:'success'
          })
        }
      })
    } else alert("Please fill upp all required field!")
  }

  rates:any = []

  computeRates(amount:number){


  if(amount<= 0){
    this.gcashForm.controls['TransactionFee'].patchValue('0.00')
    return;
  }
  for(var x of  this.gcash_rates){
    if(amount <= x.amount){
      this.gcashForm.controls['TransactionFee'].patchValue(x.fee)
     return;
    }
  }

  }

  getcurrentUser(User:any){
    const index = this.users.indexOf(User)

    return this.users[index]

  }

  getCurrentUserId(){
   
    for(var user of this.users){
      
      if(user._id == sessionStorage.getItem('user_id') ){

        this.gcashForm.controls['CurrentUser'].patchValue(user.Name.Firstname)
        return user
    }
    }


    
  }

  getGcashRates() {

    this.http.get(this.mdb.getSystemEndPoint(queryType.READ), { responseType: 'json', headers: this.mdb.headers }).subscribe((data: any) => {

          this.gcash_rates = []
          const rates = data.data

          const gcash =rates[0].GcashRates
          this.gcash_rates = gcash

  
      })

  }


}
