import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntityFormComponent } from '../../../shared/components/entity-form/entity-form';

export interface Trainer {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  weeklyClasses: number;
  status: 'Active' | 'On Leave' | 'Inactive';
  avatarUrl?: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-trainer-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EntityFormComponent
  ],
  templateUrl: './trainer-list.html',
  styleUrls: ['./trainer-list.css']
})
export class TrainerListComponent implements OnInit {
  searchTerm: string = '';
  selectedSpecialty: string = 'All';

  showAddTrainerForm: boolean = false;

  specialties: string[] = [
    'All',
    'HIIT & Strength',
    'Yoga & Pilates',
    'Spin & Cycling',
    'Boxing & Combat'
  ];

  trainers: Trainer[] = [
    {
      id: 't1',
      name: 'Marcus Vance',
      specialty: 'HIIT & Strength',
      rating: 4.9,
      reviewCount: 128,
      weeklyClasses: 14,
      status: 'Active',
      email: 'marcus.v@titanfitness.com',
      phone: '+1 (555) 234-5678'
    },
    {
      id: 't2',
      name: 'Sarah Jenkins',
      specialty: 'Yoga & Pilates',
      rating: 4.8,
      reviewCount: 95,
      weeklyClasses: 10,
      status: 'Active',
      email: 'sarah.j@titanfitness.com',
      phone: '+1 (555) 876-5432'
    },
    {
      id: 't3',
      name: 'David Miller',
      specialty: 'Spin & Cycling',
      rating: 4.7,
      reviewCount: 64,
      weeklyClasses: 8,
      status: 'On Leave',
      email: 'david.m@titanfitness.com',
      phone: '+1 (555) 345-6789'
    },
    {
      id: 't4',
      name: 'Elena Rostova',
      specialty: 'Boxing & Combat',
      rating: 5.0,
      reviewCount: 42,
      weeklyClasses: 12,
      status: 'Active',
      email: 'elena.r@titanfitness.com',
      phone: '+1 (555) 987-6543'
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  get filteredTrainers(): Trainer[] {
    return this.trainers.filter(t => {
      const matchesSearch =
        t.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        t.specialty.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesSpecialty =
        this.selectedSpecialty === 'All' ||
        t.specialty === this.selectedSpecialty;

      return matchesSearch && matchesSpecialty;
    });
  }

  onAddTrainer(): void {
    this.showAddTrainerForm = true;
  }

  onTrainerSaved(data: any): void {
    const newTrainer: Trainer = {
      id: 't' + Date.now(),
      name: data.name || 'New Trainer',
      specialty: data.specialty || 'HIIT & Strength',
      rating: Number(data.rating) || 0,
      reviewCount: Number(data.reviewCount) || 0,
      weeklyClasses: Number(data.weeklyClasses) || 0,
      status: data.status || 'Active',
      avatarUrl: data.avatarUrl || undefined,
      email: data.email || '',
      phone: data.phone || ''
    };

    this.trainers.unshift(newTrainer);
    this.showAddTrainerForm = false;
  }

  onTrainerFormCancelled(): void {
    this.showAddTrainerForm = false;
  }

  onViewProfile(trainer: Trainer): void {
    console.log('View profile for trainer:', trainer.name);
  }

  onAssignClass(trainer: Trainer): void {
    console.log('Assign class to trainer:', trainer.name);
  }
}