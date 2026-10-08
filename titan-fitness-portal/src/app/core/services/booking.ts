import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Booking {
  id?: string;
  memberId: string;
  classId: string;
  bookingDate: string;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private apiUrl = 'https://localhost:7123/api/Bookings';

  constructor(private http: HttpClient) {}

  createBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }

  cancelBooking(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}