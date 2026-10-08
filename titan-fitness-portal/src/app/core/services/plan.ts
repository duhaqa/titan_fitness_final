import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PlanDto, PlanRequest } from '../models/plan.models';

@Injectable({ providedIn: 'root' })
export class PlanService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/Plans`;

  getPlans(): Observable<PlanDto[]> {
    const params = new HttpParams().set('pageNumber', 1).set('pageSize', 1000);
    return this.http.get<PlanDto[]>(this.base, { params });
  }

  getPlan(id: number): Observable<PlanDto> {
    return this.http.get<PlanDto>(`${this.base}/${id}`);
  }

  createPlan(body: PlanRequest): Observable<unknown> {
    return this.http.post<unknown>(this.base, body);
  }

  updatePlan(id: number, body: PlanRequest): Observable<unknown> {
    return this.http.put<unknown>(`${this.base}/${id}`, body);
  }
}