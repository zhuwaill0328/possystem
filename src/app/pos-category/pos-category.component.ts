import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MongodbService } from '../shared/mongodb.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { queryType } from '../shared/mongodb.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { GlobalfunctionsService } from '../shared/globalfunctions.service';
@Component({
  selector: 'app-pos-category',
  templateUrl: './pos-category.component.html',
  styleUrls: ['./pos-category.component.scss']
})
export class POSCategoryComponent implements OnInit, AfterViewInit {

  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: any = ['category', 'actions'];

  datasource: MatTableDataSource<any> = new MatTableDataSource<any>;


  error: boolean = false;
  form = new FormGroup({
    Name: new FormControl('', Validators.required)
  })

  defaultAlert: any = [{
    type: '',
    msg: '',
    timeout: 1
  }];
  results: any = []


  constructor(private http: HttpClient, private mdb: MongodbService, private dialog: MatDialog,private gf: GlobalfunctionsService) {

  }
  ngAfterViewInit(): void {



  }
  ngOnInit(): void {
    this.getData();
  }

  async getData() {

    this.results = [];
    this.http.get(this.mdb.getCategoryEndPoint(queryType.READ), { responseType: 'json', headers: this.mdb.headers }).subscribe((data: any) => {

      this.results = data.data;
      this.datasource = new MatTableDataSource<any>(this.results);
      this.datasource.paginator = this.paginator;

    })

  }

  updating: boolean = false;
  datatoupdate: any;
  
  edit(data: any) {
    this.updating = true;
    this.form.controls.Name.setValue(data.Name);
    this.datatoupdate = data;
    this.gotoTop();

  }

  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }




  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datasource.filter = filterValue.trim().toLowerCase();
  }


  delete(data: any,dr:any) {

    this.formDirective = dr;

    let dialogresult = this.dialog.open(DialogComponent, {

      data: {
        message: "Delete Category " + data.Name,
        title:  "Are you sure?",
        canceltext: "Cancel",
        confirmtext: "Yes delete",
        flag: false

      }

    })

    dialogresult.afterClosed().subscribe(result => {
      if (result) {

        const bodyData = {
          Id: data._id,
          Name: data.Name
        }

        this.defaultAlert = []
        this.http.delete(this.mdb.getCategoryEndPoint(queryType.DELETE), { body: bodyData, responseType: 'json', headers: this.mdb.headers })
          .subscribe((data: any) => {

            if (data.status) {

              this.reloadPage();
              this.defaultAlert.push({
                type: 'success',
                msg: data.message,
                timeout: 5000,
              });
            } else {
              this.defaultAlert.push({
                type: 'danger',
                msg: data.message,
                timeout: 5000,
              });
            }

          })

      }
    })


  }


  reloadPage() {
    this.getData();
    this.form.reset();
    this.formDirective.resetForm();
    this.form.markAsUntouched();
    this.form.controls.Name.markAsUntouched();
    this.updating = false;
    this.datatoupdate = '';

  }

  addData() {
    this.defaultAlert = []
    const bodyData = {
      Name: this.form.value.Name
    }
    this.http.post(this.mdb.getCategoryEndPoint(queryType.INSERT), bodyData, { responseType: 'json', headers: this.mdb.headers }).subscribe((data: any) => {

      if (data.status) {
        this.reloadPage();
        this.defaultAlert.push({
          type: 'success',
          msg: data.message,
          timeout: 5000,
        });


      }
      else {

        this.defaultAlert.push({
          type: 'danger',
          msg: data.message,
          timeout: 10000,
        });

      }

    });
  }

  updateData(data: any) {
    this.defaultAlert = []
    const bodyData = {
      Id: data._id,
      Name: this.form.value.Name
    }

    console.log(bodyData)

    this.http.patch(this.mdb.getCategoryEndPoint(queryType.UPDATE), bodyData, { responseType: 'json', headers: this.mdb.headers })
      .subscribe((data: any) => {
        if (data.status) {
          this.reloadPage();
          this.defaultAlert.push({
            type: 'success',
            msg: data.message,
            timeout: 5000,
          });


        }
        else {

          this.defaultAlert.push({
            type: 'danger',
            msg: data.message,
            timeout: 10000,
          });

        }
      })


  }

  formDirective: any;
  async create(dr: any) {

    if (this.form.valid) {
      this.formDirective = dr;

      if (this.updating) {
        this.updateData(this.datatoupdate);
      } else {
        this.addData();
      }

    } else {

      this.defaultAlert.push({
        type: 'danger',
        msg: "Category name is required!",
        timeout: 10000,
      });

    }

  }

}
