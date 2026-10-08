import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar';
import { NavbarComponent } from '../../shared/components/navbar/navbar';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    NavbarComponent
  ],
  templateUrl: './shell.html',
  styleUrls: ['./shell.css']
})
export class ShellComponent {
  isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}