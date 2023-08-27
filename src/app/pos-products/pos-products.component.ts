import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MongodbService, queryType } from '../shared/mongodb.service';
import { validateVerticalPosition } from '@angular/cdk/overlay';
import { environment } from 'src/environments/environment.development';
import { response } from 'express';
import { map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PosInoutmodalComponent } from '../pos-inoutmodal/pos-inoutmodal.component';

@Component({
  selector: 'app-pos-products',
  templateUrl: './pos-products.component.html',
  styleUrls: ['./pos-products.component.scss']
})
export class POSProductsComponent {
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: any = ['category', 'name', 'stocks', 'cost', 'price', 'status', 'actions'];

  datasource: MatTableDataSource<any> = new MatTableDataSource<any>;


  error: boolean = false;
  form = new FormGroup({
    category: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    quantity: new FormControl(0, Validators.min(1)),
    soldby: new FormControl('Quantity', Validators.required),
    weight: new FormControl('0', Validators.required),
    threshold: new FormControl('0', Validators.required),
    barcode: new FormControl('', Validators.required),
    sku: new FormControl(''),
    price: new FormControl(0.00, Validators.min(1)),
    cost: new FormControl(0.00, Validators.min(1)),
    image: new FormControl(),
    unit: new FormControl('Kg', Validators.required)
  })

  defaultAlert: any = [{
    type: '',
    msg: '',
    timeout: 1
  }];
  results: any = []
  categories: any = []

  constructor(private dialog: MatDialog, private http: HttpClient, private mdb: MongodbService) {

  }
  ngAfterViewInit(): void {

  }

  getProductStatus(data: any) {

    if (data.Stocks.Quantity == 0) {

      return "Out of Stock";
    } else if (data.Stocks.Quantity <= data.Stocks.Threshold) {
      return "Low on Stocks"
    } else {
      return 'Available'
    }

  }

  selectedFile: any;
  selectedFileName: any = "";
  imgurl: any;

  onFileSelected(event: any): void {

    if (!event.target.files[0] || event.target.files[0].length == 0) {

      this.defaultAlert.push({
        type: 'danger',
        msg: "You must select an image",
        timeout: 10000,
      });
      return;
    }
    var mimeType = event.target.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.defaultAlert.push({
        type: 'danger',
        msg: "File not supported. Only Images are supported.",
        timeout: 10000,
      });
      return;
    }

    this.selectedFile = event.target.files[0] ?? null;
    this.selectedFileName = this.selectedFile?.name
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      this.imgurl = reader.result;
    }
  }

  uploadImage() {
    const formdata = new FormData();
    formdata.append('image', this.selectedFile)
    const bodyData = {
      filename: Date.now()
    }
    this.http.post(environment.EndPoint + "upload", formdata)
      .subscribe((res) => {
        this.selectedFileName = "";
        this.selectedFile = null;
      });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.getData();
  }

  loadCategories() {

    this.categories = [];
    this.http.get(this.mdb.getCategoryEndPoint(queryType.READ), { responseType: 'json', headers: this.mdb.headers }).subscribe((data: any) => {

      this.categories = data.data;

    })

  }

  async getData() {

    this.results = [];
    this.http.get(this.mdb.getProductEndpoint(queryType.READ), { responseType: 'json', headers: this.mdb.headers }).subscribe((data: any) => {

      this.results = data.data;
      this.datasource = new MatTableDataSource<any>(this.results);
      this.datasource.paginator = this.paginator;

    })

  }

  editStock(row: any, isadd: boolean) {
    if (isadd) row.Type = "Stock In";
    else row.Type = "Stock out";

    let dialogRef = this.dialog.open(PosInoutmodalComponent, {
      width: '20vw',
      data: row

    })

    dialogRef.afterClosed().subscribe(result => {
      this.getData();
    })

  }

  updating: boolean = false;
  datatoupdate: any;

  edit(data: any) {


    this.form.controls.category.patchValue(data.Category)
    this.form.controls.name.patchValue(data.Name)
    this.form.controls.quantity.patchValue(data.Stocks.Quantity)
    this.form.controls.soldby.patchValue(data.Stocks.Soldby)
    if (data.Stocks.Weight) {
      this.form.controls.weight.patchValue(data.Stocks.Weight)

    }
    this.form.controls.threshold.patchValue(data.Stocks.Threshold)
    this.form.controls.barcode.patchValue(data.Serials.Barcode)
    this.form.controls.sku.patchValue(data.Serials.SKU)
    this.form.controls.price.patchValue(data.Price)
    this.form.controls.cost.patchValue(data.Cost)
    this.form.controls.unit.patchValue(data.Stocks.UnitofMeasurement)
    this.updating = true;
    this.selectedFileName = data.Image
    this.datatoupdate = data;

    this.imgurl = "http://localhost:8080/uploads/img_" + data.Image

    this.togglePanel(true);
    this.step = 0;

  }

  panelOpenState: boolean = false;

  togglePanel(data: boolean) {
    this.panelOpenState = data;
  }


  delete(data: any) {

    const bodyData = {
      Id: data._id
    }

    this.defaultAlert = []
    this.http.delete(this.mdb.getProductEndpoint(queryType.DELETE), { body: bodyData, responseType: 'json', headers: this.mdb.headers })
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

    this.getData();
    this.form.reset();
    this.formDirective.resetForm();
    this.imgurl = ""
    this.updating = false;
    this.datatoupdate = '';
    this.form.controls.soldby.patchValue('Quantity');
    this.form.controls.unit.patchValue("Kg");
    this.form.controls.weight.patchValue('0');
    this.form.controls.quantity.patchValue(0);
    this.form.controls.threshold.patchValue('0');
    this.form.controls.price.patchValue(0.00);
    this.form.controls.cost.patchValue(0.00);

    //window.location.reload();
  }

  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  checkqtype() {
    if (this.form.value.soldby == "Quantity") {
      return 'Kg';
    } else {
      return this.form.value.unit;
    }
  }

  addData() {
    this.defaultAlert = []
    const bodyData = {
      Category: this.form.value.category,
      Name: this.form.value.name,
      Stocks: {
        Soldby: this.form.value.soldby,
        Quantity: this.form.value.quantity,
        Weight: this.form.value.weight ? this.form.value.weight : '0',
        Threshold: this.form.value.threshold,
        UnitofMeasurement: this.checkqtype()
      },
      Serials: {
        Barcode: this.form.value.barcode,
        SKU: this.form.value.sku
      },
      Price: this.form.value.price,
      Cost: this.form.value.cost,
      Image: this.selectedFileName

    }

    this.http.post(this.mdb.getProductEndpoint(queryType.INSERT), bodyData, { responseType: 'json', headers: this.mdb.headers }).subscribe((data: any) => {

      if (data.status) {
        this.uploadImage();
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
      Category: this.form.value.category,
      Name: this.form.value.name,
      Stocks: {
        Soldby: this.form.value.soldby,
        Quantity: this.form.value.quantity,
        Weight: this.form.value.weight ? this.form.value.weight : '0',
        Threshold: this.form.value.threshold,
        UnitofMeasurement: this.checkqtype()
      },
      Serials: {
        Barcode: this.form.value.barcode,
        SKU: this.form.value.sku
      },
      Price: this.form.value.price,
      Cost: this.form.value.cost,
      Image: this.selectedFileName

    }

    this.http.patch(this.mdb.getProductEndpoint(queryType.UPDATE), bodyData, { responseType: 'json', headers: this.mdb.headers })
      .subscribe((data: any) => {
        if (data.status) {

          if (this.selectedFileName) {
            this.uploadImage()
          }

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
      let cost: any = this.form.value.cost;
      let price: any = this.form.value.price;
      this.formDirective = dr
      if (cost > price) {
        this.defaultAlert.push({
          type: 'danger',
          msg: "Invalid product price. It must be greater than product cost.",
          timeout: 10000,
        });
        return;
      }

      if (this.updating) {
        this.updateData(this.datatoupdate);
      } else {
        this.addData();
      }

    } else {

      this.defaultAlert = []

      Object.keys(this.form.controls).forEach(key => {
        if (!this.form.get(key)?.valid) {
          this.defaultAlert.push({
            type: 'danger',
            msg: key + " is required!",
            timeout: 10000,
          });

        }


      })



    }

  }

}
