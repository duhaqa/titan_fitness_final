// user.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'https://localhost:7123/api/Users';
  constructor(private http: HttpClient) {}
  getUsers(): Observable<any[]> { return this.http.get<any[]>(this.apiUrl); }
}