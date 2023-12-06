import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MongodbService, queryType } from 'src/app/shared/mongodb.service';
import { PosGcashModalComponent } from '../pos-gcash-modal/pos-gcash-modal.component';
import { environment } from 'src/environments/environment.development';
import { empty } from 'rxjs';

@Component({
  selector: 'app-pos-searchproduct',
  templateUrl: './pos-searchproduct.component.html',
  styleUrls: ['./pos-searchproduct.component.scss']
})
export class PosSearchproductComponent implements OnInit {

  constructor(private http:HttpClient,
    private mdb: MongodbService, private fb:FormBuilder,
    public dialogref: MatDialogRef<PosSearchproductComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any
    ){
      
  }
  ngOnInit(): void {
    this.getData();
  }

  products:any =[];
  filteredProduct:any = [];

  async getData() {

   
    this.http.get(this.mdb.getProductEndpoint(queryType.READ),
      { responseType: 'json', headers: this.mdb.headers }).subscribe((data: any) => {
        this.products = [];

        this.products = data.data.filter((data: any) => data.Stocks.Quantity > 0);

      })

  }

  
  filterProducts(value: any) {

    const keyword = value.target.value.toLowerCase().trim()
    if(keyword == '') this.filteredProduct = []
    else this.filteredProduct = this.products.filter((data: any) => 
    data.Name.toLowerCase().includes(value.target.value.toLowerCase())|| data.Serials.Barcode == keyword) ;


  }

  
  getImage(row: any) {

    return environment.EndPoint + "uploads/img_" + row.Image;

  }
  addData(item:any){
    const returnService = {
      submitFlag:true,
      item: item
    }
    this.dialogref.close(returnService);
  }



}
