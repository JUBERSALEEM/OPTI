/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Target, Calendar, Plus, Trash2, Milestone, ArrowUpRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SavingsGoal, RegionConfig } from '../types';

interface SavingsGoalsSectionProps {
  savingsGoals: SavingsGoal[];
  onAddGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  onUpdateGoalSaved: (id: string, newAmount: number) => void;
  onDeleteGoal: (id: string) => void;
  region: RegionConfig;
  darkMode: boolean;
}

export default function SavingsGoalsSection({
  savingsGoals,
  onAddGoal,
  onUpdateGoalSaved,
  onDeleteGoal,
  region,
  darkMode,
}: SavingsGoalsSectionProps) {
  const symbol = region.currencySymbol;

  // New goal form states
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Allocation fund state per-card
  const [allocations, setAllocations] = useState<Record<string, string>>({});

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount || isNaN(Number(targetAmount)) || Number(targetAmount) <= 0) {
      alert('Please fill out a valid name and target threshold.');
      return;
    }

    onAddGoal({
      name,
      targetAmount: Number(targetAmount),
      savedAmount: 0,
      deadline: deadline || new Date(Date.now() + 31536000000).toISOString().split('T')[0], // 1 year delay default
    });

    setName('');
    setTargetAmount('');
    setDeadline('');
    setShowAddForm(false);
  };

  const handleFundGoal = (id: string, currentSaved: number, target: number) => {
    const fundAmount = allocations[id];
    if (!fundAmount || isNaN(Number(fundAmount)) || Number(fundAmount) <= 0) {
      alert('Please enter a valid numeric funding quota.');
      return;
    }

    const nextAllocation = Math.min(target, currentSaved + Number(fundAmount));
    onUpdateGoalSaved(id, nextAllocation);

    // Reset allocation input
    setAllocations((prev) => ({ ...prev, [id]: '' }));
  };

  const formatMoney = (val: number) => {
    return `${symbol}${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  const presetGoals = [
    { name: 'House Purchase Plan', target: 1200000 },
    { name: 'Sister College Education', target: 500000 },
    { name: 'Parent Healthcare Fund', target: 200000 },
    { name: 'Standard 6-Month Emergency Fund', target: 150000 },
  ];

  return (
    <div className="space-y-6">
      {/* SECTION HEADER ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Target className="w-5.5 h-5.5 text-emerald-500 animate-bounce" />
            <span>Target Milestones & Savings Goals</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Secure resources for your family future and track your timeline progression
          </p>
        </div>

        <button
          id="toggle-new-goal-form"
          onClick={() => setShowAddForm(!showAddForm)}
          className="self-start sm:self-center bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 font-semibold text-white px-4 py-2 rounded-xl text-xs transition duration-150 cursor-pointer flex items-center space-x-1.5 shadow-sm shadow-emerald-500/10"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Close Setup' : 'Create Custom Goal'}</span>
        </button>
      </div>

      {/* SETUP FORM */}
      {showAddForm && (
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'} shadow-md max-w-xl animate-fade-in`}>
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-4">
            Initialize Custom Financial Milestone
          </h3>
          <form onSubmit={handleCreate} className="space-y-4 text-xs font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 dark:text-slate-500 mb-1">
                  Goal Name / Project Target
                </label>
                <input
                  id="goal-input-name"
                  type="text"
                  placeholder="e.g. Dream Apartment Downpayment"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                    darkMode ? 'bg-slate-800 border-slate-705 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-850'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 dark:text-slate-500 mb-1">
                  Goal Target Threshold ({symbol})
                </label>
                <input
                  id="goal-input-target"
                  type="number"
                  placeholder="50000"
                  required
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                    darkMode ? 'bg-slate-800 border-slate-705 text-slate-100 font-bold' : 'bg-slate-50 border-slate-200 text-slate-850 font-bold'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 dark:text-slate-500 mb-1">
                Target Timeline Deadline
              </label>
              <input
                id="goal-input-deadline"
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className={`w-full max-w-sm px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                  darkMode ? 'bg-slate-800 border-slate-705 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-850'
                }`}
              />
            </div>

            {/* Quick Presets */}
            <div>
              <span className="block text-[10px] text-slate-400 uppercase mb-2">
                Quick Template Presets
              </span>
              <div className="flex flex-wrap gap-2 text-[10px]">
                {presetGoals.map((g) => (
                  <button
                    id={`preset-goal-${g.name.split(' ')[0]}`}
                    key={g.name}
                    type="button"
                    onClick={() => {
                      setName(g.name);
                      setTargetAmount(g.target.toString());
                      setDeadline(new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // 6 Months
                    }}
                    className={`px-3 py-1.5 rounded-full transition cursor-pointer border ${
                      darkMode
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-350 border-slate-700/50'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                id="goal-cancel-btn"
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="goal-save-btn"
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-lg cursor-pointer"
              >
                Save Goal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MAIN CARDS LIST */}
      {savingsGoals.length === 0 ? (
        <div className={`p-12 text-center rounded-2xl border ${darkMode ? 'bg-slate-900/20 border-slate-850' : 'bg-slate-50/50 border-slate-200/50'}`}>
          <Target className="w-12 h-12 text-slate-350 mx-auto mb-3 animate-pulse" />
          <p className="text-xs font-semibold text-slate-505">No saving targets registered.</p>
          <p className="text-[11px] text-slate-400 mt-1">
            Tap "Create Custom Goal" to start tracking milestones for sister marriage, emergencies, or real estate downpayments.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savingsGoals.map((g) => {
            const pct = Math.min(100, Math.round((g.savedAmount / g.targetAmount) * 100));
            const remaining = g.targetAmount - g.savedAmount;
            const completed = pct >= 100;

            return (
              <div
                id={`goal-card-${g.id}`}
                key={g.id}
                className="glass-card relative overflow-hidden p-6 flex flex-col justify-between"
              >
                {/* Completed Stamp */}
                {completed && (
                  <div className="absolute top-2 right-2 flex items-center space-x-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Goal Reached</span>
                  </div>
                )}

                {/* Card Title */}
                <div>
                  <div className="flex items-start justify-between mb-3.5">
                    <div className="flex items-center space-x-2.5">
                      <div className={`p-2 rounded-lg ${completed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                        <Milestone className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-105 text-sm line-clamp-1 pr-6" title={g.name}>
                          {g.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          <span>Deadline: {g.deadline}</span>
                        </p>
                      </div>
                    </div>
                    {!completed && (
                      <button
                        id={`delete-goal-btn-${g.id}`}
                        onClick={() => onDeleteGoal(g.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 rounded transition cursor-pointer"
                        title="Remove Goal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Progress bar and percentages */}
                  <div className="space-y-2 mt-4">
                    <div className="flex items-end justify-between font-mono text-xs">
                      <div className="text-[11px]">
                        <span className="text-slate-400">Progress: </span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{pct}%</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-500">{formatMoney(g.savedAmount)}</span>
                        <span className="text-slate-400 text-[10px]"> / {formatMoney(g.targetAmount)}</span>
                      </div>
                    </div>

                    <div className="progress-bar">
                      <div
                        className="progress-fill transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>

                    {remaining > 0 && (
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                        <span>Remaining Amount:</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{formatMoney(remaining)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Add Savings input incremental launcher option */}
                {!completed && (
                  <div className="mt-5 pt-4 border-t border-dashed border-slate-100 dark:border-slate-800 flex items-center gap-1">
                    <div className="relative flex-1">
                      <span className="absolute left-2.5 top-2 text-[10px] font-bold text-slate-450">{symbol}</span>
                      <input
                        id={`goal-fund-input-${g.id}`}
                        type="number"
                        placeholder="Add savings"
                        value={allocations[g.id] || ''}
                        onChange={(e) => setAllocations((prev) => ({ ...prev, [g.id]: e.target.value }))}
                        className={`w-full pl-6 pr-2 py-1.5 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono ${
                          darkMode ? 'bg-slate-800 border-slate-700 text-slate-205' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                    <button
                      id={`goal-fund-submit-${g.id}`}
                      onClick={() => handleFundGoal(g.id, g.savedAmount, g.targetAmount)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-lg cursor-pointer flex items-center justify-center transition-all shadow-sm"
                      title="Contribute funds"
                    >
                      <ArrowUpRight className="w-4.5 h-4.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
