import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pos-customer-display',
  templateUrl: './pos-customer-display.component.html',
  styleUrls: ['./pos-customer-display.component.scss']
})
export class PosCustomerDisplayComponent {

  constructor(
    public dialogref: MatDialogRef<PosCustomerDisplayComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any
    
  ){}

}
