export interface Contribution {
  id: string;
  amount: number;
  date: string;
  note?: string;
}

export type Frequency = "daily" | "monthly" | "yearly" | "none";

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  category: "travel" | "emergency" | "purchase" | "investment" | "other";
  frequency: Frequency;
  targetPerPeriod?: number;
}

export interface UserProfile {
  id: string;
  displayName: string;
  avatarColor: string;
  goals: Goal[];
  contributions: Contribution[];
}

export interface JointContribution extends Contribution {
  userId: string;
}

export interface JointGoal extends Goal {
  contributions: JointContribution[];
}

export const AVATAR_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Violet
];
