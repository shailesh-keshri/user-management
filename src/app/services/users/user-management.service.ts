// user-management.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserModel } from '../../models/userModel';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {


  private userDataSubject = new BehaviorSubject<UserModel[]>([]);
  userData$ = this.userDataSubject.asObservable();
  
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  createUser(user: UserModel): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/users/createUser`, user);
  }

  updateUser(user: UserModel): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/users/updateUser`, user);
  }
  
  assignRole(uid: string, roles: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/users/assignRole`, { uid, roles });
  }

  removeUser(uid: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/users/removeUser`, { body: { uid } });
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/users/getAllUsers`);
  }

  getUser(uid: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/users/getUser/${uid}`);
  }

  setUserData(data: UserModel[]) {
    this.userDataSubject.next(data);
  }
}
