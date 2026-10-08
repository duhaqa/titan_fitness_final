import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

export interface MemberFreezeDetail {
  id: string;
  name: string;
  memberCode: string;
  planName: string;
  status: string;
  currentEndDate: Date;
}

@Component({
  selector: 'app-freeze-membership',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './freeze-membership.html',
  styleUrls: ['./freeze-membership.css']
})
export class FreezeMembershipComponent implements OnInit {
  memberId: string = '';
  
  member: MemberFreezeDetail = {
    id: '80340',
    name: 'Marcus Vance',
    memberCode: '#TF-80340',
    planName: 'Annual Premium Plan',
    status: 'ACTIVE',
    currentEndDate: new Date(2024, 9, 12)
  };

  // Form Controls
  startDate: string = '2023-11-01';
  selectedDurationMonths: number = 2;
  selectedReason: string = 'Extended Travel';
  additionalNotes: string = '';

  reasons: string[] = [
    'Extended Travel',
    'Medical Condition',
    'Personal Reasons',
    'Other'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

 ngOnInit(): void {
  this.memberId = this.route.snapshot.paramMap.get('id') || '80340';

  const savedMember = localStorage.getItem('selectedFreezeMember');

  if (savedMember) {
    const selectedMember = JSON.parse(savedMember);

    this.member = {
      ...this.member,
      id: selectedMember.id,
      name: selectedMember.name,
      memberCode: selectedMember.memberCode,
      status: selectedMember.status.toUpperCase()
    };
  }
}

  selectDuration(months: number): void {
    this.selectedDurationMonths = months;
  }

  get calculatedNewEndDate(): Date {
    const newDate = new Date(this.member.currentEndDate);
    newDate.setMonth(newDate.getMonth() + this.selectedDurationMonths);
    return newDate;
  }

  onConfirmFreeze(): void {
    const freezeData = {
      memberId: this.memberId,
      startDate: this.startDate,
      duration: this.selectedDurationMonths,
      reason: this.selectedReason,
      notes: this.additionalNotes,
      newEndDate: this.calculatedNewEndDate
    };

    console.log('Freeze Confirmed:', freezeData);

    localStorage.setItem(
      `freeze_${this.memberId}`,
      JSON.stringify({
        ...freezeData,
        status: 'Frozen'
      })
    );

    this.router.navigate(['/members']);
  }

  onCancel(): void {
    this.router.navigate(['/members', this.memberId]);
  }

  onBackToProfile(): void {
    this.router.navigate(['/members', this.memberId]);
  }
}