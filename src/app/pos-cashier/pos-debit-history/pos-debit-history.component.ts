import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MongodbService } from 'src/app/shared/mongodb.service';
import { PosDebitRepaymentComponent } from '../pos-debit-repayment/pos-debit-repayment.component';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-pos-debit-history',
  templateUrl: './pos-debit-history.component.html',
  styleUrls: ['./pos-debit-history.component.scss']
})
export class PosDebitHistoryComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  //dtTrigger: Subject<any> = new Subject<any>();
  dtTrigger1: Subject<any> = new Subject<any>();


  history: any = []
  customer:any 
  constructor(private http: HttpClient,
    private mdb : MongodbService,
    public dialogref: MatDialogRef<PosDebitHistoryComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any)
      {
       this.history = this.data.history
       this.customer = this.data.customer
      }
      
      close(){
        this.dialogref.close()
      }

  ngOnInit(): void {
    this.dtOptions = {
      processing: true,
      lengthMenu: [20, 50, 100],
      destroy: true,
      pagingType: 'full_numbers',
      pageLength: 20,
      searching: true,
      order:[3,'desc'],
    }
  }

      ngAfterViewInit(): void {
        //this.dtTrigger.next();
        this.dtTrigger1.next(null);
    
      }

      rerender(): void {

        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger1.next(null);
        })
    
      }
}
