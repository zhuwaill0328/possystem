import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { response } from 'express';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment.development';

 export enum queryType {
  INSERT = 0,
  UPDATE = 1,
  DELETE = 2,
  READ = 4,
  STOCK = 5,
  PRODUCTBULK=6,
    
}

@Injectable({
  providedIn: 'root'
})
export class MongodbService {

  //authorization token
  headers = {
    Authorization: 'Bearer ' + sessionStorage.getItem('token')
  }

  getCategoryEndPoint(action: queryType){

    switch(action){
        case queryType.INSERT:
          return environment.EndPoint + "category/create";
          break;
        case queryType.UPDATE:
            return environment.EndPoint + "category/update";
            break;
        case queryType.DELETE:
            return environment.EndPoint + "category/delete";
            break;
        case queryType.READ:
        default:
          return environment.EndPoint + "category/get";

    }
  }

  getSystemEndPoint(action: queryType){
    switch(action){
      
      case queryType.UPDATE:
          return environment.EndPoint + "system/update";
          break;
      case queryType.READ:
      default:
        return environment.EndPoint + "system/get";

  }
  }

  getTransactionEndPoint(action: queryType){

    switch(action){
      case queryType.INSERT:
        return environment.EndPoint + "transaction/create";
        break;
      case queryType.UPDATE:
          return environment.EndPoint + "transaction/update";
          break;
      case queryType.READ:
      default:
        return environment.EndPoint + "transaction/get";

  }
  }

  getUserEndPoint(action: queryType){

    switch(action){
      case queryType.INSERT:
        return environment.EndPoint + "user/create";
        break;
      case queryType.UPDATE:
          return environment.EndPoint + "user/update";
          break;
      case queryType.DELETE:
          return environment.EndPoint + "user/delete";
          break;
      case queryType.READ:
      default:
        return environment.EndPoint + "user/get";

  }

  }

  getStockHistoryEndPoint(){
    return environment.EndPoint + "product/stockhistory";
  }

  getProductEndpoint(action: queryType){

    switch(action){
      case queryType.STOCK:
        return environment.EndPoint + "product/stocks"
        break;
      case queryType.INSERT:
        return environment.EndPoint + "product/create";
        break;
      case queryType.UPDATE:
          return environment.EndPoint + "product/update";
          break;
      case queryType.DELETE:
          return environment.EndPoint + "product/delete";
          break;
      case queryType.READ:
        return environment.EndPoint + "product/get";
        break;
      case queryType.PRODUCTBULK:
          return environment.EndPoint + "product/bulkupdates";
          break;
      default:
        return environment.EndPoint + "product/get";

  }

  }



 



}
