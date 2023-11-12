import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MongodbService, queryType } from '../shared/mongodb.service';

@Component({
  selector: 'app-pos-user',
  templateUrl: './pos-user.component.html',
  styleUrls: ['./pos-user.component.scss']
})
export class POSUserComponent {
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: any = ['name', 'phone', 'role', 'status', 'actions'];

  datasource: MatTableDataSource<any> = new MatTableDataSource<any>;


  error: boolean = false;
  form = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    status: new FormControl('Active', Validators.required),
    role: new FormControl('Standard', Validators.required),
    phone: new FormControl('', [Validators.required,Validators.minLength(11),Validators.maxLength(11)]),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })
  formDirective:any;
  defaultAlert: any = [{
    type: '',
    msg: '',
    timeout: 1
  }];
  results: any = []


  constructor(private http: HttpClient, private mdb: MongodbService) {

  }
  ngAfterViewInit(): void {



  }
  ngOnInit(): void {
    this.getData();
  }

  async getData() {

    this.results = [];
    this.http.get(this.mdb.getUserEndPoint(queryType.READ), { responseType: 'json', headers: this.mdb.headers }).subscribe((data: any) => {

      this.results = data.data;
      this.datasource = new MatTableDataSource<any>(this.results);
      this.datasource.paginator = this.paginator;

    })

  }

  updating: boolean = false;
  datatoupdate: any;
  
  edit(data: any) {
    this.updating = true;
    this.form.controls.firstname.setValue(data.Name.Firstname);
    this.form.controls.lastname.setValue(data.Name.Lastname);
    this.form.controls.username.setValue(data.Username);
    this.form.controls.password.setValue(data.Password);
    this.form.controls.phone.setValue(data.Phone)
    this.form.controls.role.setValue(data.Role);
    this.form.controls.status.setValue(data.Status);
    this.datatoupdate = data;
    this.togglePanel(true);
    this.step = 0;

  }

  panelOpenState: boolean = false;

togglePanel(data:boolean ) {
    this.panelOpenState  = data;
}


  delete(data: any) {

    const bodyData = {
      Id: data._id
    }

    this.defaultAlert = []
    this.http.delete(this.mdb.getUserEndPoint(queryType.DELETE), { body: bodyData, responseType: 'json', headers: this.mdb.headers })
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


  reloadPage() {
    this.panelOpenState =false;

    this.getData();
    this.form.reset();
    this.formDirective.resetForm();
    this.form.markAsUntouched();
    this.form.controls.firstname.markAsUntouched();
    this.updating = false;
    this.datatoupdate = '';
  

  }

  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  addData() {
    this.defaultAlert = []
    const bodyData = {
      Name: {
        Firstname: this.form.value.firstname,
        Lastname: this.form.value.lastname

      },
      Phone: this.form.value.phone,
      Role: this.form.value.role,
      Status: this.form.value.status,
      Username: this.form.value.username,
      Password: this.form.value.password,
      Pin: ''
    }
    //console.log(bodyData)
    this.http.post(this.mdb.getUserEndPoint(queryType.INSERT), bodyData, { responseType: 'json', headers: this.mdb.headers }).subscribe((data: any) => {

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
      Name: {
        Firstname: this.form.value.firstname,
        Lastname: this.form.value.lastname

      },
      Phone: this.form.value.phone,
      Role: this.form.value.role,
      Status: this.form.value.status,
      Username: this.form.value.username,
      Pasword: this.form.value.password
    }

    //console.log(bodyData)

    this.http.patch(this.mdb.getUserEndPoint(queryType.UPDATE), bodyData, { responseType: 'json', headers: this.mdb.headers })
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

  async create(dr:any) {

    if (this.form.valid) {
      this.formDirective = dr;
      if (this.updating) {
        this.updateData(this.datatoupdate);
      } else {
        this.addData();
      }

    } else {

      this.defaultAlert =[]

      Object.keys(this.form.controls).forEach(key => {

      })

      Object.keys(this.form.controls).forEach(key => {
        if(!this.form.get(key)?.valid){
          this.defaultAlert.push({
            type: 'danger',
            msg: key +  " is required!",
            timeout: 10000,
          });

        }

        
      })

      

    }

  }


}
