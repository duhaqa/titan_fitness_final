import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  onToggleSidebar() {
    this.toggleSidebarEvent.emit();
  }
}