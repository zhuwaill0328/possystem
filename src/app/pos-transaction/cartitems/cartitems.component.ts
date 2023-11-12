import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-cartitems',
  templateUrl: './cartitems.component.html',
  styleUrls: ['./cartitems.component.scss']
})
export class CartitemsComponent implements OnInit {
  

  datasource: any = []
  constructor(public dialogref: MatDialogRef<CartitemsComponent>, @Inject(MAT_DIALOG_DATA) public data: any){
   
  }
  ngOnInit(): void {
    this.datasource =this.data
    this.calculateTotals()
  }

  totalQty = 0
  totalPrice=0
  totalCost=0
  totalIncome=0
  calculateTotals(){
    for(var cart of this.datasource){
      this.totalQty+= cart.Qty;
      this.totalPrice+= cart.Qty * cart.Price;
      this.totalCost+= cart.Qty * cart.Cost;
      this.totalIncome+= this.calculateIncome(cart)

    }
  }

  calculateIncome(cart:any){
    const price: number =cart.Price
    const cost:number = cart.Cost
    const qty :number = cart.Qty

    return (price - cost) * qty
  }
}
