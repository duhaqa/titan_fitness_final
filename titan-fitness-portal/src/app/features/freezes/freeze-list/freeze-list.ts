import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FreezeRequest {
  id: string;
  memberName: string;
  membershipType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

@Component({
  selector: 'app-freeze-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './freeze-list.html',
  styleUrls: ['./freeze-list.css']
})
export class FreezeListComponent implements OnInit {
  searchTerm: string = '';
  selectedStatus: string = 'All';

  freezes: FreezeRequest[] = [
    {
      id: 'FRZ-101',
      memberName: 'Alex Rivera',
      membershipType: 'VIP Annual',
      startDate: '2026-10-10',
      endDate: '2026-10-25',
      reason: 'Travel / Vacation',
      status: 'Pending'
    },
    {
      id: 'FRZ-102',
      memberName: 'Sarah Jenkins',
      membershipType: '3 Months Standard',
      startDate: '2026-10-01',
      endDate: '2026-10-15',
      reason: 'Medical / Injury',
      status: 'Approved'
    },
    {
      id: 'FRZ-103',
      memberName: 'Marcus Vance',
      membershipType: 'Monthly Pass',
      startDate: '2026-09-15',
      endDate: '2026-09-22',
      reason: 'Personal Reasons',
      status: 'Rejected'
    }
  ];

  ngOnInit(): void {}

  get filteredFreezes(): FreezeRequest[] {
    return this.freezes.filter(f => {
      const matchesSearch =
        f.memberName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        f.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        f.reason.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = this.selectedStatus === 'All' || f.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  approveRequest(item: FreezeRequest): void {
    item.status = 'Approved';
  }

  rejectRequest(item: FreezeRequest): void {
    item.status = 'Rejected';
  }
}