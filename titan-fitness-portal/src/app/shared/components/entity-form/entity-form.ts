import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type EntityType = 'member' | 'trainer' | 'class';

@Component({
  selector: 'app-entity-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './entity-form.html',
  styleUrls: ['./entity-form.css']
})
export class EntityFormComponent {
  @Input() type: EntityType = 'member';
  @Output() saved = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  formData: any = {};

  get title(): string {
    if (this.type === 'member') return 'Add Member';
    if (this.type === 'trainer') return 'Add Trainer';
    return 'Add Class';
  }

  save(): void {
    this.saved.emit({
      ...this.formData,
      type: this.type
    });

    this.formData = {};
  }

  cancel(): void {
    this.cancelled.emit();
  }
}