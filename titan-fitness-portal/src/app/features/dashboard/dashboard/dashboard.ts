
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface UpcomingClass {
  id: string;
  time: string;
  title: string;
  trainer: string;
  studio: string;
  enrolledCount: number;
  totalCapacity: number;
  status: 'Active' | 'Upcoming' | 'Full';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  currentBranch: string = 'Downtown Branch';
  checkInsToday: number = 142;
  checkInsPercentage: string = '+12% vs last week';
  activeMembersCount: number = 1240;
  activeMembersNote: string = 'Currently no Over 45';

  upcomingClasses: UpcomingClass[] = [
    {
      id: 'c1',
      time: '09:00 AM',
      title: 'HIIT Blast',
      trainer: 'Sarah J.',
      studio: 'Studio A',
      enrolledCount: 24,
      totalCapacity: 30,
      status: 'Active'
    },
    {
      id: 'c2',
      time: '10:30 AM',
      title: 'Power Yoga',
      trainer: 'Mike T.',
      studio: 'Studio B',
      enrolledCount: 15,
      totalCapacity: 20,
      status: 'Upcoming'
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  onNewCheckIn(): void {
    console.log('Triggering new check-in flow...');
  }

  onNewMember(): void {
    console.log('Navigating to Add Member...');
  }

  onManualCheckIn(): void {
    console.log('Opening manual check-in modal...');
  }

  onRegisterClass(): void {
    console.log('Navigating to class booking...');
  }
}
