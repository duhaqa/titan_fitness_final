import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface PlanFormData {
  id: string;
  name: string;
  price: number;
  currency: string;
  durationMonths: number;
  description: string;
  features: string[];
  activeSubscribersCount: number;
  isPopular?: boolean;
}

@Component({
  selector: 'app-plan-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './plan-form.html',
  styleUrls: ['./plan-form.css']
})
export class PlanFormComponent {
  @Input() plan?: PlanFormData;

  @Output() saved = new EventEmitter<PlanFormData>();
  @Output() cancelled = new EventEmitter<void>();

  formData: PlanFormData = {
    id: '',
    name: '',
    price: 0,
    currency: 'USD',
    durationMonths: 1,
    description: '',
    features: [],
    activeSubscribersCount: 0,
    isPopular: false
  };

  featureText: string = '';

  ngOnChanges(): void {
    if (this.plan) {
      this.formData = {
        ...this.plan,
        features: [...this.plan.features]
      };
    }
  }

  get isEditMode(): boolean {
    return !!this.plan;
  }

  get title(): string {
    return this.isEditMode ? 'Edit Membership Plan' : 'Create Membership Plan';
  }

  addFeature(): void {
    const feature = this.featureText.trim();

    if (!feature) {
      return;
    }

    this.formData.features.push(feature);
    this.featureText = '';
  }

  removeFeature(index: number): void {
    this.formData.features.splice(index, 1);
  }

  save(): void {
    this.saved.emit({
      ...this.formData,
      features: [...this.formData.features]
    });
  }

  cancel(): void {
    this.cancelled.emit();
  }
}