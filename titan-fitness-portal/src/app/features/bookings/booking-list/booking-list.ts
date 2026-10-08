import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface BookingRecord {
  id: string;
  memberName: string;
  className: string;
  bookingDate: string;
  status: 'Confirmed' | 'Cancelled' | 'Attended';
}

@Pipe({
  name: 'searchHighlight',
  standalone: true
})
export class SearchHighlightPipe implements PipeTransform {
  transform(value: string, searchTerm: string): string {
    if (!value || !searchTerm) {
      return value;
    }

    const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');

    return value.replace(regex, '<mark>$1</mark>');
  }
}

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SearchHighlightPipe
  ],
  templateUrl: './booking-list.html',
  styleUrls: ['./booking-list.css']
})
export class BookingListComponent implements OnInit {
  searchTerm: string = '';
  selectedStatus: string = 'All';

  bookings: BookingRecord[] = [
    { id: 'bk-101', memberName: 'Alex Rivera', className: 'HIIT & Endurance', bookingDate: '2023-10-24', status: 'Confirmed' },
    { id: 'bk-102', memberName: 'Marcus Vance', className: 'Morning Flow Yoga', bookingDate: '2023-10-24', status: 'Attended' },
    { id: 'bk-103', memberName: 'Sarah Jenkins', className: 'Spin & RPM Cycle', bookingDate: '2023-10-25', status: 'Confirmed' },
    { id: 'bk-104', memberName: 'David Miller', className: 'Power Weightlifting', bookingDate: '2023-10-22', status: 'Cancelled' }
  ];

  constructor() {}

  ngOnInit(): void {}

  get filteredBookings(): BookingRecord[] {
    return this.bookings.filter(b => {
      const matchesSearch = b.memberName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            b.className.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            b.id.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.selectedStatus === 'All' || b.status === this.selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }

  cancelBooking(booking: BookingRecord): void {
    if (confirm(`Are you sure you want to cancel booking ${booking.id}?`)) {
      booking.status = 'Cancelled';
    }
  }
}