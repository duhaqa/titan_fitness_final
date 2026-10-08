export interface PlanDto {
  id: number;
  name: string;
  price: number;
  durationInMonths: number;
  maxFreezeDays: number | null;
  maxNumberOfFreezes: number | null;
  guestPassQuota: number | null;
  accessScope: string | number;
  isPublished: boolean;
}

// نفس CreatePlanDto بالباك إند (بنستخدمه للإضافة والتعديل)
export interface PlanRequest {
  planName: string;
  price: number;
  durationInMonths: number;
  isPublished: boolean;
  maxFreezeDays: number;
  maxNumberOfFreezes: number;
  guestPassQuota: number;
  accessScope: string;
}

// ⚠️ تأكد من اسم القيمة التانية بالـ Enum (شوف الملاحظة بآخر الرد)
export const ACCESS_SCOPE = {
  homeBranchOnly: 'HomeBranchOnly',
  allBranches: 'AllBranches'
} as const;

export function isHomeBranchOnly(value: string | number | null | undefined): boolean {
  return String(value ?? '').toLowerCase().includes('home');
}

export function accessScopeLabel(value: string | number | null | undefined): string {
  return isHomeBranchOnly(value) ? 'Home branch only' : 'All branches';
}