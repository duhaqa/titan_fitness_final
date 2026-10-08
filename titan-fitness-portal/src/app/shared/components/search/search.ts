import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search.html',
  styleUrls: ['./search.css']
})
export class SearchComponent {
  searchTerm = '';
  @Output() searchChange = new EventEmitter<string>();

  onInput() {
    this.searchChange.emit(this.searchTerm);
  }
}