import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface BookingForm {
  memberId: string;
  classId: string;
  bookingDate: string;
  notes?: string;
}

@Component({
  selector: 'app-book-session',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './book-session.html',
  styleUrls: ['./book-session.css']
})
export class BookSessionComponent implements OnInit {
  bookingData: BookingForm = {
    memberId: '',
    classId: '',
    bookingDate: new Date().toISOString().substring(0, 10),
    notes: ''
  };

  members = [
    { id: 'm1', name: 'Alex Rivera (m1)' },
    { id: 'm2', name: 'Marcus Vance (m2)' },
    { id: 'm3', name: 'Sarah Jenkins (m3)' }
  ];

  availableClasses = [
    { id: 'c1', title: 'Morning Flow Yoga - 07:00 AM' },
    { id: 'c2', title: 'HIIT & Endurance - 09:30 AM' },
    { id: 'c3', title: 'Spin & RPM Cycle - 05:00 PM' }
  ];

  isSubmitting = false;
  successMessage = '';

  constructor() {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (!this.bookingData.memberId || !this.bookingData.classId) {
      alert('Please fill in all required fields.');
      return;
    }

    this.isSubmitting = true;

    // محاكاة إرسال الحجز للـ Backend
    setTimeout(() => {
      this.isSubmitting = false;
      this.successMessage = 'Session booked successfully!';
      this.resetForm();
    }, 800);
  }

  resetForm(): void {
    this.bookingData = {
      memberId: '',
      classId: '',
      bookingDate: new Date().toISOString().substring(0, 10),
      notes: ''
    };
  }
}