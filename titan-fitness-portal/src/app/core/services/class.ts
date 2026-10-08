import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FitnessClass {
  id: string;
  title: string;
  trainerName: string;
  studio: string;
  capacity: number;
  bookedSeats: number;
  startTime: string;
  endTime: string;
  status: 'Upcoming' | 'In Progress' | 'Completed';
}

@Injectable({ providedIn: 'root' })
export class ClassService {
  private apiUrl = 'https://localhost:7123/api/Classes';

  constructor(private http: HttpClient) {}

  getClasses(): Observable<FitnessClass[]> {
    return this.http.get<FitnessClass[]>(this.apiUrl);
  }

  addClass(fitnessClass: Partial<FitnessClass>): Observable<FitnessClass> {
    return this.http.post<FitnessClass>(this.apiUrl, fitnessClass);
  }
}