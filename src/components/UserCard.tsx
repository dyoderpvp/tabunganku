import React from "react";
import { UserProfile } from "../types";
import { cn, formatCurrency } from "../lib/utils";
import { motion } from "motion/react";
import { TrendingUp, Target, User as UserIcon } from "lucide-react";

interface UserCardProps {
  key?: string;
  user: UserProfile;
  isActive: boolean;
  onClick: () => void;
}

export function UserCard({ user, isActive, onClick }: UserCardProps) {
  const totalSaved = user.goals.reduce((acc, goal) => acc + goal.currentAmount, 0);
  const totalTarget = user.goals.reduce((acc, goal) => acc + goal.targetAmount, 0);
  const percentage = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "flex flex-col p-6 rounded-[24px] transition-all duration-300 text-left w-full",
        isActive 
          ? "bg-white shadow-xl ring-1 ring-black/5" 
          : "bg-gray-50 hover:bg-white hover:shadow-md"
      )}
    >
      <div className="flex items-center gap-4 mb-6">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-sm"
          style={{ backgroundColor: user.avatarColor }}
        >
          <UserIcon size={24} />
        </div>
        <div>
          <h3 className="font-medium text-gray-900 leading-tight">{user.displayName}</h3>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">Profil</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 uppercase tracking-widest font-medium">Total Tabungan</span>
            <div className="text-2xl font-light text-gray-900">{formatCurrency(totalSaved)}</div>
          </div>
          <div className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            percentage >= 100 ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
          )}>
            {percentage}%
          </div>
        </div>

        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, percentage)}%` }}
            className="h-full"
            style={{ backgroundColor: user.avatarColor }}
          />
        </div>

        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-1.5">
            <Target size={14} className="text-gray-400" />
            <span className="text-xs text-gray-500">{user.goals.length} Tujuan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingUp size={14} className="text-gray-400" />
            <span className="text-xs text-gray-500">{user.contributions.length} Setoran</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
