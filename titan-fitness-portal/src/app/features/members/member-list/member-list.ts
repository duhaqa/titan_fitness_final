import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EntityFormComponent } from '../../../shared/components/entity-form/entity-form';

export interface Member {
  id: string;
  memberCode: string;
  name: string;
  initials: string;
  status: 'Active' | 'Frozen' | 'Expired';
  branch: string;
  lastVisit: string;
  showMenu?: boolean;
}

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [CommonModule, EntityFormComponent],
  templateUrl: './member-list.html',
  styleUrls: ['./member-list.css']
})
export class MemberListComponent implements OnInit {
  searchQuery: string = '';
  totalEntries: number = 240;
  currentPage: number = 1;

  showAddMemberForm: boolean = false;

  members: Member[] = [
    {
      id: '1',
      memberCode: '#TF-8532',
      name: 'Jane Doe',
      initials: 'JD',
      status: 'Active',
      branch: 'Downtown',
      lastVisit: 'Today, 08:30 AM',
      showMenu: false
    },
    {
      id: '2',
      memberCode: '#TF-7741',
      name: 'John Smith',
      initials: 'JS',
      status: 'Frozen',
      branch: 'Uptown',
      lastVisit: 'Oct 12, 2023',
      showMenu: false
    },
    {
      id: '3',
      memberCode: '#TF-3012',
      name: 'Alice Williams',
      initials: 'AW',
      status: 'Active',
      branch: 'Downtown',
      lastVisit: 'Yesterday',
      showMenu: false
    },
    {
      id: '4',
      memberCode: '#TF-5521',
      name: 'Robert Johnson',
      initials: 'RJ',
      status: 'Expired',
      branch: 'Downtown',
      lastVisit: 'Sep 01, 2023',
      showMenu: false
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  toggleActionMenu(member: Member, event: MouseEvent): void {
    event.stopPropagation();
    this.members.forEach(m => {
      if (m.id !== member.id) m.showMenu = false;
    });
    member.showMenu = !member.showMenu;
  }

  closeAllMenus(): void {
    this.members.forEach(m => (m.showMenu = false));
  }

  onViewProfile(member: Member): void {
    this.closeAllMenus();
    this.router.navigate(['/members', member.id]);
  }

  onCheckIn(member: Member): void {
    this.closeAllMenus();
    console.log(`Check-in for member: ${member.name}`);
  }

  onBookClass(member: Member): void {
    this.closeAllMenus();
    console.log(`Booking class for member: ${member.name}`);
  }

  onFreezeMembership(member: Member): void {
  this.closeAllMenus();

  localStorage.setItem(
    'selectedFreezeMember',
    JSON.stringify({
      id: member.id,
      name: member.name,
      memberCode: member.memberCode,
      branch: member.branch,
      status: member.status
    })
  );

  this.router.navigate(['/members', member.id, 'freeze']);
}

  onAddMember(): void {
    this.showAddMemberForm = true;
  }

  onMemberSaved(data: any): void {
    const name = data.name || 'New Member';

    const newMember: Member = {
      id: Date.now().toString(),
      memberCode: data.memberCode || `#TF-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name,
      initials: name
        .split(' ')
        .map((part: string) => part.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase(),
      status: 'Active',
      branch: data.branch || 'Downtown',
      lastVisit: 'Never',
      showMenu: false
    };

    this.members.unshift(newMember);
    this.totalEntries++;
    this.showAddMemberForm = false;
  }

  onMemberFormCancelled(): void {
    this.showAddMemberForm = false;
  }

  onFilter(): void {
    console.log('Toggle Filter Panel');
  }
}