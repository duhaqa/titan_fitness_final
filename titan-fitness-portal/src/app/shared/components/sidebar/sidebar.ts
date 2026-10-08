import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {
  @Input() isCollapsed = false;

  navItems = [
    { label: 'Dashboard', icon: '📊', route: '/dashboard' },
    { label: 'Members', icon: '👥', route: '/members' },
    { label: 'Classes', icon: '🏋️', route: '/classes' },
    { label: 'Trainers', icon: '👟', route: '/trainers' },
    { label: 'Plans', icon: '💳', route: '/plans' }
  ];
}