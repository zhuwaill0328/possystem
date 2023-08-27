import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit  {


  constructor( public dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any){}
  
  message: any = this.data.message;
  title:any = this.data.title;
  canceltext: any =this.data.canceltext;
  confirmtext:any =this.data.confirmtext;


  ngOnInit(): void {
   
    
  }
  submit():void{
   
    this.dialogRef.close(true);
  }

}
