import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Trainer {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  weeklyClasses: number;
  status: 'Active' | 'On Leave' | 'Inactive';
  email: string;
  phone: string;
}

@Injectable({ providedIn: 'root' })
export class TrainerService {
  private apiUrl = 'https://localhost:7123/api/Trainers';

  constructor(private http: HttpClient) {}

  getTrainers(): Observable<Trainer[]> {
    return this.http.get<Trainer[]>(this.apiUrl);
  }

  addTrainer(trainer: Partial<Trainer>): Observable<Trainer> {
    return this.http.post<Trainer>(this.apiUrl, trainer);
  }
}