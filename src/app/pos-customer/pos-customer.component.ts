import { Component, Inject, OnInit } from '@angular/core';
import { MongodbService, queryType } from '../shared/mongodb.service';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CustomerCrudComponent } from './customer-crud/customer-crud.component';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-pos-customer',
  templateUrl: './pos-customer.component.html',
  styleUrls: ['./pos-customer.component.scss']
})
export class POSCustomerComponent implements OnInit {

  constructor(
    private mdb: MongodbService,
    private http: HttpClient,
    private dialog:MatDialog,
  public dialogref: MatDialogRef<POSCustomerComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any
    
  ){

  }

customer:any 
  selected(customer:any){
    this.customer =customer
    this.dialogref.close(this.customer)
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

  updateCustomer(customer:any){
    let result = this.dialog.open(CustomerCrudComponent,{
       data:{
        customer : customer
       }
    });

    result.afterClosed().subscribe(()=>{
      this.getCustomers()
    })
  }
  createCustomer(){
    let result = this.dialog.open(CustomerCrudComponent,{
       
    });

    result.afterClosed().subscribe(()=>{
      this.getCustomers()
    })
  }

  

}
