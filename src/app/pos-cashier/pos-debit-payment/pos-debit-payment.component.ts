import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CustomerCrudComponent } from 'src/app/pos-customer/customer-crud/customer-crud.component';
import { POSCustomerComponent } from 'src/app/pos-customer/pos-customer.component';
import { MongodbService, queryType } from 'src/app/shared/mongodb.service';
import Swal from 'sweetalert2';
import { v4 as uuidV4} from 'uuid'
@Component({
  selector: 'app-pos-debit-payment',
  templateUrl: './pos-debit-payment.component.html',
  styleUrls: ['./pos-debit-payment.component.scss']
})
export class PosDebitPaymentComponent implements OnInit {

  constructor(private http: HttpClient,private mdb: MongodbService
    ,private dialog: MatDialog
    , public dialogref: MatDialogRef<PosDebitPaymentComponent>,@Inject(MAT_DIALOG_DATA) public data: any
    ){
      this.transaction.controls['Amount'].patchValue(data.amount)
      this.transactionData = {
        cart : data.cart
      }
      
    }
 
  customer = new FormGroup({
    Name: new FormControl('',Validators.required),
    Phone: new FormControl('',Validators.required),
    Id: new FormControl('',Validators.required)
  })
  transaction = new FormGroup({
    Amount: new FormControl('',Validators.required),
    
  })

  paymentHistory = new FormGroup({
    Amount: new FormControl('0.00')
  })

  @ViewChild('input') input: ElementRef<HTMLInputElement>;

  myControl = new FormControl('')
  filteredOptions :any = []

  ngOnInit(): void {
    this.loadCustomers();
    this.filteredOptions = this.customerList.splice()
    
   }

  userValueChange(event:any){
    this.customer.controls['Id'].patchValue(event._id)
    this.customer.controls['Phone'].patchValue(event.Phone)
    this.customer.controls['Name'].patchValue(event.Name)
  }

  addnewcustomer(){
   let result =  this.dialog.open(CustomerCrudComponent)

   result.afterClosed().subscribe(()=>{
      this.loadCustomers()
   })

  }


  filter(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredOptions = this.customerList.filter((o:any) => o.Name.toLowerCase().includes(filterValue));
  }
 

  customerList:any = []


  loadCustomers(){
    this.customerList = []
    this.http.get(this.mdb.getCustomerEndpoint(queryType.READ),{responseType: 'json', headers : this.mdb.headers})
    .subscribe((data:any)=>{
        this.customerList = data.data;
    })
  }

 compute(){
  const amount:any = this.transaction.value.Amount
  const initial:any = this.paymentHistory.value.Amount
  let balance = amount - initial
  return balance.toFixed(2)
 }
 
  saveDebit(){
    if(this.customer.valid && this.transaction.valid){
       const bodydata = {
         Customer : this.customer.value,
         Username: sessionStorage.getItem('user'),
         Transaction: {
            Id : Date.now(),
            Amount: this.transaction.value.Amount,
            Date: Date.now(),
            Balance: this.compute(),
            PaymentHistory :[ 
              {
                Amount: this.paymentHistory.value.Amount,
                User: sessionStorage.getItem('user'),
                Date: Date.now()
                } 
            ]
         },
       }

   
       this.http.post(this.mdb.getDebitEndPoint(queryType.INSERT),bodydata, {responseType: 'json', headers: this.mdb.headers})
       .subscribe((data:any)=>{
        if(data.status){
          this.addData(data.data.Transaction.Id);
        }
          Swal.fire(data.message)
          
       })


    }else{
      this.customer.markAllAsTouched()
      this.customer.markAsDirty()
      this.transaction.markAllAsTouched()
      this.transaction.markAsDirty()
       Swal.fire({
        title: 'Incomplete details!',
        icon: 'error'
       })
    }
  }

  transactionData:any 

  addData(id:any) {
    let cartitems:any =[];
    let stocks: any = [];
    this.transactionData.cart.forEach((item:any)=>{

      cartitems.push({
        Id: item._id,
        Qty: item.Qty,
        Name: item.Name,
        Price: item.Price,
        Image:item.Image,
        Cost: item.Cost
        
      });

      var d = {
        Id: item._id,
        Stocks: item.Stocks
      }

     
      stocks.push(d);


    });


    const bodyData = {
      _id : id,
      Customer: {
        Name: this.customer.value.Name
      },
      User: {
        Name: sessionStorage.getItem('user'),
        Role: sessionStorage.getItem('role')
      },
      Date: Date.now(),
      Payment: {
        Amount: this.paymentHistory.value.Amount,
        Discount: 0.00,
        Type: 2,
        Total: this.data.amount 
      },
      Status: 'Unpaid',
      Cart: cartitems,
      Products: stocks

    }

    this.http.post(this.mdb.getTransactionEndPoint(queryType.INSERT), bodyData, { responseType: 'json', headers: this.mdb.headers }).subscribe((data: any) => {

      if (data.status) {
        let submitFlag = {
          submitFlag : true
        }

        this.dialogref.close(submitFlag);
       
      }
      else {
        alert(data.message);
      }

    });
  }





}