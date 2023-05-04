import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser, IUserList } from './users.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private httpClient:HttpClient) { }

  getUsersList() :Observable<IUserList> {
    return this.httpClient.get<IUserList>('https://dummyjson.com/users', {
      headers: {
        'Content-type':'application/json'
      }
    });
  }

  putUserData(userData:IUser):Observable<IUserList> {
    return this.httpClient.post<IUserList>('https://dummyjson.com/users', userData, {
      headers: {
        'Content-type':'application/json'
      }
    });
  }
}
