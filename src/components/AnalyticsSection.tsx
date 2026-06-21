/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar, ArrowUpRight, ArrowDownLeft, Scale, RefreshCw } from 'lucide-react';
import { Transaction, RegionConfig } from '../types';

interface AnalyticsSectionProps {
  transactions: Transaction[];
  selectedFilter: 'All' | 'Day' | 'Week' | 'Month' | 'Year' | 'Custom';
  setSelectedFilter: (filter: 'All' | 'Day' | 'Week' | 'Month' | 'Year' | 'Custom') => void;
  dateFrom: string;
  setDateFrom: (d: string) => void;
  dateTo: string;
  setDateTo: (d: string) => void;
  region: RegionConfig;
  darkMode: boolean;
}

export default function AnalyticsSection({
  transactions,
  selectedFilter,
  setSelectedFilter,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  region,
  darkMode,
}: AnalyticsSectionProps) {
  const symbol = region.currencySymbol;

  // Let's perform internal computations for the selected filtered list of transactions
  const incomeFiltered = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseFiltered = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netFiltered = incomeFiltered - expenseFiltered;

  const formatMoney = (val: number) => {
    return `${symbol} ${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  const filterOptions = ['All', 'Day', 'Week', 'Month', 'Year', 'Custom'] as const;

  return (
    <div className="glass-card p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
        {/* Title */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Flow Analytics & Filter Engine
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Analytical summary for the selected accounting timeline
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {filterOptions.map((opt) => (
            <button
              id={`filter-opt-${opt}`}
              key={opt}
              onClick={() => setSelectedFilter(opt)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedFilter === opt
                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700/50'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Date Range Picker Accordion */}
      {selectedFilter === 'Custom' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 px-1 border-b border-dashed border-slate-100 dark:border-slate-800 animate-slide-down">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
              Date From
            </label>
            <div className="relative">
              <input
                id="analytics-date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                  darkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-100'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
              Date To
            </label>
            <div className="relative">
              <input
                id="analytics-date-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                  darkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-100'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>
          </div>
        </div>
      )}

      {/* FLOW ANALYTICS SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        {/* Funds Added: Cash Flow Inflow */}
        <div id="summary-funds-added" className={`p-5 rounded-xl border flex items-center justify-between transition-all ${
          darkMode ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50/50 border-emerald-100'
        }`}>
          <div>
            <span className="block text-[10px] font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-1">
              Funds Added (Inflow)
            </span>
            <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
              +{formatMoney(incomeFiltered)}
            </span>
          </div>
          <div className="p-3 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full shadow-inner">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        {/* Funds Deducted: Cash Flow Outflow */}
        <div id="summary-funds-deducted" className={`p-5 rounded-xl border flex items-center justify-between transition-all ${
          darkMode ? 'bg-rose-500/5 border-rose-500/20' : 'bg-rose-50/50 border-rose-100'
        }`}>
          <div>
            <span className="block text-[10px] font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-1">
              Funds Deducted (Outflow)
            </span>
            <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400 tracking-tight">
              -{formatMoney(expenseFiltered)}
            </span>
          </div>
          <div className="p-3 bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-full shadow-inner">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </div>

        {/* Net Flow Balance */}
        <div id="summary-net-balance" className={`p-5 rounded-xl border flex items-center justify-between transition-all ${
          darkMode ? 'bg-amber-500/5 border-amber-500/25' : 'bg-amber-50/50 border-amber-100'
        }`}>
          <div>
            <span className="block text-[10px] font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-1">
              Period Net Balance
            </span>
            <span className={`text-xl font-extrabold tracking-tight ${
              netFiltered >= 0 
                ? 'text-amber-500 dark:text-amber-400' 
                : 'text-rose-500'
            }`}>
              {netFiltered < 0 ? '-' : ''}{formatMoney(Math.abs(netFiltered))}
            </span>
          </div>
          <div className="p-3 bg-amber-100 dark:bg-amber-950/50 text-amber-500 dark:text-amber-400 rounded-full shadow-inner">
            <Scale className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
