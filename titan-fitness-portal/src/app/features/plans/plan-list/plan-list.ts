import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PlanService } from '../../../core/services/plan';
import { PlanDto, accessScopeLabel } from '../../../core/models/plan.models';

@Component({
  selector: 'app-plan-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page" (click)="closeMenu()">
      <div class="header-row">
        <div>
          <h1>Plan Catalogue</h1>
          <p class="muted">Manage and view all membership plans.</p>
        </div>
        <div class="header-actions">
          <select class="filter" [(ngModel)]="statusFilter" (ngModelChange)="onFilterChange()">
            <option value="all">Filter: All</option>
            <option value="published">Published</option>
            <option value="retired">Retired</option>
          </select>
          <button class="primary" (click)="addPlan()">+ Add Plan</button>
        </div>
      </div>

      <input
        class="search"
        type="text"
        placeholder="Search plans..."
        [(ngModel)]="searchTerm"
        (ngModelChange)="onFilterChange()"
      />

      <div class="error" *ngIf="errorMessage">{{ errorMessage }}</div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>PLAN NAME</th>
              <th>PRICE</th>
              <th>DURATION</th>
              <th>FREEZE ALLOWANCE</th>
              <th>GUEST PASSES</th>
              <th>ACCESS</th>
              <th>STATUS</th>
              <th class="right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of pagedPlans">
              <td>{{ p.name }}</td>
              <td>{{ p.price | currency:'USD':'symbol':'1.2-2' }}</td>
              <td>{{ durationLabel(p) }}</td>
              <td>{{ freezeAllowance(p) }}</td>
              <td>{{ p.guestPassQuota ?? 0 }}</td>
              <td>{{ scopeLabel(p) }}</td>
              <td>
                <span class="status" [class.published]="p.isPublished" [class.retired]="!p.isPublished">
                  {{ statusLabel(p) }}
                </span>
              </td>
              <td class="actions-cell">
                <button class="kebab" (click)="toggleMenu(p.id, $event)">⋮</button>
                <div class="menu" *ngIf="openMenuId === p.id">
                  <button (click)="viewPlan(p.id)">View Plan</button>
                  <button (click)="updatePlan(p.id)">Update Plan</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <p class="empty" *ngIf="!loading && !filtered.length">لا يوجد خطط مطابقة.</p>
        <p class="empty" *ngIf="loading">جارٍ التحميل...</p>

        <div class="footer" *ngIf="filtered.length">
          <span class="muted">Showing {{ showingFrom }} to {{ showingTo }} of {{ filtered.length }} entries</span>
          <div class="pager">
            <button (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 1">‹</button>
            <button
              *ngFor="let n of pages"
              [class.current]="n === currentPage"
              (click)="goToPage(n)">{{ n }}</button>
            <button (click)="goToPage(currentPage + 1)" [disabled]="currentPage === totalPages">›</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    h1 { margin: 0; color: #1a2456; }
    .muted { color: #888; font-size: 13px; }
    .header-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
    .header-actions { display: flex; gap: 10px; align-items: center; }
    .filter { padding: 9px 10px; border: 1px solid #ddd; border-radius: 6px; background: #fff; }
    .primary { background: #1a2456; color: #fff; border: none; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-weight: 600; }
    .search { width: 100%; padding: 10px 12px; margin-bottom: 16px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }
    .table-wrap { background: #fff; border-radius: 10px; box-shadow: 0 1px 4px rgba(0,0,0,.05); padding-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; font-size: 11px; color: #888; padding: 14px 16px; border-bottom: 1px solid #eee; }
    td { padding: 14px 16px; border-bottom: 1px solid #f3f3f3; font-size: 14px; }
    .right { text-align: right; }
    .status { padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; }
    .status.published { background: #e8f8ee; color: #27ae60; }
    .status.retired { background: #fdecea; color: #c0392b; }
    .actions-cell { position: relative; text-align: right; }
    .kebab { background: none; border: none; font-size: 18px; cursor: pointer; padding: 0 8px; }
    .menu { position: absolute; right: 16px; top: 80%; background: #fff; border: 1px solid #eee; border-radius: 8px; box-shadow: 0 4px 14px rgba(0,0,0,.12); z-index: 10; display: flex; flex-direction: column; min-width: 130px; }
    .menu button { background: none; border: none; text-align: left; padding: 10px 14px; cursor: pointer; font-size: 13px; }
    .menu button:hover { background: #f4f6fb; }
    .footer { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px 6px; }
    .pager { display: flex; gap: 6px; }
    .pager button { border: 1px solid #ddd; background: #fff; padding: 5px 10px; border-radius: 4px; cursor: pointer; }
    .pager button.current { background: #1a2456; color: #fff; border-color: #1a2456; }
    .pager button:disabled { opacity: .4; cursor: default; }
    .empty { text-align: center; color: #888; padding: 20px; }
    .error { color: #c0392b; font-size: 13px; margin-bottom: 12px; }
  `]
})
export class PlanListComponent implements OnInit {
  private planService = inject(PlanService);
  private router = inject(Router);

  readonly pageSize = 10;

  plans: PlanDto[] = [];
  searchTerm = '';
  statusFilter = 'all';
  currentPage = 1;
  openMenuId: number | null = null;
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.planService.getPlans().subscribe({
      next: (res) => {
        this.plans = res;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'تعذر تحميل الخطط.';
        this.loading = false;
      }
    });
  }

  // البحث بيشمل كل القيم المعروضة بالجدول، مو الاسم بس
  get filtered(): PlanDto[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.plans.filter((p) => {
      if (this.statusFilter === 'published' && !p.isPublished) return false;
      if (this.statusFilter === 'retired' && p.isPublished) return false;
      if (!term) return true;

      const haystack = [
        p.name,
        String(p.price),
        this.durationLabel(p),
        this.freezeAllowance(p),
        String(p.guestPassQuota ?? 0),
        this.scopeLabel(p),
        this.statusLabel(p)
      ].join(' ').toLowerCase();

      return haystack.includes(term);
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filtered.length / this.pageSize));
  }

  get pagedPlans(): PlanDto[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  get showingFrom(): number {
    return this.filtered.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get showingTo(): number {
    return Math.min(this.currentPage * this.pageSize, this.filtered.length);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  durationLabel(p: PlanDto): string {
    return `${p.durationInMonths} ${p.durationInMonths === 1 ? 'month' : 'months'}`;
  }

  freezeAllowance(p: PlanDto): string {
    const days = p.maxFreezeDays ?? 0;
    const count = p.maxNumberOfFreezes ?? 0;
    if (days === 0 && count === 0) return 'None';
    return `${days} days / ${count} ${count === 1 ? 'freeze' : 'freezes'}`;
  }

  scopeLabel(p: PlanDto): string {
    return accessScopeLabel(p.accessScope);
  }

  statusLabel(p: PlanDto): string {
    return p.isPublished ? 'Published' : 'Retired';
  }

  onFilterChange(): void {
    this.currentPage = 1;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  toggleMenu(id: number, event: Event): void {
    event.stopPropagation();
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  closeMenu(): void {
    this.openMenuId = null;
  }

  addPlan(): void {
    this.router.navigate(['/plans', 'new']);
  }

  viewPlan(id: number): void {
    this.router.navigate(['/plans', id]);
  }

  updatePlan(id: number): void {
    this.router.navigate(['/plans', id, 'edit']);
  }
}