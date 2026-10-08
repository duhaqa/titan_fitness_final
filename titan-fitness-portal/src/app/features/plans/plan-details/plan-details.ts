import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PlanService } from '../../../core/services/plan';
import {
  ACCESS_SCOPE,
  PlanRequest,
  accessScopeLabel,
  isHomeBranchOnly
} from '../../../core/models/plan.models';

type PlanMode = 'add' | 'view' | 'update';

interface PlanForm {
  planName: string;
  price: number | null;
  durationInMonths: number | null;
  isPublished: boolean;
  maxFreezeDays: number | null;
  maxNumberOfFreezes: number | null;
  guestPassQuota: number | null;
  accessScope: string;
}

@Component({
  selector: 'app-plan-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <button class="back" (click)="backToList()">← Back to list</button>

    <div class="header-row">
      <div>
        <div class="title-row">
          <h1>{{ title }}</h1>
          <span class="badge">● {{ modeLabel }}</span>
        </div>
        <p class="muted">{{ subtitle }}</p>
      </div>
      <button class="primary" *ngIf="mode === 'view'" (click)="editPlan()" [disabled]="loading">
        ✎ Edit Plan
      </button>
    </div>

    <div class="notice" *ngIf="mode === 'update'">
      Changes to this plan apply to new purchases only. Memberships already sold keep the terms they were sold.
    </div>

    <div class="error" *ngIf="errorMessage">{{ errorMessage }}</div>

    <div class="card">
      <h2>Plan Details</h2>
      <div class="grid">
        <div class="field">
          <label>Plan name <span class="req" *ngIf="!isReadOnly">*</span></label>
          <input type="text" maxlength="50" placeholder="e.g., Annual Pro"
            [(ngModel)]="form.planName" [disabled]="isReadOnly" />
        </div>

        <div class="field">
          <label>Price <span class="req" *ngIf="!isReadOnly">*</span></label>
          <input type="number" step="0.01" min="0" placeholder="0.00"
            [(ngModel)]="form.price" [disabled]="isReadOnly" />
        </div>

        <div class="field">
          <label>Duration in months <span class="req" *ngIf="!isReadOnly">*</span></label>
          <input type="number" min="1" max="120" placeholder="e.g., 12"
            [(ngModel)]="form.durationInMonths" [disabled]="isReadOnly" />
        </div>

        <div class="field">
          <label>Status</label>
          <label class="check">
            <input type="checkbox" [(ngModel)]="form.isPublished" [disabled]="isReadOnly" />
            IsPublished
          </label>
          <span class="hint" *ngIf="!isReadOnly">Ticked means true, unticked means false.</span>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>Terms Offered</h2>
      <div class="grid">
        <div class="field">
          <label>Maximum freeze days</label>
          <input type="number" min="0" max="365" placeholder="0"
            [(ngModel)]="form.maxFreezeDays" [disabled]="isReadOnly" />
        </div>

        <div class="field">
          <label>Maximum number of freezes</label>
          <input type="number" min="0" max="50" placeholder="0"
            [(ngModel)]="form.maxNumberOfFreezes" [disabled]="isReadOnly" />
        </div>

        <div class="field">
          <label>Guest pass quota</label>
          <input type="number" min="0" max="100" placeholder="0"
            [(ngModel)]="form.guestPassQuota" [disabled]="isReadOnly" />
        </div>

        <div class="field">
          <label>Access scope</label>

          <input *ngIf="isReadOnly" type="text" [value]="scopeText" disabled />

          <div class="radios" *ngIf="!isReadOnly">
            <label class="radio" [class.selected]="form.accessScope === scopes.homeBranchOnly">
              <input type="radio" name="accessScope" [value]="scopes.homeBranchOnly"
                [(ngModel)]="form.accessScope" />
              Home branch only
            </label>
            <label class="radio" [class.selected]="form.accessScope === scopes.allBranches">
              <input type="radio" name="accessScope" [value]="scopes.allBranches"
                [(ngModel)]="form.accessScope" />
              All branches
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="footer" *ngIf="!isReadOnly">
      <button class="secondary" (click)="cancel()" [disabled]="saving">Cancel</button>
      <button class="primary" (click)="save()" [disabled]="saving">
        {{ saving ? 'Saving...' : (mode === 'add' ? '✓ Save Plan' : '✓ Save Changes') }}
      </button>
    </div>
  `,
  styles: [`
    .back { background: none; border: none; color: #1a2456; cursor: pointer; margin-bottom: 10px; font-size: 14px; padding: 0; }
    .header-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
    .title-row { display: flex; align-items: center; gap: 10px; }
    h1 { margin: 0; color: #1a2456; }
    h2 { margin: 0 0 16px; font-size: 16px; color: #1a2456; }
    .badge { background: #eaf3ff; color: #1a2456; font-size: 11px; padding: 3px 10px; border-radius: 12px; }
    .muted { color: #888; font-size: 13px; margin: 4px 0 0; }
    .notice { background: #fdf3e7; color: #8a5a00; padding: 12px 16px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; }
    .error { background: #fdecea; color: #c0392b; padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; }
    .card { background: #fff; border-radius: 10px; padding: 20px; margin-bottom: 16px; box-shadow: 0 1px 4px rgba(0,0,0,.05); }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 24px; }
    .field label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: #222; }
    .req { color: #c0392b; }
    input[type='text'], input[type='number'] { width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; background: #fff; }
    input:disabled { background: #f4f4f4; color: #666; }
    .check { display: flex; align-items: center; gap: 8px; font-weight: 400 !important; }
    .hint { display: block; font-size: 12px; color: #888; margin-top: 4px; }
    .radios { display: flex; gap: 10px; }
    .radio { display: flex; align-items: center; gap: 6px; border: 1px solid #ddd; border-radius: 6px; padding: 8px 12px; cursor: pointer; font-weight: 400 !important; }
    .radio.selected { border-color: #1a2456; background: #eaf3ff; }
    .footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px; }
    .primary { background: #1a2456; color: #fff; border: none; padding: 10px 18px; border-radius: 6px; cursor: pointer; font-weight: 600; }
    .secondary { background: #fff; color: #1a2456; border: 1px solid #1a2456; padding: 10px 18px; border-radius: 6px; cursor: pointer; font-weight: 600; }
    button:disabled { opacity: .6; cursor: default; }
  `]
})
export class PlanDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private planService = inject(PlanService);

  readonly scopes = ACCESS_SCOPE;

  mode: PlanMode = 'view';
  planId: number | null = null;
  loadedName = '';
  loading = false;
  saving = false;
  errorMessage = '';

  form: PlanForm = {
    planName: '',
    price: null,
    durationInMonths: null,
    isPublished: false,
    maxFreezeDays: 0,
    maxNumberOfFreezes: 0,
    guestPassQuota: 0,
    accessScope: ''
  };

  get isReadOnly(): boolean {
    return this.mode === 'view';
  }

  get title(): string {
    return this.mode === 'add' ? 'New Plan' : this.loadedName;
  }

  get modeLabel(): string {
    if (this.mode === 'add') return 'Add mode';
    return this.mode === 'view' ? 'View mode' : 'Update mode';
  }

  get subtitle(): string {
    return this.mode === 'add' ? 'Publish a new membership plan.' : 'Plan details';
  }

  get scopeText(): string {
    return accessScopeLabel(this.form.accessScope);
  }

  ngOnInit(): void {
    this.mode = (this.route.snapshot.data['mode'] as PlanMode) ?? 'view';

    if (this.mode !== 'add') {
      this.planId = Number(this.route.snapshot.paramMap.get('id'));
      this.load();
    }
  }

  private load(): void {
    this.loading = true;

    this.planService.getPlan(this.planId as number).subscribe({
      next: (plan) => {
        this.loadedName = plan.name;
        this.form = {
          planName: plan.name,
          price: plan.price,
          durationInMonths: plan.durationInMonths,
          isPublished: plan.isPublished,
          maxFreezeDays: plan.maxFreezeDays ?? 0,
          maxNumberOfFreezes: plan.maxNumberOfFreezes ?? 0,
          guestPassQuota: plan.guestPassQuota ?? 0,
          accessScope: isHomeBranchOnly(plan.accessScope)
            ? ACCESS_SCOPE.homeBranchOnly
            : ACCESS_SCOPE.allBranches
        };
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'تعذر تحميل بيانات الخطة.';
        this.loading = false;
      }
    });
  }

  save(): void {
    this.errorMessage = '';

    const problem = this.validate();
    if (problem) {
      this.errorMessage = problem;
      return;
    }

    const body: PlanRequest = {
      planName: this.form.planName.trim(),
      price: this.form.price as number,
      durationInMonths: this.form.durationInMonths as number,
      isPublished: this.form.isPublished,
      maxFreezeDays: this.form.maxFreezeDays ?? 0,
      maxNumberOfFreezes: this.form.maxNumberOfFreezes ?? 0,
      guestPassQuota: this.form.guestPassQuota ?? 0,
      accessScope: this.form.accessScope
    };

    this.saving = true;

    const request$ =
      this.mode === 'add'
        ? this.planService.createPlan(body)
        : this.planService.updatePlan(this.planId as number, body);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/plans']);
      },
      error: (err: HttpErrorResponse) => {
        this.saving = false;
        this.errorMessage = this.extractError(err);
      }
    });
  }

  private validate(): string | null {
    const f = this.form;

    if (!f.planName.trim()) return 'اسم الخطة مطلوب.';
    if (f.planName.trim().length > 50) return 'اسم الخطة يجب ألا يتجاوز 50 حرفاً.';
    if (f.price === null || f.price < 0.01 || f.price > 100000) return 'السعر يجب أن يكون بين 0.01 و 100000.';
    if (f.durationInMonths === null || !Number.isInteger(f.durationInMonths) || f.durationInMonths < 1 || f.durationInMonths > 120) {
      return 'المدة يجب أن تكون بين 1 و 120 شهراً.';
    }
    if (!this.inRange(f.maxFreezeDays, 0, 365)) return 'أقصى أيام التجميد يجب أن تكون بين 0 و 365.';
    if (!this.inRange(f.maxNumberOfFreezes, 0, 50)) return 'عدد مرات التجميد يجب أن يكون بين 0 و 50.';
    if (!this.inRange(f.guestPassQuota, 0, 100)) return 'حصة تذاكر الزوار يجب أن تكون بين 0 و 100.';
    if (!f.accessScope) return 'اختر نطاق الوصول.';

    return null;
  }

  private inRange(value: number | null, min: number, max: number): boolean {
    return value === null || (Number.isInteger(value) && value >= min && value <= max);
  }

  private extractError(err: HttpErrorResponse): string {
    const body = err.error;

    if (typeof body === 'string' && body.trim()) return body;
    if (body?.message) return body.message;
    if (body?.errors) return (Object.values(body.errors) as string[][]).flat().join(' ');
    if (body?.detail) return body.detail;
    if (body?.title) return body.title;

    return 'حدث خطأ أثناء حفظ الخطة.';
  }

  editPlan(): void {
    this.router.navigate(['/plans', this.planId, 'edit']);
  }

  cancel(): void {
    this.router.navigate(['/plans']);
  }

  backToList(): void {
    this.router.navigate(['/plans']);
  }
}