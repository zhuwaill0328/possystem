import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MongodbService, queryType } from '../shared/mongodb.service';

@Component({
  selector: 'app-pos-system',
  templateUrl: './pos-system.component.html',
  styleUrls: ['./pos-system.component.scss']
})
export class PosSystemComponent {

  constructor(private http: HttpClient,private mdb: MongodbService){
    this.getSystemInfo()
  }

  

  gcashRates = new FormGroup({
    id: new FormControl(''),
    company: new FormControl('',Validators.required),
    rates: new FormArray([])
  })



  get gcashRatesarray(){
    return this.gcashRates.get('rates') as FormArray;
  }

  addGashrates(withObjec:any = null){
    this.gcashRatesarray.push(this.buildEntity(withObjec))
  }

  removeGcashRates(index:number){
    this.gcashRatesarray.removeAt(index)
  }




  buildEntity(existingObj: any = null){

    let rates = new FormGroup({
       amount: new FormControl( existingObj?.amount || '',Validators.required),
       fee: new FormControl(existingObj?.fee || '',Validators.required)
    })

    return rates;
  }

  systemInfo:any = []
   getSystemInfo() {

    this.http.get(this.mdb.getSystemEndPoint(queryType.READ), { responseType: 'json', headers: this.mdb.headers }).subscribe((data: any) => {

    this.systemInfo = data.data

    if(this.systemInfo.length > 0){
      let sys = this.systemInfo[0]

      this.gcashRates.controls['company']?.patchValue(sys.Company)

      for(var x of sys.GcashRates){
        this.addGashrates(x)
      }
     

    }

    })

  }

  updateSystemInfo(){
   

    let bodyhtml = {
      Id:  this.gcashRates.controls['id'].value,
      Company: this.gcashRates.controls['company'].value,
      GcashRates: this.gcashRatesarray.value,
      Upsert: true
    }

    this.saveData(bodyhtml)

   
  }
  saveData(bodyData:any){
    this.http.post(this.mdb.getSystemEndPoint(queryType.UPDATE), bodyData, { responseType: 'json', headers: this.mdb.headers })
    .subscribe((data: any) => {
      alert(data.status)

    })
  }

}
