import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../shared/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MongodbService, queryType } from '../shared/mongodb.service';

@Component({
  selector: 'app-pos-inoutmodal',
  templateUrl: './pos-inoutmodal.component.html',
  styleUrls: ['./pos-inoutmodal.component.scss']
})
export class PosInoutmodalComponent implements OnInit {

  constructor(private mdb: MongodbService,private auth: AuthService, private http: HttpClient, public dialogRef: MatDialogRef<PosInoutmodalComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  currentProduct: any;
  currentUser: any = this.auth.getCurrentUser();
  isStockin: boolean = false;
  isConsume: boolean =false;

  form = new FormGroup({
    Id: new FormControl('', Validators.required),
    Product: new FormControl('', Validators.required),
    Category: new FormControl('', Validators.required),
    Type: new FormControl('Stock In', Validators.required),
    CurrentQuantity: new FormControl(0, Validators.required),
    Quantity: new FormControl(0, Validators.required),
  })
  ngOnInit(): void {

    if (this.data.Type == 'Stock In') this.isStockin = true;
    else if(this.data.Type == 'Consume') this.isConsume = true;
    this.currentProduct = this.data;
    this.loadData();
   
  }

  loadData(){
    this.form.controls.Id.patchValue(this.currentProduct._id);
    this.form.controls.Product.patchValue(this.currentProduct.Name);
    this.form.controls.Category.patchValue(this.currentProduct.Category);
    this.form.controls.CurrentQuantity.patchValue(this.currentProduct.Stocks.Quantity);
  }
  
  create() {

    if (this.form.valid) {
      let qt = this.form.value.Quantity? this.form.value.Quantity : 0;
      let curr = this.currentProduct.Stocks.Quantity;

      if (this.isStockin){
        this.currentProduct.Stocks.Quantity = curr + qt;
      }else{
        this.currentProduct.Stocks.Quantity =  curr - qt;
      }

      const bodyData = {

        StockHistory: {
          Product: {
            Id: this.form.value.Id,
            Name: this.form.value.Product,
            Category: this.form.value.Category
          },
          Type: this.isStockin ? "Stock In" : this.isConsume? 'Consume': "Stock Out",
          CurrentQuantity: this.form.value.CurrentQuantity,
          Quantity: this.form.value.Quantity,
          User: this.currentUser
        },
        Product: this.currentProduct
      }

      this.http.post(this.mdb.getProductEndpoint(queryType.STOCK),bodyData, {
        responseType: 'json', headers: this.mdb.headers
      }).subscribe((result:any)=>{

        console.log(result)

      })



    }

  }



}
