/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Percent, Coins, ShieldCheck } from 'lucide-react';
import { Transaction, Investment, CryptoAsset, SavingsGoal, RegionConfig } from '../types';

interface DashboardKPIsProps {
  transactions: Transaction[];
  investments: Investment[];
  cryptoAssets: CryptoAsset[];
  savingsGoals: SavingsGoal[];
  region: RegionConfig;
  darkMode: boolean;
}

export default function DashboardKPIs({
  transactions,
  investments,
  cryptoAssets,
  savingsGoals,
  region,
  darkMode,
}: DashboardKPIsProps) {
  const symbol = region.currencySymbol;

  // Let's compute financial metrics logically
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Available Cash balance is total income minus expense
  const availableCash = totalIncome - totalExpense;

  // Savings is the sum of saved values of all savings goals
  const totalSavings = savingsGoals.reduce((sum, g) => sum + g.savedAmount, 0);

  // Investments is the valuation of stocks/bonds/gold, etc.
  const totalInvestments = investments.reduce((sum, inv) => sum + inv.quantity * inv.currentPrice, 0);

  // Crypto portfolio valuation
  const totalCrypto = cryptoAssets.reduce((sum, crypto) => sum + crypto.quantity * crypto.currentPrice, 0);

  // Total Portfolio Value is: Cash + Savings + Investments + Crypto
  const totalPortfolioValue = availableCash + totalSavings + totalInvestments + totalCrypto;

  // Savings ratio computation
  // If income > 0, ratio = (Total Savings / Income) * 100
  const savingsRatio = totalIncome > 0 ? Math.min(100, Math.round((totalSavings / totalIncome) * 100)) : 0;

  // Format Helper
  const formatMoney = (val: number) => {
    return `${symbol} ${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* CARD 1: Portfolio Value */}
      <div
        id="kpi-portfolio"
        className="glass-card stat-card stat-yellow p-6 relative overflow-hidden flex flex-col justify-center"
      >
        <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-5 pointer-events-none">
          <Coins className="w-32 h-32 text-amber-500" />
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
            Total Portfolio Value
          </span>
          <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
            <Coins className="w-5 h-5 line-clamp-1" />
          </div>
        </div>
        <div className="flex flex-col">
          <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 uppercase">
            {formatMoney(totalPortfolioValue)}
          </h3>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 font-mono flex flex-wrap gap-x-2">
            <span>Cash: {formatMoney(availableCash)}</span>
            <span>•</span>
            <span>Savings: {formatMoney(totalSavings)}</span>
          </p>
        </div>
      </div>

      {/* CARD 2: Total Income */}
      <div
        id="kpi-income"
        className="glass-card stat-card stat-green p-6 relative overflow-hidden flex flex-col justify-center"
      >
        <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-5 pointer-events-none">
          <TrendingUp className="w-32 h-32 text-emerald-500" />
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
            Total Monthly Income
          </span>
          <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="flex flex-col">
          <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 uppercase">
            {formatMoney(totalIncome)}
          </h3>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 font-mono">
            Active salary, bonuses, business accounts
          </p>
        </div>
      </div>

      {/* CARD 3: Total Expenses */}
      <div
        id="kpi-expense"
        className="glass-card stat-card stat-red p-6 relative overflow-hidden flex flex-col justify-center"
      >
        <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-5 pointer-events-none">
          <TrendingDown className="w-32 h-32 text-rose-500" />
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
            Total Monthly Expense
          </span>
          <div className="p-2.5 bg-rose-500/10 text-rose-500 rounded-xl">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
        <div className="flex flex-col">
          <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 uppercase">
            {formatMoney(totalExpense)}
          </h3>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 font-mono">
            Rent, utilities, shopping, lifestyle logs
          </p>
        </div>
      </div>

      {/* CARD 4: Savings Ratio */}
      <div
        id="kpi-savings-ratio"
        className="glass-card stat-card stat-purple p-6 relative overflow-hidden flex flex-col justify-center"
      >
        <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-5 pointer-events-none">
          <Percent className="w-32 h-32 text-purple-500" />
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
            Savings Ratio
          </span>
          <div className="p-2.5 bg-purple-500/10 text-purple-500 rounded-xl">
            <Percent className="w-5 h-5" />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-baseline space-x-2">
            <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400 uppercase">
              {savingsRatio}%
            </h3>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Target 35%</span>
          </div>
          {/* Custom progress bar */}
          <div className="progress-bar mt-3.5">
            <div
              className="progress-fill transition-all duration-500"
              style={{ width: `${savingsRatio}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
