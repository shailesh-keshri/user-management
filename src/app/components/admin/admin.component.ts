import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  constructor(private http: HttpClient) {}

  createUser(email: string, password: string, role: string) {
    this.http.post('/api/users/createUser', { email, password, role }).subscribe();
  }

  assignRole(uid: string, role: string) {
    this.http.post('/api/users/assignRole', { uid, role }).subscribe();
  }

  removeUser(uid: string) {
    this.http.delete('/api/users/removeUser', { body: { uid } }).subscribe();
  }
}
