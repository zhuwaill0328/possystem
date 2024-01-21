import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CustomerCrudComponent } from 'src/app/pos-customer/customer-crud/customer-crud.component';
import { POSCustomerComponent } from 'src/app/pos-customer/pos-customer.component';
import { MongodbService, queryType } from 'src/app/shared/mongodb.service';
import Swal from 'sweetalert2';
import { v4 as uuidV4} from 'uuid'

import firebase from 'firebase/compat/app'
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Component({
  selector: 'app-pos-debit-payment',
  templateUrl: './pos-debit-payment.component.html',
  styleUrls: ['./pos-debit-payment.component.scss']
})
export class PosDebitPaymentComponent implements OnInit {

  constructor(private http: HttpClient,private mdb: MongodbService,
    private fs: AngularFirestore,
    private dialog: MatDialog
    , public dialogref: MatDialogRef<PosDebitPaymentComponent>,@Inject(MAT_DIALOG_DATA) public data: any
    ){
      this.transaction.controls['Amount'].patchValue(data.amount)
      this.transactionData = {
        cart : data.cart
      }

      this.customer.controls['Name'].patchValue (data.customer.Name)
      this.customer.controls['Id'].patchValue(data.customer._id)
      this.customer.controls['Phone'].patchValue (data.customer.Phone)
      
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
            Id : '',
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
        console.log(data.data._id)
        if(data.status){
          
          this.addData(data.data._id);
        
        }
        
          
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

    console.log(id)

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

    this.http.post(this.mdb.getTransactionEndPoint(queryType.INSERT), bodyData, { responseType: 'json', headers: this.mdb.headers }).subscribe(async (data: any) => {
      //console.log('Alert Error',data)
      if (data.status) {

        let total: any ;
        let totalDebit: any ;
        let docRef= this.fs.collection('Dashboard')
        let dateObj = new Date(firebase.firestore.Timestamp.now().toDate());
        let month = dateObj.getUTCMonth() + 1;
        let day = dateObj.getUTCDate();
        let year = dateObj.getUTCFullYear();

 
         docRef.doc(year + "-" + month + "-" + day).get().subscribe( async (info:any)=>{
           let ref:any = info.data();
             if(isNaN(ref?.TotalSales)) total = 0;
             else  total =ref.TotalSales ;

             if(isNaN(ref?.TotalDebit)) totalDebit = 0;
             else totalDebit = ref.TotalDebit;


            
             let val:any = this.paymentHistory.value?.Amount
             let debit :any = this.compute();
             
             let res  = {
               "Date":firebase.firestore.Timestamp.now() ,
               "TotalSales" : parseFloat(val) + parseFloat(total),
               "TotalDebit" : parseFloat(debit) + parseFloat(totalDebit)
             }
         
             await docRef.doc(year + "-" + month + "-" + day).set(res, {merge :true}).then(()=>{
            
            })
           
        })
        let submitFlag = {
          submitFlag : true,
          customer: this.customer.value.Name,
          id: id,
          balance: this.paymentHistory.value.Amount
        }
        Swal.fire('Debit Created Successfully')
        this.dialogref.close(submitFlag);
       
      }
      else {
        Swal.fire(data.message)
      }

    });
  }





}
