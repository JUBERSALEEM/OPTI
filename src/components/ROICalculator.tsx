/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calculator, Percent, Clock, Calendar, ArrowUpRight, TrendingUp, Sparkles, Database } from 'lucide-react';
import { RegionConfig } from '../types';

interface ROICalculatorProps {
  region: RegionConfig;
  darkMode: boolean;
}

export default function ROICalculator({ region, darkMode }: ROICalculatorProps) {
  const symbol = region.currencySymbol;

  // Form states
  const [initialCapital, setInitialCapital] = useState('10000');
  const [monthlyDeposit, setMonthlyDeposit] = useState('500');
  const [expectedRate, setExpectedRate] = useState('8');
  const [years, setYears] = useState('10');

  // Calculations
  const p = Number(initialCapital) || 0;
  const pmt = Number(monthlyDeposit) || 0;
  const r = (Number(expectedRate) || 0) / 100 / 12; // monthly rate
  const n = (Number(years) || 1) * 12; // total monthly periods

  let totalFutureValue = p;
  let totalInvested = p;

  if (r > 0) {
    // FV of initial investment: P * (1 + r)^n
    const fvInitial = p * Math.pow(1 + r, n);
    // FV of monthly deposits: PMT * [((1 + r)^n - 1) / r] * (1 + r) (assuming deposits at beginning of period)
    const fvDeposits = pmt * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    totalFutureValue = fvInitial + fvDeposits;
  } else {
    // If rate is 0
    totalFutureValue = p + pmt * n;
  }

  totalInvested = p + pmt * n;
  const compoundInterestGains = Math.max(0, totalFutureValue - totalInvested);
  const totalROI = totalInvested > 0 ? (compoundInterestGains / totalInvested) * 100 : 0;

  const formatMoney = (val: number) => {
    return `${symbol}${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  // Generate projections for a compound timeline rows
  const timelineProjections = [];
  const yearsInt = Math.max(1, Math.min(40, Math.floor(Number(years) || 10)));
  const monthlyRateVal = (Number(expectedRate) || 0) / 100 / 12;

  for (let yr = 1; yr <= yearsInt; yr++) {
    const monthsPeriod = yr * 12;
    let fValue = p;
    if (monthlyRateVal > 0) {
      const fvInit = p * Math.pow(1 + monthlyRateVal, monthsPeriod);
      const fvDep = pmt * ((Math.pow(1 + monthlyRateVal, monthsPeriod) - 1) / monthlyRateVal) * (1 + monthlyRateVal);
      fValue = fvInit + fvDep;
    } else {
      fValue = p + pmt * monthsPeriod;
    }
    const investedCur = p + pmt * monthsPeriod;
    timelineProjections.push({
      year: yr,
      totalVal: fValue,
      invested: investedCur,
      gains: Math.max(0, fValue - investedCur),
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* LEFT COLUMN: Input sliders / controls */}
      <div id="roi-inputs-panel" className="lg:col-span-5">
        <div className="glass-card p-6 space-y-5">
          <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 text-emerald-500 rounded-xl">
              <Calculator className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Future Wealth Projection</h3>
              <p className="text-xs text-slate-400">Play with interest rates, initial capital and compound windows</p>
            </div>
          </div>

          <div className="space-y-4 text-xs font-mono">
            {/* Initial Capital */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-slate-400">Initial Investment Capital</span>
                <span className="font-bold text-slate-800 dark:text-white">{formatMoney(p)}</span>
              </div>
              <input
                id="roi-slider-initial"
                type="range"
                min="0"
                max="500000"
                step="5000"
                value={initialCapital}
                onChange={(e) => setInitialCapital(e.target.value)}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-505"
              />
            </div>

            {/* Monthly Inflow */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-slate-400">Monthly Contribution deposit</span>
                <span className="font-bold text-slate-800 dark:text-white">{formatMoney(pmt)}/mo</span>
              </div>
              <input
                id="roi-slider-monthly"
                type="range"
                min="0"
                max="50000"
                step="500"
                value={monthlyDeposit}
                onChange={(e) => setMonthlyDeposit(e.target.value)}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-505"
              />
            </div>

            {/* Interest Rate */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-slate-400">Expected Annual Returns rate (ROI %)</span>
                <span className="font-bold text-emerald-500">{expectedRate}%</span>
              </div>
              <input
                id="roi-slider-rate"
                type="range"
                min="1"
                max="40"
                step="0.5"
                value={expectedRate}
                onChange={(e) => setExpectedRate(e.target.value)}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-505"
              />
            </div>

            {/* Target Window */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-slate-400">Investment Target Window</span>
                <span className="font-bold text-slate-800 dark:text-white">{years} Years</span>
              </div>
              <input
                id="roi-slider-years"
                type="range"
                min="1"
                max="40"
                step="1"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-505"
              />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Calculation metrics & projection ledger */}
      <div id="roi-results-panel" className="lg:col-span-7">
        <div className="glass-card p-6 flex flex-col h-full">
          
          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-4">Calculated Compounding Horizon</h4>

          {/* KPI Output Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-slate-100 dark:border-slate-800 font-mono text-center">
            <div className="p-3 bg-slate-50 dark:bg-slate-850/50 rounded-xl border border-slate-200/40 dark:border-slate-700/40">
              <span className="block text-[10px] text-slate-400 uppercase mb-1">Total Invested</span>
              <span className="font-extrabold text-sm text-slate-905 dark:text-slate-100">{formatMoney(totalInvested)}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-850/50 rounded-xl border border-slate-200/40 dark:border-slate-700/40">
              <span className="block text-[10px] text-slate-400 uppercase mb-1">Interest earned</span>
              <span className="font-extrabold text-sm text-emerald-500">+{formatMoney(compoundInterestGains)}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-850/50 rounded-xl border border-slate-200/40 dark:border-slate-700/40">
              <span className="block text-[10px] text-slate-400 uppercase mb-1">Total Future Worth</span>
              <span className="font-extrabold text-sm text-emerald-500">{formatMoney(totalFutureValue)}</span>
            </div>
          </div>

          {/* Interactive Compound Log Table */}
          <div className="flex-1 overflow-y-auto max-h-[300px] mt-4">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 pb-2">
                  <th className="py-2.5">Year</th>
                  <th className="py-2.5">Total Contributions</th>
                  <th className="py-2.5">Estimated Gains</th>
                  <th className="py-2.5 text-right">Fund Valuation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-slate-600 dark:text-slate-350">
                {timelineProjections.map((row) => (
                  <tr key={row.year} className="hover:bg-slate-50/10 dark:hover:bg-slate-850/10">
                    <td className="py-2 font-bold text-slate-800 dark:text-slate-100">Yr {row.year}</td>
                    <td className="py-2">{formatMoney(row.invested)}</td>
                    <td className="py-2 text-emerald-500 font-semibold flex items-center space-x-1.5">
                      <span>+{formatMoney(row.gains)}</span>
                    </td>
                    <td className="py-2 text-right font-extrabold text-slate-850 dark:text-slate-100">{formatMoney(row.totalVal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
