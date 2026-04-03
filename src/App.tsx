/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { UserProfile, Goal, Contribution, AVATAR_COLORS, JointGoal, JointContribution } from "./types";
import { UserCard } from "./components/UserCard";
import { GoalList, ContributionForm, BillingSection } from "./components/GoalManager";
import { ProgressCircle, ContributionHistory } from "./components/Charts";
import { ProfileEditor } from "./components/ProfileEditor";
import { motion, AnimatePresence } from "motion/react";
import { Wallet, Settings, LayoutDashboard, History, PlusCircle, ChevronRight, Menu, X, Users } from "lucide-react";
import { cn, formatCurrency } from "./lib/utils";

const INITIAL_USERS: UserProfile[] = [
  {
    id: "1",
    displayName: "Alex",
    avatarColor: AVATAR_COLORS[0],
    goals: [
      { id: "g1", title: "Laptop Baru", targetAmount: 15000000, currentAmount: 4500000, category: "purchase", deadline: "2026-12-01", frequency: "none" },
      { id: "g2", title: "Dana Darurat", targetAmount: 50000000, currentAmount: 12000000, category: "emergency", frequency: "monthly", targetPerPeriod: 2000000 }
    ],
    contributions: [
      { id: "c1", amount: 2000000, date: "2026-03-15", note: "Tabungan bulanan" },
      { id: "c2", amount: 2500000, date: "2026-03-28", note: "Bonus" }
    ]
  },
  {
    id: "2",
    displayName: "Jordan",
    avatarColor: AVATAR_COLORS[1],
    goals: [
      { id: "g3", title: "Liburan Musim Panas", targetAmount: 30000000, currentAmount: 15000000, category: "travel", deadline: "2026-07-15", frequency: "monthly", targetPerPeriod: 5000000 }
    ],
    contributions: [
      { id: "c3", amount: 5000000, date: "2026-03-10" },
      { id: "c4", amount: 10000000, date: "2026-03-25" }
    ]
  },
  {
    id: "3",
    displayName: "Casey",
    avatarColor: AVATAR_COLORS[2],
    goals: [],
    contributions: []
  },
  {
    id: "4",
    displayName: "Riley",
    avatarColor: AVATAR_COLORS[3],
    goals: [],
    contributions: []
  },
  {
    id: "5",
    displayName: "Taylor",
    avatarColor: AVATAR_COLORS[4],
    goals: [],
    contributions: []
  }
];

const INITIAL_JOINT_GOALS: JointGoal[] = [
  {
    id: "jg1",
    title: "Liburan Bersama",
    targetAmount: 100000000,
    currentAmount: 25000000,
    category: "travel",
    deadline: "2027-01-01",
    frequency: "monthly",
    targetPerPeriod: 10000000,
    contributions: [
      { id: "jc1", userId: "1", amount: 10000000, date: "2026-03-01", note: "Kontribusi Alex" },
      { id: "jc2", userId: "2", amount: 15000000, date: "2026-03-05", note: "Kontribusi Jordan" }
    ]
  }
];

export default function App() {
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem("quintet_savings_users");
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });
  const [jointGoals, setJointGoals] = useState<JointGoal[]>(() => {
    const saved = localStorage.getItem("quintet_joint_goals");
    return saved ? JSON.parse(saved) : INITIAL_JOINT_GOALS;
  });
  const [activeUserId, setActiveUserId] = useState<string>(users[0].id);
  const [activeTab, setActiveTab] = useState<"dashboard" | "joint" | "history" | "settings">("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("quintet_savings_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("quintet_joint_goals", JSON.stringify(jointGoals));
  }, [jointGoals]);

  const activeUser = users.find(u => u.id === activeUserId)!;

  const handleUpdateProfile = (name: string, color: string) => {
    setUsers(prev => prev.map(u => 
      u.id === activeUserId ? { ...u, displayName: name, avatarColor: color } : u
    ));
  };

  const handleAddGoal = (goalData: Omit<Goal, "id" | "currentAmount">) => {
    const newGoal: Goal = {
      ...goalData,
      id: Math.random().toString(36).substr(2, 9),
      currentAmount: 0
    };
    setUsers(prev => prev.map(u => 
      u.id === activeUserId ? { ...u, goals: [...u.goals, newGoal] } : u
    ));
  };

  const handleDeleteGoal = (id: string) => {
    setUsers(prev => prev.map(u => 
      u.id === activeUserId ? { ...u, goals: u.goals.filter(g => g.id !== id) } : u
    ));
  };

  const handleAddJointGoal = (goalData: Omit<Goal, "id" | "currentAmount">) => {
    const newGoal: JointGoal = {
      ...goalData,
      id: Math.random().toString(36).substr(2, 9),
      currentAmount: 0,
      contributions: []
    };
    setJointGoals(prev => [...prev, newGoal]);
  };

  const handleDeleteJointGoal = (id: string) => {
    setJointGoals(prev => prev.filter(g => g.id !== id));
  };

  const handleAddContribution = (amount: number, note?: string) => {
    const newContribution: Contribution = {
      id: Math.random().toString(36).substr(2, 9),
      amount,
      date: new Date().toISOString().split('T')[0],
      note
    };

    setUsers(prev => prev.map(u => {
      if (u.id !== activeUserId) return u;
      
      const updatedGoals = [...u.goals];
      let remaining = amount;
      
      for (let i = 0; i < updatedGoals.length && remaining > 0; i++) {
        const goal = updatedGoals[i];
        const needed = goal.targetAmount - goal.currentAmount;
        if (needed > 0) {
          const toAdd = Math.min(remaining, needed);
          updatedGoals[i] = { ...goal, currentAmount: goal.currentAmount + toAdd };
          remaining -= toAdd;
        }
      }

      return {
        ...u,
        goals: updatedGoals,
        contributions: [newContribution, ...u.contributions]
      };
    }));
  };

  const handleAddJointContribution = (amount: number, note?: string) => {
    const newContribution: JointContribution = {
      id: Math.random().toString(36).substr(2, 9),
      userId: activeUserId,
      amount,
      date: new Date().toISOString().split('T')[0],
      note
    };

    setJointGoals(prev => prev.map(g => {
      // For joint savings, we'll just add to the first goal for now
      // or we could let user select. Let's add to the first unfinished goal.
      if (g.currentAmount >= g.targetAmount) return g;
      
      const needed = g.targetAmount - g.currentAmount;
      const toAdd = Math.min(amount, needed);
      
      return {
        ...g,
        currentAmount: g.currentAmount + toAdd,
        contributions: [newContribution, ...g.contributions]
      };
    }));
  };

  const getPendingBillsCount = (goals: Goal[], contributions: Contribution[]) => {
    return goals.filter(g => {
      if (g.frequency === "none") return false;
      const now = new Date();
      let periodStart = new Date();
      if (g.frequency === "daily") periodStart.setHours(0, 0, 0, 0);
      else if (g.frequency === "monthly") { periodStart.setDate(1); periodStart.setHours(0, 0, 0, 0); }
      else if (g.frequency === "yearly") { periodStart.setMonth(0, 1); periodStart.setHours(0, 0, 0, 0); }
      
      const totalInPeriod = contributions.filter(c => new Date(c.date) >= periodStart).reduce((acc, c) => acc + c.amount, 0);
      return totalInPeriod < (g.targetPerPeriod || 0);
    }).length;
  };

  const personalPending = getPendingBillsCount(activeUser.goals, activeUser.contributions);
  const jointPending = getPendingBillsCount(jointGoals, jointGoals.flatMap(g => g.contributions));

  const totalSaved = activeUser.goals.reduce((acc, g) => acc + g.currentAmount, 0);
  const totalTarget = activeUser.goals.reduce((acc, g) => acc + g.targetAmount, 0);

  const jointTotalSaved = jointGoals.reduce((acc, g) => acc + g.currentAmount, 0);
  const jointTotalTarget = jointGoals.reduce((acc, g) => acc + g.targetAmount, 0);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex font-sans text-gray-900">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-80 bg-white border-r border-gray-100 p-8 sticky top-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
            <Wallet size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Quintet</h1>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-6">Profil Pengguna</h2>
            <div className="space-y-4">
              {users.map(user => (
                <UserCard 
                  key={user.id}
                  user={user}
                  isActive={activeUserId === user.id}
                  onClick={() => setActiveUserId(user.id)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-gray-50">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Tabungan Bersama v1.1</p>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 z-50 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
            <Wallet size={16} />
          </div>
          <span className="font-bold">Quintet</span>
        </div>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2">
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white z-[70] p-8 lg:hidden overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Profil Pengguna</h2>
                <button onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
              </div>
              <div className="space-y-4">
                {users.map(user => (
                  <UserCard 
                    key={user.id}
                    user={user}
                    isActive={activeUserId === user.id}
                    onClick={() => {
                      setActiveUserId(user.id);
                      setIsSidebarOpen(false);
                    }}
                  />
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-12 mt-16 lg:mt-0 max-w-6xl mx-auto w-full">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <span>Beranda</span>
              <ChevronRight size={14} />
              <span className="text-gray-900 font-medium">{activeUser.displayName}</span>
            </div>
            <h2 className="text-4xl font-light text-gray-900">Selamat datang, {activeUser.displayName}</h2>
          </div>

          <nav className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
            <button 
              onClick={() => setActiveTab("dashboard")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap relative",
                activeTab === "dashboard" ? "bg-gray-900 text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <LayoutDashboard size={18} />
              <span>Pribadi</span>
              {personalPending > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] flex items-center justify-center rounded-full border-2 border-white">
                  {personalPending}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab("joint")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap relative",
                activeTab === "joint" ? "bg-gray-900 text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <Users size={18} />
              <span>Bersama</span>
              {jointPending > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] flex items-center justify-center rounded-full border-2 border-white">
                  {jointPending}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab("history")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                activeTab === "history" ? "bg-gray-900 text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <History size={18} />
              <span>Riwayat</span>
            </button>
            <button 
              onClick={() => setActiveTab("settings")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                activeTab === "settings" ? "bg-gray-900 text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <Settings size={18} />
              <span>Pengaturan</span>
            </button>
          </nav>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <AnimatePresence mode="wait">
              {activeTab === "dashboard" && (
                <motion.div 
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-[32px] shadow-xl border border-gray-50 flex flex-col items-center justify-center">
                      <h3 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-4">Progres Keseluruhan</h3>
                      <ProgressCircle 
                        current={totalSaved} 
                        target={totalTarget || 1} 
                        color={activeUser.avatarColor} 
                      />
                      <div className="mt-4 text-center">
                        <div className="text-2xl font-light text-gray-900">{formatCurrency(totalSaved)}</div>
                        <p className="text-xs text-gray-400 mt-1">dari target {formatCurrency(totalTarget)}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="bg-white p-8 rounded-[32px] shadow-xl border border-gray-50 flex-1">
                        <h3 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-6">Statistik Cepat</h3>
                        <div className="space-y-6">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Tujuan Aktif</span>
                            <span className="text-lg font-medium">{activeUser.goals.length}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Total Kontribusi</span>
                            <span className="text-lg font-medium">{activeUser.contributions.length}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Rata-rata Setoran</span>
                            <span className="text-lg font-medium">
                              {activeUser.contributions.length > 0 
                                ? formatCurrency(activeUser.contributions.reduce((a, b) => a + b.amount, 0) / activeUser.contributions.length)
                                : "Rp 0"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <GoalList 
                    goals={activeUser.goals} 
                    onAddGoal={handleAddGoal}
                    onDeleteGoal={handleDeleteGoal}
                    accentColor={activeUser.avatarColor}
                  />
                </motion.div>
              )}

              {activeTab === "joint" && (
                <motion.div 
                  key="joint"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-[32px] shadow-xl border border-gray-50 flex flex-col items-center justify-center">
                      <h3 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-4">Progres Bersama</h3>
                      <ProgressCircle 
                        current={jointTotalSaved} 
                        target={jointTotalTarget || 1} 
                        color="#000000" 
                      />
                      <div className="mt-4 text-center">
                        <div className="text-2xl font-light text-gray-900">{formatCurrency(jointTotalSaved)}</div>
                        <p className="text-xs text-gray-400 mt-1">dari target {formatCurrency(jointTotalTarget)}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="bg-white p-8 rounded-[32px] shadow-xl border border-gray-50 flex-1">
                        <h3 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-6">Kontribusi Tim</h3>
                        <div className="space-y-4">
                          {users.map(u => {
                            const userContr = jointGoals.reduce((acc, g) => 
                              acc + g.contributions.filter(c => c.userId === u.id).reduce((a, b) => a + b.amount, 0), 0
                            );
                            return (
                              <div key={u.id} className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: u.avatarColor }} />
                                  <span className="text-sm text-gray-500">{u.displayName}</span>
                                </div>
                                <span className="text-sm font-medium">{formatCurrency(userContr)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <GoalList 
                    goals={jointGoals} 
                    onAddGoal={handleAddJointGoal}
                    onDeleteGoal={handleDeleteJointGoal}
                    accentColor="#000000"
                  />
                </motion.div>
              )}

              {activeTab === "history" && (
                <motion.div 
                  key="history"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="bg-white p-8 rounded-[32px] shadow-xl border border-gray-50">
                    <h3 className="text-xl font-light text-gray-900 mb-2">Riwayat Kontribusi</h3>
                    <p className="text-sm text-gray-400 mb-8">Aktivitas menabung Anda dari waktu ke waktu</p>
                    <ContributionHistory 
                      data={activeUser.contributions.slice(0, 10).reverse().map(c => ({ date: c.date, amount: c.amount }))} 
                      color={activeUser.avatarColor} 
                    />
                  </div>

                  <div className="bg-white rounded-[32px] shadow-xl border border-gray-50 overflow-hidden">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Tanggal</th>
                          <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Jumlah</th>
                          <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Catatan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {activeUser.contributions.map(c => (
                          <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-8 py-4 text-sm text-gray-600">{new Date(c.date).toLocaleDateString("id-ID")}</td>
                            <td className="px-8 py-4 text-sm font-medium text-gray-900">{formatCurrency(c.amount)}</td>
                            <td className="px-8 py-4 text-sm text-gray-400 italic">{c.note || "—"}</td>
                          </tr>
                        ))}
                        {activeUser.contributions.length === 0 && (
                          <tr>
                            <td colSpan={3} className="px-8 py-12 text-center text-gray-400 italic">Belum ada kontribusi</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div 
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ProfileEditor 
                    displayName={activeUser.displayName}
                    avatarColor={activeUser.avatarColor}
                    onUpdate={handleUpdateProfile}
                    accentColor={activeUser.avatarColor}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-8">
            <BillingSection 
              goals={activeTab === "joint" ? jointGoals : activeUser.goals}
              contributions={activeTab === "joint" ? jointGoals.flatMap(g => g.contributions) : activeUser.contributions}
              accentColor={activeTab === "joint" ? "#000000" : activeUser.avatarColor}
            />

            <ContributionForm 
              onAddContribution={activeTab === "joint" ? handleAddJointContribution : handleAddContribution}
              accentColor={activeTab === "joint" ? "#000000" : activeUser.avatarColor}
            />

            <div className="bg-gray-900 p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-500" />
              <div className="relative z-10">
                <h4 className="text-lg font-medium mb-2">Tips Menabung</h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Menetapkan tujuan kecil yang dapat dicapai meningkatkan tingkat keberhasilan Anda sebesar 40%. Mulailah dengan dana darurat!
                </p>
                <button className="mt-6 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                  Baca Selengkapnya <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
