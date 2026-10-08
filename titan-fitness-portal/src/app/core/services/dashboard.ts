import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardMetrics {
  totalMembers: number;
  activeMembers: number;
  todayClasses: number;
  monthlyRevenue: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = 'https://localhost:7123/api/Dashboard';

  constructor(private http: HttpClient) {}

  getMetrics(): Observable<DashboardMetrics> {
    return this.http.get<DashboardMetrics>(`${this.apiUrl}/metrics`);
  }
}