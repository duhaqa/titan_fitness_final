import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ClassFormModel {
  id?: string;
  className: string;
  trainerName: string;
  capacity: number;
  scheduleTime: string;
  roomNumber: string;
  status: 'Active' | 'Upcoming' | 'Cancelled';
  description?: string;
}

@Component({
  selector: 'app-class-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './class-form.html',
  styleUrls: ['./class-form.css']
})
export class ClassFormComponent implements OnInit {
  @Input() initialData?: ClassFormModel;
  @Output() formSubmit = new EventEmitter<ClassFormModel>();
  @Output() cancel = new EventEmitter<void>();

  formData: ClassFormModel = {
    className: '',
    trainerName: '',
    capacity: 20,
    scheduleTime: '',
    roomNumber: '',
    status: 'Active',
    description: ''
  };

  isSubmitting = false;

  trainers = [
    { id: 't1', name: 'Coach Marcus Vance' },
    { id: 't2', name: 'Coach Elena Rostova' },
    { id: 't3', name: 'Coach David Miller' }
  ];

  ngOnInit(): void {
    if (this.initialData) {
      this.formData = { ...this.initialData };
    }
  }

  onSubmit(): void {
    if (!this.formData.className || !this.formData.trainerName || !this.formData.scheduleTime) {
      alert('Please fill in all required fields.');
      return;
    }

    this.isSubmitting = true;

    // محاكاة معالجة البيانات
    setTimeout(() => {
      this.isSubmitting = false;
      this.formSubmit.emit(this.formData);
    }, 600);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}