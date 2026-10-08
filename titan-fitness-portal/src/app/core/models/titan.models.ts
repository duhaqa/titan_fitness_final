// ===== Auth =====
export interface Branch {
  id: number;
  name: string;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  branchId: number;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user?: User;
}

// ===== Member =====
export interface Member {
  id: number;
  membershipNumber: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  joinedDate: string;
  homeBranchId: number;
  homeBranchName: string;
  status: string;
  lastVisit: string | null;
}

export interface CreateMemberRequest {
  fullName: string;
  membershipNumber?: string;
  email?: string;
  phone?: string;
  address?: string;
  joinedDate: string;
  homeBranchId: number;
}

export interface UpdateMemberRequest {
  id: number;
  fullName: string;
  email?: string;
  phone?: string;
  address?: string;
  joinedDate: string;
  homeBranchId: number;
}

export interface CurrentPlan {
  planName: string;
  price: number;
  startDate: string;
  endDate: string;
  status: string;
}

export interface RecentActivity {
  type: string;
  description: string;
  occurredAt: string;
}

export interface MemberProfile {
  id: number;
  membershipNumber: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  joinedDate: string;
  homeBranchName: string;
  currentPlan: CurrentPlan | null;
  freezesUsed: number;
  freezesAllowed: number;
  guestPassesUsed: number;
  guestPassesAllowed: number;
  recentActivity: RecentActivity[];
}

// ===== Membership lifecycle =====
export interface PurchaseMembershipRequest {
  memberId: number;
  planId: number;
  startDate?: string;
}

export interface ChangePlanRequest {
  memberId: number;
  newPlanId: number;
  immediately: boolean;
}

export interface FreezeRequest {
  memberId: number;
  startDate: string;
  durationInMonths: number;
  reason: string;
  additionalNotes?: string;
}

// ===== Trainer =====
export interface Trainer {
  id: number;
  name: string;
  specialty?: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  branchId: number;
}

// ===== Plan =====
export interface MembershipPlan {
  id: number;
  name: string;
  price: number;
  durationInMonths: number;
  maxFreezeDays: number;
  maxNumberOfFreezes: number;
  guestPassQuota: number;
  accessScope: string;
  isPublished: boolean;
}

// ===== Class / Session =====
export interface ClassSession {
  id: number;
  className: string;
  branchId: number;
  studioId: number;
  trainerId: number;
  sessionDate: string;
  startTime: string;
  endTime: string;
  durationInMinutes: number;
  capacityLimit: number;
  status: string;
  description?: string;
  bookedCount: number;
  waitlistCount: number;
}

export interface ClassScheduleResult {
  sessions: ClassSession[];
  totalBookings: number;
  averageFillRatePercent: number;
}

export interface BookSessionRequest {
  sessionId: number;
  memberId: number;
  specialRequirements?: string;
}

// ===== Dashboard =====
export interface CheckInsToday {
  checkInsToday: number;
  checkInsSameDayLastWeek: number;
  percentChangeVsLastWeek: number;
}

export interface ActiveMembers {
  activeMembersCount: number;
  currentlyOnFloor: number;
}

export interface UpcomingSession {
  id: number;
  className: string;
  studioName: string;
  trainerName: string;
  startTime: string;
  bookedCount: number;
  capacityLimit: number;
  status: string;
}

export interface CapacityOverview {
  totalBookingsToday: number;
  averageFillRatePercent: number;
}