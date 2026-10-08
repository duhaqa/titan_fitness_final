import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/shell/shell').then((m) => m.ShellComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard/dashboard').then(
            (m) => m.DashboardComponent
          )
      },
      {
        path: 'members',
        loadComponent: () =>
          import('./features/members/member-list/member-list').then(
            (m) => m.MemberListComponent
          )
      },
      {
  path: 'members/:id/freeze',
  loadComponent: () =>
    import('./features/members/freeze-membership/freeze-membership').then(
      (m) => m.FreezeMembershipComponent
    )
},
      {
        path: 'classes',
        loadComponent: () =>
          import('./features/classes/class-list/class-list').then(
            (m) => m.ClassListComponent
          )
      },
      {
        path: 'trainers',
        loadComponent: () =>
          import('./features/trainers/trainer-list/trainer-list').then(
            (m) => m.TrainerListComponent
          )
      },
      {
  path: 'bookings',
  loadComponent: () =>
    import('./features/bookings/booking-list/booking-list').then(
      (m) => m.BookingListComponent
    )
},
      {
        path: 'plans',
        loadComponent: () =>
          import('./features/plans/plan-list/plan-list').then((m) => m.PlanListComponent)
      },
      {
        path: 'plans/new',
        data: { mode: 'add' },
        loadComponent: () =>
          import('./features/plans/plan-details/plan-details').then((m) => m.PlanDetailsComponent)
      },
      {
        path: 'plans/:id/edit',
        data: { mode: 'update' },
        loadComponent: () =>
          import('./features/plans/plan-details/plan-details').then((m) => m.PlanDetailsComponent)
      },
      {
        path: 'plans/:id',
        data: { mode: 'view' },
        loadComponent: () =>
          import('./features/plans/plan-details/plan-details').then((m) => m.PlanDetailsComponent)
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];