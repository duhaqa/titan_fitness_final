import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EntityFormComponent } from '../../../shared/components/entity-form/entity-form';

// ==========================================
// 1. تعريف واجهة الباك إند والخدمة (ClassService)
// ==========================================
export interface FitnessClass {
  id: string;
  title: string;
  trainerName: string;
  studio: string;
  capacity: number;
  bookedSeats: number;
  startTime: string;
  endTime: string;
  status: 'Upcoming' | 'In Progress' | 'Completed';
}

@Injectable({ providedIn: 'root' })
export class ClassService {
  private apiUrl = 'https://localhost:7123/api/Classes';

  constructor(private http: HttpClient) {}

  getClasses(): Observable<FitnessClass[]> {
    return this.http.get<FitnessClass[]>(this.apiUrl);
  }

  addClass(fitnessClass: Partial<FitnessClass>): Observable<FitnessClass> {
    return this.http.post<FitnessClass>(this.apiUrl, fitnessClass);
  }
}

// ==========================================
// 2. الواجهات المحلية للمكون (ClassListComponent)
// ==========================================
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
  isLoading: boolean = false;

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

  classes: ClassSession[] = [];

  constructor(private classService: ClassService) {}

  ngOnInit(): void {
  console.log('ClassListComponent initialized!');
  this.loadClassesFromApi();
}

loadClassesFromApi(): void {
  console.log('Sending GET request to API...');
  this.isLoading = true;
  this.classService.getClasses().subscribe({
    next: (data) => {
      console.log('Data received from API:', data);
      this.classes = data.map(apiItem => this.mapApiToClassSession(apiItem));
      this.isLoading = false;
    },
    error: (err: any) => {
      console.error('Error in API call:', err);
      this.isLoading = false;
    }
  });
}
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
    const payload: Partial<FitnessClass> = {
      title: data.title || 'New Class',
      trainerName: data.trainer || 'Unassigned',
      studio: data.studio || 'Main Studio',
      capacity: Number(data.totalSeats) || 20,
      bookedSeats: Number(data.bookedSeats) || 0,
      startTime: data.time || '09:00 AM',
      endTime: data.duration || '60 min',
      status: data.status || 'Upcoming'
    };

    this.classService.addClass(payload).subscribe({
      next: (createdApiClass: FitnessClass) => {
        const newSession = this.mapApiToClassSession(createdApiClass);
        this.classes.unshift(newSession);

        if (
          newSession.trainer &&
          newSession.trainer !== 'Unassigned' &&
          !this.trainers.includes(newSession.trainer)
        ) {
          this.trainers.push(newSession.trainer);
        }

        if (
          newSession.studio &&
          newSession.studio !== 'Main Studio' &&
          !this.studios.includes(newSession.studio)
        ) {
          this.studios.push(newSession.studio);
        }

        this.showAddClassForm = false;
      },
      // تم تحديد نوع err صراحة لتفادي خطأ TypeScript
      error: (err: any) => {
        console.error('حدث خطأ أثناء حفظ الحصة في الباك إند:', err);
        alert('فشل حفظ الحصة في السيرفر. تحقق من الاتصال أو البيانات.');
      }
    });
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

  private mapApiToClassSession(apiItem: FitnessClass): ClassSession {
    return {
      id: apiItem.id,
      title: apiItem.title,
      trainer: apiItem.trainerName,
      studio: apiItem.studio,
      totalSeats: apiItem.capacity,
      bookedSeats: apiItem.bookedSeats,
      time: apiItem.startTime,
      duration: apiItem.endTime,
      category: 'General',
      status: apiItem.status
    };
  }
}