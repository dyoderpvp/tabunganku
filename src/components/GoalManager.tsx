import React, { useState } from "react";
import { Goal, Contribution } from "../types";
import { formatCurrency, cn } from "../lib/utils";
import { Plus, Trash2, Calendar, Tag, DollarSign, PlusCircle, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface GoalListProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, "id" | "currentAmount">) => void;
  onDeleteGoal: (id: string) => void;
  accentColor: string;
}

export function GoalList({ goals, onAddGoal, onDeleteGoal, accentColor }: GoalListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    targetAmount: 0,
    category: "other" as Goal["category"],
    deadline: "",
    frequency: "none" as Goal["frequency"],
    targetPerPeriod: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.title && newGoal.targetAmount > 0) {
      onAddGoal(newGoal);
      setNewGoal({ title: "", targetAmount: 0, category: "other", deadline: "", frequency: "none", targetPerPeriod: 0 });
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-light text-gray-900">Tujuan Tabungan</h3>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-all duration-200"
          style={{ backgroundColor: accentColor + "15", color: accentColor }}
        >
          <Plus size={16} />
          <span>Tambah Tujuan</span>
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-[24px] shadow-lg border border-gray-100 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 uppercase tracking-widest font-medium">Nama Tujuan</label>
                <input 
                  type="text"
                  placeholder="misal: Laptop Baru"
                  className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-opacity-50 outline-none transition-all"
                  style={{ "--tw-ring-color": accentColor } as any}
                  value={newGoal.title}
                  onChange={e => setNewGoal({ ...newGoal, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 uppercase tracking-widest font-medium">Target Jumlah</label>
                <div className="relative">
                  <DollarSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="number"
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-opacity-50 outline-none transition-all"
                    style={{ "--tw-ring-color": accentColor } as any}
                    value={newGoal.targetAmount || ""}
                    onChange={e => setNewGoal({ ...newGoal, targetAmount: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 uppercase tracking-widest font-medium">Kategori</label>
                <select 
                  className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-opacity-50 outline-none transition-all"
                  style={{ "--tw-ring-color": accentColor } as any}
                  value={newGoal.category}
                  onChange={e => setNewGoal({ ...newGoal, category: e.target.value as Goal["category"] })}
                >
                  <option value="travel">Liburan</option>
                  <option value="emergency">Darurat</option>
                  <option value="purchase">Pembelian</option>
                  <option value="investment">Investasi</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 uppercase tracking-widest font-medium">Tenggat Waktu (Opsional)</label>
                <input 
                  type="date"
                  className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-opacity-50 outline-none transition-all"
                  style={{ "--tw-ring-color": accentColor } as any}
                  value={newGoal.deadline}
                  onChange={e => setNewGoal({ ...newGoal, deadline: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 uppercase tracking-widest font-medium">Frekuensi Target</label>
                <select 
                  className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-opacity-50 outline-none transition-all"
                  style={{ "--tw-ring-color": accentColor } as any}
                  value={newGoal.frequency}
                  onChange={e => setNewGoal({ ...newGoal, frequency: e.target.value as Goal["frequency"] })}
                >
                  <option value="none">Tanpa Frekuensi</option>
                  <option value="daily">Harian</option>
                  <option value="monthly">Bulanan</option>
                  <option value="yearly">Tahunan</option>
                </select>
              </div>
              {newGoal.frequency !== "none" && (
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 uppercase tracking-widest font-medium">Target per {newGoal.frequency === "daily" ? "Hari" : newGoal.frequency === "monthly" ? "Bulan" : "Tahun"}</label>
                  <div className="relative">
                    <DollarSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="number"
                      placeholder="0"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-opacity-50 outline-none transition-all"
                      style={{ "--tw-ring-color": accentColor } as any}
                      value={newGoal.targetPerPeriod || ""}
                      onChange={e => setNewGoal({ ...newGoal, targetPerPeriod: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-6 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Batal
              </button>
              <button 
                type="submit"
                className="px-6 py-2 text-sm font-medium text-white rounded-full shadow-md hover:shadow-lg transition-all"
                style={{ backgroundColor: accentColor }}
              >
                Buat Tujuan
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {goals.map(goal => {
          const percentage = Math.round((goal.currentAmount / goal.targetAmount) * 100);
          return (
            <motion.div 
              key={goal.id}
              layout
              className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gray-50 text-gray-400 group-hover:bg-white group-hover:shadow-sm transition-all">
                    <Tag size={18} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{goal.title}</h4>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{goal.category}</span>
                  </div>
                </div>
                <button 
                  onClick={() => onDeleteGoal(goal.id)}
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex justify-between items-end mb-2">
                <div className="text-xl font-light text-gray-900">
                  {formatCurrency(goal.currentAmount)}
                  <span className="text-sm text-gray-400 ml-1">/ {formatCurrency(goal.targetAmount)}</span>
                </div>
                <span className="text-xs font-bold text-gray-500">{percentage}%</span>
              </div>

              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, percentage)}%` }}
                  className="h-full"
                  style={{ backgroundColor: accentColor }}
                />
              </div>

              <div className="flex flex-wrap gap-4 mt-4">
                {goal.deadline && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Calendar size={12} />
                    <span>Jatuh tempo {new Date(goal.deadline).toLocaleDateString("id-ID")}</span>
                  </div>
                )}
                {goal.frequency !== "none" && (
                  <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: accentColor }}>
                    <PlusCircle size={12} />
                    <span>Target: {formatCurrency(goal.targetPerPeriod || 0)} / {goal.frequency === "daily" ? "hari" : goal.frequency === "monthly" ? "bulan" : "tahun"}</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
        {goals.length === 0 && !isAdding && (
          <div className="col-span-full py-12 text-center bg-gray-50 rounded-[24px] border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-light">Belum ada tujuan. Mulailah dengan menambahkannya!</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface ContributionFormProps {
  onAddContribution: (amount: number, note?: string) => void;
  accentColor: string;
}

export function ContributionForm({ onAddContribution, accentColor }: ContributionFormProps) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && Number(amount) > 0) {
      onAddContribution(Number(amount), note);
      setAmount("");
      setNote("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[32px] shadow-xl border border-gray-50 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 rounded-2xl bg-gray-50" style={{ color: accentColor }}>
          <PlusCircle size={24} />
        </div>
        <h3 className="text-xl font-light text-gray-900">Tambah Setoran</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs text-gray-400 uppercase tracking-widest font-medium">Jumlah Tabungan</label>
          <div className="relative">
            <DollarSign size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="number"
              placeholder="0"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-2xl font-light focus:ring-2 focus:ring-opacity-50 outline-none transition-all"
              style={{ "--tw-ring-color": accentColor } as any}
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-gray-400 uppercase tracking-widest font-medium">Catatan (Opsional)</label>
          <input 
            type="text"
            placeholder="misal: Bonus bulanan"
            className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-opacity-50 outline-none transition-all"
            style={{ "--tw-ring-color": accentColor } as any}
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </div>
      </div>

      <button 
        type="submit"
        className="w-full py-4 text-white font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
        style={{ backgroundColor: accentColor }}
      >
        Setor Dana
      </button>
    </form>
  );
}

interface BillingSectionProps {
  goals: Goal[];
  contributions: Contribution[];
  accentColor: string;
}

export function BillingSection({ goals, contributions, accentColor }: BillingSectionProps) {
  const recurringGoals = goals.filter(g => g.frequency !== "none");

  const getStatus = (goal: Goal) => {
    const now = new Date();
    let periodStart = new Date();
    let nextDue = new Date();
    
    if (goal.frequency === "daily") {
      periodStart.setHours(0, 0, 0, 0);
      nextDue.setDate(now.getDate() + 1);
      nextDue.setHours(0, 0, 0, 0);
    } else if (goal.frequency === "monthly") {
      periodStart.setDate(1);
      periodStart.setHours(0, 0, 0, 0);
      nextDue.setMonth(now.getMonth() + 1, 1);
      nextDue.setHours(0, 0, 0, 0);
    } else if (goal.frequency === "yearly") {
      periodStart.setMonth(0, 1);
      periodStart.setHours(0, 0, 0, 0);
      nextDue.setFullYear(now.getFullYear() + 1, 0, 1);
      nextDue.setHours(0, 0, 0, 0);
    }

    const periodContributions = contributions.filter(c => new Date(c.date) >= periodStart);
    const totalInPeriod = periodContributions.reduce((acc, c) => acc + c.amount, 0);
    const target = goal.targetPerPeriod || 0;
    const remaining = Math.max(0, target - totalInPeriod);
    const isMet = totalInPeriod >= target;

    return { totalInPeriod, target, remaining, isMet, nextDue };
  };

  if (recurringGoals.length === 0) return null;

  const totalDueThisPeriod = recurringGoals.reduce((acc, g) => acc + (getStatus(g).remaining), 0);

  return (
    <div className="bg-white p-8 rounded-[32px] shadow-xl border border-gray-50 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gray-50" style={{ color: accentColor }}>
            <AlertCircle size={24} />
          </div>
          <h3 className="text-xl font-light text-gray-900">Penagihan & Target</h3>
        </div>
        {totalDueThisPeriod > 0 && (
          <div className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-full">
            Total Tagihan: {formatCurrency(totalDueThisPeriod)}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {recurringGoals.map(goal => {
          const { totalInPeriod, target, remaining, isMet, nextDue } = getStatus(goal);
          return (
            <div key={goal.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{goal.title}</h4>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                    Target {goal.frequency === "daily" ? "Harian" : goal.frequency === "monthly" ? "Bulanan" : "Tahunan"}
                  </p>
                </div>
                {isMet ? (
                  <div className="flex flex-col items-end">
                    <CheckCircle2 size={18} className="text-green-500" />
                    <span className="text-[10px] text-green-600 font-bold uppercase mt-1">Lunas</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-red-500">Tertunda</span>
                    <span className="text-[10px] text-gray-400">Sisa: {formatCurrency(remaining)}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  <span>Progres Periode Ini</span>
                  <span>{Math.round((totalInPeriod / target) * 100)}%</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (totalInPeriod / target) * 100)}%` }}
                    className="h-full"
                    style={{ backgroundColor: isMet ? "#10B981" : accentColor }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                <Calendar size={10} />
                <span>Tagihan berikutnya: {nextDue.toLocaleDateString("id-ID")}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
