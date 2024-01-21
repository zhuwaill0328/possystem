import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../shared/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MongodbService, queryType } from '../shared/mongodb.service';
import Swal from 'sweetalert2';

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
  isBarcode: boolean =false;

  form = new FormGroup({
    Barcode: new FormControl(''),
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
    if(this.data.withBarcode == true) this.isBarcode = true;
    this.currentProduct = this.data;

    if(!this.isBarcode){
      this.loadData();
    }else{
      this.getData();
    }
    
   
  }

  checkProduct(barcode:any){
    const code: string = barcode.target.value.trim()

    let item:any = this.productlist.filter( (item:any)=> item.Serials.Barcode == code);

     if(item.length == 1){
        this.currentProduct = item[0];
        this.currentProduct.Type = "Stock In"
        this.loadData()
        barcode.target.value = ""
     }
  
  }


  resetFields(){
    this.currentProduct = {}
           this.form.controls["Barcode"].patchValue("")
           this.form.controls["Id"].patchValue("")
           this.form.controls["Product"].patchValue("")
           this.form.controls["Id"].patchValue("")
           this.form.controls["CurrentQuantity"].patchValue(0)
           this.form.controls["Quantity"].patchValue(0)
  }
  
  productlist:any = []

  async getData() {
    this.productlist = []

    this.http.get(this.mdb.getProductEndpoint(queryType.READ)  ,{ responseType: 'json', headers: this.mdb.headers }).subscribe((data: any) => {
    
      if(data.status){
          this.productlist =data.data
      }
    
    })

  }

  loadData(){
    console.log(this.currentProduct)
    this.form.controls.Id.patchValue(this.currentProduct._id);
    this.form.controls.Product.patchValue(this.currentProduct.Name);
    this.form.controls.Category.patchValue(this.currentProduct.Category);
    this.form.controls.CurrentQuantity.patchValue(this.currentProduct.Stocks.Quantity);
  }
  
  create() {


    if(this.form.controls['Quantity'].value == 0){
      Swal.fire("Please input number of items to be added!")
      return;
    }
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

        if(!this.isBarcode){
          this.dialogRef.close();
        }else{
          this.resetFields();
        }

       

      })



    }

  }



}
