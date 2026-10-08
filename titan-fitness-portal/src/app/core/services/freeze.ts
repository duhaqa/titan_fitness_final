import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FreezeRequest {
  id?: string;
  memberId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status?: 'Pending' | 'Approved' | 'Rejected';
}

@Injectable({ providedIn: 'root' })
export class FreezeService {
  private apiUrl = 'https://localhost:7123/api/FreezeRequests';

  constructor(private http: HttpClient) {}

  submitRequest(request: FreezeRequest): Observable<FreezeRequest> {
    return this.http.post<FreezeRequest>(this.apiUrl, request);
  }

  getRequests(): Observable<FreezeRequest[]> {
    return this.http.get<FreezeRequest[]>(this.apiUrl);
  }
}