
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntityFormComponent } from '../../../shared/components/entity-form/entity-form';

export interface ClassSession {
  id: string;
  time: string;
  duration: string;
  title: string;
  category: string;
  trainer: string;
  studio: string;
  bookedSeats: number;
  totalSeats: number;
  status: 'Upcoming' | 'In Progress' | 'Completed';
}

export interface DayTab {
  dayName: string;
  dateText: string;
  fullDate: string;
  isToday?: boolean;
}

@Component({
  selector: 'app-class-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EntityFormComponent
  ],
  templateUrl: './class-list.html',
  styleUrls: ['./class-list.css']
})
export class ClassListComponent implements OnInit {
  selectedDate: string = '2023-10-24';
  searchTerm: string = '';
  selectedTrainer: string = 'All';
  selectedStudio: string = 'All';

  showAddClassForm: boolean = false;

  weekDays: DayTab[] = [
    { dayName: 'Mon', dateText: 'Oct 23', fullDate: '2023-10-23' },
    { dayName: 'Tue', dateText: 'Oct 24', fullDate: '2023-10-24', isToday: true },
    { dayName: 'Wed', dateText: 'Oct 25', fullDate: '2023-10-25' },
    { dayName: 'Thu', dateText: 'Oct 26', fullDate: '2023-10-26' },
    { dayName: 'Fri', dateText: 'Oct 27', fullDate: '2023-10-27' },
    { dayName: 'Sat', dateText: 'Oct 28', fullDate: '2023-10-28' },
    { dayName: 'Sun', dateText: 'Oct 29', fullDate: '2023-10-29' }
  ];

  trainers: string[] = ['All', 'Sarah Jenkins', 'Marcus Vance', 'David Miller'];
  studios: string[] = ['All', 'Studio A (HIIT)', 'Studio B (Yoga)', 'Cycling Zone'];

  classes: ClassSession[] = [
    {
      id: 'c1',
      time: '07:00 AM',
      duration: '45 min',
      title: 'Morning Flow Yoga',
      category: 'Flexibility',
      trainer: 'Sarah Jenkins',
      studio: 'Studio B (Yoga)',
      bookedSeats: 15,
      totalSeats: 15,
      status: 'Completed'
    },
    {
      id: 'c2',
      time: '09:30 AM',
      duration: '60 min',
      title: 'HIIT & Endurance',
      category: 'Cardio',
      trainer: 'Marcus Vance',
      studio: 'Studio A (HIIT)',
      bookedSeats: 12,
      totalSeats: 15,
      status: 'In Progress'
    },
    {
      id: 'c3',
      time: '05:00 PM',
      duration: '45 min',
      title: 'Spin & RPM Cycle',
      category: 'Cycling',
      trainer: 'David Miller',
      studio: 'Cycling Zone',
      bookedSeats: 8,
      totalSeats: 20,
      status: 'Upcoming'
    },
    {
      id: 'c4',
      time: '06:30 PM',
      duration: '60 min',
      title: 'Power Weightlifting',
      category: 'Strength',
      trainer: 'Marcus Vance',
      studio: 'Studio A (HIIT)',
      bookedSeats: 5,
      totalSeats: 12,
      status: 'Upcoming'
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  selectDay(day: DayTab): void {
    this.selectedDate = day.fullDate;
  }

  get filteredClasses(): ClassSession[] {
    return this.classes.filter(c => {
      const matchesSearch =
        c.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        c.trainer.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesTrainer =
        this.selectedTrainer === 'All' ||
        c.trainer === this.selectedTrainer;

      const matchesStudio =
        this.selectedStudio === 'All' ||
        c.studio === this.selectedStudio;

      return matchesSearch && matchesTrainer && matchesStudio;
    });
  }

  get totalClassesToday(): number {
    return this.classes.length;
  }

  get totalAvailableSeats(): number {
    return this.classes.reduce(
      (sum, c) => sum + (c.totalSeats - c.bookedSeats),
      0
    );
  }

  onAddClass(): void {
    this.showAddClassForm = true;
  }

  onClassSaved(data: any): void {
    const newClass: ClassSession = {
      id: 'c' + Date.now(),
      time: data.time || '09:00 AM',
      duration: data.duration || '60 min',
      title: data.title || 'New Class',
      category: data.category || 'General',
      trainer: data.trainer || 'Unassigned',
      studio: data.studio || 'Main Studio',
      bookedSeats: Number(data.bookedSeats) || 0,
      totalSeats: Number(data.totalSeats) || 20,
      status: data.status || 'Upcoming'
    };

    this.classes.unshift(newClass);

    if (
      newClass.trainer &&
      newClass.trainer !== 'Unassigned' &&
      !this.trainers.includes(newClass.trainer)
    ) {
      this.trainers.push(newClass.trainer);
    }

    if (
      newClass.studio &&
      newClass.studio !== 'Main Studio' &&
      !this.studios.includes(newClass.studio)
    ) {
      this.studios.push(newClass.studio);
    }

    this.showAddClassForm = false;
  }

  onClassFormCancelled(): void {
    this.showAddClassForm = false;
  }

  onBookMember(cls: ClassSession): void {
    console.log('Book member for class:', cls.title);
  }

  onViewAttendees(cls: ClassSession): void {
    console.log('View attendees for class:', cls.title);
  }
}
