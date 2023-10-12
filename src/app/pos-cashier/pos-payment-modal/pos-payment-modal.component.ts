import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MongodbService, queryType } from 'src/app/shared/mongodb.service';

@Component({
  selector: 'app-pos-payment-modal',
  templateUrl: './pos-payment-modal.component.html',
  styleUrls: ['./pos-payment-modal.component.scss']
})
export class PosPaymentModalComponent implements OnInit {

  transaction: any;


  payment = new FormGroup({
    total: new FormControl('', Validators.required)
  })


  constructor(private http: HttpClient, private mdb : MongodbService,public dialogref: MatDialogRef<PosPaymentModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.transaction = data;

  }
  ngOnInit(): void {



  }

  acceptPayment() {

    if (this.payment.valid) {

      if (this.payment.value.total) {
        if (this.transaction.transaction.total <= this.payment.value.total) {

            this.addData();
          
        }else{ alert('Amount is invalid!');}
      }else{alert('Amount is invalid!'); }
    }else{alert('Amount is invalid!');}

  }

  reset() {
    this.payment.controls.total.setValue('0');
  }

  calculate(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const recentvalue = this.payment.value.total;

    if (recentvalue == '0' || recentvalue == null) {
      this.payment.controls.total.setValue(value);
      return;
    }
    if (value == '.') {
      if (recentvalue?.includes(value)) return;
    }

    this.payment.controls.total.setValue(recentvalue + value)

  }

  
  addData() {
    let cartitems:any =[];
    let stocks: any = [];
    this.transaction.cart.forEach((item:any)=>{

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
      Customer: {
        Name: this.transaction.customer
      },
      User: {
        Name: sessionStorage.getItem('user'),
        Role: sessionStorage.getItem('role')
      },
      Date: Date.now(),
      Payment: {
        Amount: this.payment.value.total,
        Discount: 0.00,
        Type: 0
      },
      Status: 'Paid',
      Cart: cartitems,
      Products: stocks

    }

    this.http.post(this.mdb.getTransactionEndPoint(queryType.INSERT), bodyData, { responseType: 'json', headers: this.mdb.headers }).subscribe((data: any) => {

      if (data.status) {

        alert(data.message);

        let result = {
            submitFlag: true
        }

        this.dialogref.close(result);
       
      }
      else {
        alert(data.message);
      }

    });
  }

}
