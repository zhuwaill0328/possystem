import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MongodbService, queryType } from 'src/app/shared/mongodb.service';
import Swal  from 'sweetalert2';
@Component({
  selector: 'app-customer-crud',
  templateUrl: './customer-crud.component.html',
  styleUrls: ['./customer-crud.component.scss']
})
export class CustomerCrudComponent {

  isupdate:boolean =false
  currId: any = ''
  constructor(
private http: HttpClient,
  private mdb: MongodbService,
  public dialogref: MatDialogRef<CustomerCrudComponent>, @Inject(MAT_DIALOG_DATA) public data: any
  ){
    if(this.data){
      this.isupdate =true
      this.patchValues(data.customer)
    }
  }

  patchValues(data:any){
    this.currId =data._id
    this.form.controls['Name'].patchValue(data.Name);
    this.form.controls['Phone'].patchValue(data.Phone);

  }

  form = new FormGroup({
    Name: new FormControl('',Validators.required),
    Phone: new FormControl('',[Validators.required,Validators.minLength(11),Validators.maxLength(11)])
  })

  update(){
    if(this.form.valid){
      const bodyData= {
        Id: this.currId,
        Name: this.form.value.Name,
        Phone: this.form.value.Phone
      }

      this.http.patch(this.mdb.getCustomerEndpoint(queryType.UPDATE),bodyData, {responseType:'json', headers: this.mdb.headers})
      .subscribe((data:any)=>{
        if(data.status){
          Swal.fire(data.message)
          this.dialogref.close()
        }
      })
    }
  }
  save(){
    if(this.form.valid){
      const bodyData= {
        Name: this.form.value.Name,
        Phone: this.form.value.Phone
      }

      this.http.post(this.mdb.getCustomerEndpoint(queryType.INSERT),bodyData, {responseType:'json', headers: this.mdb.headers})
      .subscribe((data:any)=>{
        if(data.status){
          Swal.fire(data.message)
          this.dialogref.close()
        }
      })
    }
  }

}
