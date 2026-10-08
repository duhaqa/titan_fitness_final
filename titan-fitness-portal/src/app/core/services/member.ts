import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'Active' | 'Frozen' | 'Expired';
  planName: string;
  joinedDate: string;
}

@Injectable({ providedIn: 'root' })
export class MemberService {
  private apiUrl = 'https://localhost:7123/api/Members';

  constructor(private http: HttpClient) {}

  getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.apiUrl);
  }

  getMemberById(id: string): Observable<Member> {
    return this.http.get<Member>(`${this.apiUrl}/${id}`);
  }

  addMember(member: Partial<Member>): Observable<Member> {
    return this.http.post<Member>(this.apiUrl, member);
  }

  updateMember(id: string, member: Partial<Member>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, member);
  }
}