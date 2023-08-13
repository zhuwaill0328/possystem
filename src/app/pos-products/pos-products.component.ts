import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MongodbService, queryType } from '../shared/mongodb.service';
import { validateVerticalPosition } from '@angular/cdk/overlay';

@Component({
  selector: 'app-pos-products',
  templateUrl: './pos-products.component.html',
  styleUrls: ['./pos-products.component.scss']
})
export class POSProductsComponent {
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: any = ['category', 'name', 'stocks', 'cost', 'price', 'status','actions'];

  datasource: MatTableDataSource<any> = new MatTableDataSource<any>;


  error: boolean = false;
  form = new FormGroup({
    category: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    quantity: new FormControl('0', Validators.required),
    soldby: new FormControl('Quantity', Validators.required),
    weight: new FormControl('0',Validators.required),
    threshold: new FormControl('0', Validators.required),
    barcode: new FormControl('', Validators.required),
    sku: new FormControl(''),
    price: new FormControl('0.00', Validators.required),
    cost: new FormControl('0.00', Validators.required),
    image: new FormControl('')
  })

  defaultAlert: any = [{
    type: '',
    msg: '',
    timeout: 1
  }];
  results: any = []
  categories: any = []

  constructor(private http: HttpClient, private mdb: MongodbService) {

  }
  ngAfterViewInit(): void {



  }

  getProductStatus(data:any){

    if(data.Stocks.Quantity == 0){

      return "Out of Stock";
    }else if( data.Stocks.Quantity <= data.Stocks.Threshold){
      return "Low Stocks"
    }else{
      return 'Available'
    }

  }

  selectedFile: any = null;

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;

  }
  ngOnInit(): void {
    this.loadCategories();
    this.getData();
  }

  loadCategories() {

    this.categories = [];
    this.http.get(this.mdb.getCategoryEndPoint(queryType.READ), { responseType: 'json', headers: this.mdb.headers }).subscribe((data: any) => {

      this.categories = data.data;
      console.log(this.categories)

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

  updating: boolean = false;
  datatoupdate: any;

  edit(data: any) {

    
    this.form.controls.category.patchValue(data.Category)
    this.form.controls.name.patchValue(data.Name)
    this.form.controls.quantity.patchValue(data.Stocks.Quantity)
    this.form.controls.soldby.patchValue(data.Stocks.Soldby)
    if(data.Stocks.Weight){
      this.form.controls.weight.patchValue(data.Stocks.Weight)
  
    }
     this.form.controls.threshold.patchValue(data.Stocks.Threshold)
    this.form.controls.barcode.patchValue(data.Serials.Barcode)
    this.form.controls.sku.patchValue(data.Serials.SKU)
    this.form.controls.price.patchValue(data.Price)
    this.form.controls.cost.patchValue(data.Cost)
    this.form.controls.image.patchValue(data.image)
    this.updating = true;
    this.selectedFile = data.image
    this.datatoupdate = data;

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
    this.panelOpenState = false;

    this.getData();
    this.form.reset();
    this.form.markAsUntouched();
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
      Category: this.form.value.category,
      Name: this.form.value.name,
      Stocks: {
        Soldby: this.form.value.soldby,
        Quantity: this.form.value.quantity,
        Weight: this.form.value.weight ? this.form.value.weight : '0',
        Threshold: this.form.value.threshold
      },
      Serials: {
        Barcode: this.form.value.barcode,
        SKU: this.form.value.sku
      },
      Price: this.form.value.price,
      Cost: this.form.value.cost,
      Image: this.form.value.image

    }
    console.log(bodyData)
    this.http.post(this.mdb.getProductEndpoint(queryType.INSERT), bodyData, { responseType: 'json', headers: this.mdb.headers }).subscribe((data: any) => {

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
      Category: this.form.value.category,
      Name: this.form.value.name,
      Stocks: {
        Soldby: this.form.value.soldby,
        Quantity: this.form.value.quantity,
        Weight: this.form.value.weight? this.form.value.weight : '0',
        Threshold: this.form.value.threshold
      },
      Serials: {
        Barcode: this.form.value.barcode,
        SKU: this.form.value.sku
      },
      Price: this.form.value.price,
      Cost: this.form.value.cost,
      Image: this.selectedFile?.name

    }

    console.log(bodyData)

    this.http.patch(this.mdb.getProductEndpoint(queryType.UPDATE), bodyData, { responseType: 'json', headers: this.mdb.headers })
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

  async create() {

    if (this.form.valid) {

      if (this.updating) {
        this.updateData(this.datatoupdate);
      } else {
        this.addData();
      }

    } else {

      this.defaultAlert = []

      Object.keys(this.form.controls).forEach(key => {

      })

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
