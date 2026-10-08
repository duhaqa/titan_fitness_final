import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

export interface ActivityItem {
  id: string;
  type: 'check-in' | 'class';
  title: string;
  subtitle: string;
  date: string;
  time: string;
}

export interface MemberProfile {
  id: string;
  memberCode: string;
  name: string;
  avatarUrl?: string;
  status: 'Active' | 'Frozen' | 'Expired';
  email: string;
  phone: string;
  address: string;
  joinedDate: string;
  planName: string;
  planPrice: number;
  planBillingCycle: string;
  planRenewalDate: string;
  freezesUsed: number;
  freezesTotal: number;
  guestPassesUsed: number;
  guestPassesTotal: number;
  recentActivities: ActivityItem[];
}

@Component({
  selector: 'app-member-profile',
  templateUrl: './member-profile.html',
  styleUrls: ['./member-profile.css']
})
export class MemberProfileComponent implements OnInit {
  memberId: string = '';
  
  member: MemberProfile = {
    id: '8492-AX',
    memberCode: '#8492-AX',
    name: 'Alex Rivera',
    avatarUrl: '',
    status: 'Active',
    email: 'alex.rivera@email.com',
    phone: '+1 (555) 019-2834',
    address: '142 West Metro Dr, Apt 4B',
    joinedDate: 'Oct 12, 2022',
    planName: 'Annual Pro Plan',
    planPrice: 899,
    planBillingCycle: 'year',
    planRenewalDate: 'Oct 12, 2024',
    freezesUsed: 2,
    freezesTotal: 3,
    guestPassesUsed: 3,
    guestPassesTotal: 5,
    recentActivities: [
      {
        id: 'a1',
        type: 'check-in',
        title: 'Facility Check-in',
        subtitle: 'Downtown Branch',
        date: 'Today',
        time: '08:45 AM'
      },
      {
        id: 'a2',
        type: 'class',
        title: 'Class Attendance',
        subtitle: 'HIIT Bootcamp with Sarah',
        date: 'Oct 18, 2023',
        time: '05:30 PM'
      },
      {
        id: 'a3',
        type: 'check-in',
        title: 'Facility Check-in',
        subtitle: 'Downtown Branch',
        date: 'Oct 16, 2023',
        time: '06:00 AM'
      }
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.memberId = this.route.snapshot.paramMap.get('id') || '8492-AX';
  }

  onBackToList(): void {
    this.router.navigate(['/members']);
  }

  onEditProfile(): void {
    console.log('Edit profile clicked');
  }

  onFreezeMembership(): void {
    this.router.navigate(['/members', this.memberId, 'freeze']);
  }

  onViewAllActivity(): void {
    console.log('View all activity clicked');
  }

  getFreezesRemaining(): number {
    return this.member.freezesTotal - this.member.freezesUsed;
  }

  getGuestPassesRemaining(): number {
    return this.member.guestPassesTotal - this.member.guestPassesUsed;
  }

  getFreezePercentage(): number {
    return (this.member.freezesUsed / this.member.freezesTotal) * 100;
  }

  getGuestPassPercentage(): number {
    return (this.member.guestPassesUsed / this.member.guestPassesTotal) * 100;
  }
}