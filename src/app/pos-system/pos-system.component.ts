import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pos-system',
  templateUrl: './pos-system.component.html',
  styleUrls: ['./pos-system.component.scss']
})
export class PosSystemComponent {


  gcashRates = new FormGroup({
    rates: new FormArray([])
  })



  get gcashRatesarray(){
    return this.gcashRates.get('rates') as FormArray;
  }

  addGashrates(){
    this.gcashRatesarray.push(this.buildEntity())
  }




  buildEntity(){

    let rates = new FormGroup({
       amount: new FormControl('',Validators.required),
       fee: new FormControl('',Validators.required)
    })

    return rates;
  }

}
