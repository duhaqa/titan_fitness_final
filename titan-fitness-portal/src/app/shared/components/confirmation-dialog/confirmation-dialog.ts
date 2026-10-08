import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.html',
  styleUrls: ['./confirmation-dialog.css']
})
export class ConfirmationDialogComponent {
  @Input() isOpen = false;
  @Input() message = 'Are you sure you want to proceed?';
  @Output() confirm = new EventEmitter<boolean>();

  onResponse(result: boolean) {
    this.confirm.emit(result);
  }
}