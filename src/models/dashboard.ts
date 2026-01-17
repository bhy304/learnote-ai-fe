import type { DashboardSummaryDto } from './generated';

/**
 * Creates an initial/empty dashboard data object.
 * This ensures consistency with the DashboardSummaryDto type when initializing state.
 */
export const createEmptyDashboardData = (userId: number): DashboardSummaryDto => ({
  userId,
  totalNotes: 0,
  currentStreakDays: 0,
  thisMonthNotes: 0,
  activity: [],
});
