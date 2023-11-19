import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CustomerCrudComponent } from 'src/app/pos-customer/customer-crud/customer-crud.component';
import { MongodbService, queryType } from 'src/app/shared/mongodb.service';

@Component({
  selector: 'app-pos-select-customer',
  templateUrl: './pos-select-customer.component.html',
  styleUrls: ['./pos-select-customer.component.scss']
})
export class PosSelectCustomerComponent  implements OnInit{
  constructor(
    private mdb: MongodbService,
    private http: HttpClient,
    public dialogref: MatDialogRef<PosSelectCustomerComponent>, @Inject(MAT_DIALOG_DATA) public data: any
 
  
  ){

  }

walkinCustomer:boolean =true

setSelection(result:boolean){
  this.walkinCustomer =result

  if(result){
     const data = {
       submitFlag: true,
       data: {
         Name: 'Walk-in',
         Phone: 'Walk-in'
       }
     }

     this.dialogref.close(data)
  }
}



customer:any 
  selected(customer:any){
    const data = {
      submitFlag: true,
      data: customer
    }
    this.dialogref.close(data)
  }
 
 search(control: any) {
  const filter = control.target.value;
  this.dataSource = this.storedResult.filter((data: any) =>
    data.Name.toLowerCase().includes(filter.toLowerCase()) || data.Phonee == filter);
}
  dataSource:any = []
  storedResult :any = []
  getCustomers(){
    this.http.get(this.mdb.getCustomerEndpoint(queryType.READ), { responseType: 'json', headers: this.mdb.headers})
    .subscribe((data:any)=>{
        this.dataSource =data.data
        this.storedResult =data.data
    })
  }

  ngOnInit(): void {
    this.getCustomers()
  }


  
}
