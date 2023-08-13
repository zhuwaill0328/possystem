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
  READ = 4
    
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

  getProductEndpoint(action: queryType){

    switch(action){
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
      default:
        return environment.EndPoint + "product/get";

  }

  }



 



}
