import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pos-calc',
  templateUrl: './pos-calc.component.html',
  styleUrls: ['./pos-calc.component.scss']
})
export class PosCalcComponent {
  
  @ViewChild('yourInput', {static: false}) yourInput: ElementRef;

  form: FormGroup = new FormGroup({
   quantity: new FormControl("",Validators.required)
  })

  addQtty(value:any ){

  }

  clearQtty(){

  }

  onBlur(event:any) {

    this.yourInput.nativeElement.focus()
    
  }

}
