/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CreditCard, Plus, Trash2, ArrowUpRight, ArrowDownRight, Sparkles, Milestone } from 'lucide-react';
import { Investment, RegionConfig } from '../types';

interface InvestmentSectionProps {
  investments: Investment[];
  onAddInvestment: (inv: Omit<Investment, 'id'>) => void;
  onDeleteInvestment: (id: string) => void;
  region: RegionConfig;
  darkMode: boolean;
}

const ASSET_TYPES = ['Stocks', 'Mutual Funds', 'Gold', 'Bonds', 'ETFs', 'Real Estate'] as const;

export default function InvestmentSection({
  investments,
  onAddInvestment,
  onDeleteInvestment,
  region,
  darkMode,
}: InvestmentSectionProps) {
  const symbol = region.currencySymbol;

  // Investment creation form states
  const [assetName, setAssetName] = useState('');
  const [type, setType] = useState<typeof ASSET_TYPES[number]>('Stocks');
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName || !quantity || !buyPrice || !currentPrice) {
      alert('Kindly fill in all the valuation parameters.');
      return;
    }

    onAddInvestment({
      assetName,
      type,
      quantity: Number(quantity),
      buyPrice: Number(buyPrice),
      currentPrice: Number(currentPrice),
    });

    setAssetName('');
    setQuantity('');
    setBuyPrice('');
    setCurrentPrice('');
    setShowAddForm(false);
  };

  const formatMoney = (val: number) => {
    return `${symbol}${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  const presetAssets = [
    { name: 'Apple Inc. (AAPL)', type: 'Stocks' as const, buy: 175, current: 189 },
    { name: 'NVIDIA (NVDA)', type: 'Stocks' as const, buy: 420, current: 950 },
    { name: 'S&P 500 ETF (VOO)', type: 'ETFs' as const, buy: 380, current: 460 },
    { name: 'Physical Gold Bullion', type: 'Gold' as const, buy: 1950, current: 2350 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <CreditCard className="w-5.5 h-5.5 text-emerald-500" />
            <span>Investment Portfolio Matrix</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Stocks, Mutual Funds, Gold holdings, ETFs & Real estate assets valuation
          </p>
        </div>

        <button
          id="toggle-new-investment-form"
          onClick={() => setShowAddForm(!showAddForm)}
          className="self-start sm:self-center bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 font-semibold text-white px-4 py-2 rounded-xl text-xs transition duration-150 cursor-pointer flex items-center space-x-1.5 shadow-sm shadow-emerald-500/10"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Close Matrix' : 'Register New Asset'}</span>
        </button>
      </div>

      {showAddForm && (
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'} shadow-md max-w-2xl animate-fade-in`}>
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-4">
            Add Wealth Asset to Ledger Portfolio
          </h3>
          <form onSubmit={handleCreate} className="space-y-4 text-xs font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 dark:text-slate-500 mb-1">Asset Class Name</label>
                <input
                  id="asset-input-name"
                  type="text"
                  placeholder="e.g. S&P 500 Index Fund"
                  required
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 dark:text-slate-500 mb-1">Asset Category</label>
                <select
                  id="asset-input-type"
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  {ASSET_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-400 dark:text-slate-500 mb-1">Volume Quantity</label>
                <input
                  id="asset-input-qty"
                  type="number"
                  step="any"
                  placeholder="e.g. 15"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-slate-100 font-bold' : 'bg-slate-50 border-slate-200 text-slate-800 font-bold'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 dark:text-slate-500 mb-1">Buy Purchase Price ({symbol})</label>
                <input
                  id="asset-input-buy-price"
                  type="number"
                  step="any"
                  placeholder="e.g. 140"
                  required
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-slate-100 font-bold' : 'bg-slate-50 border-slate-200 text-slate-800 font-bold'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 dark:text-slate-500 mb-1">Current Price Valued ({symbol})</label>
                <input
                  id="asset-input-current-price"
                  type="number"
                  step="any"
                  placeholder="e.g. 195"
                  required
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-slate-100 font-bold' : 'bg-slate-50 border-slate-200 text-slate-800 font-bold'
                  }`}
                />
              </div>
            </div>

            {/* Quick asset preset triggers */}
            <div>
              <span className="block text-[10px] text-slate-400 uppercase mb-2">Popular Asset Presets</span>
              <div className="flex flex-wrap gap-2 text-[10px]">
                {presetAssets.map((asset) => (
                  <button
                    id={`asset-preset-${asset.name.split(' ')[0]}`}
                    key={asset.name}
                    type="button"
                    onClick={() => {
                      setAssetName(asset.name);
                      setType(asset.type);
                      setQuantity('10');
                      setBuyPrice(asset.buy.toString());
                      setCurrentPrice(asset.current.toString());
                    }}
                    className={`px-3 py-1.5 rounded-full border transition cursor-pointer ${
                      darkMode
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-350 border-slate-700/55'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {asset.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                id="asset-cancel-btn"
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-505 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="asset-save-btn"
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-lg cursor-pointer"
              >
                Save Asset
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MATRIX DISPLAYER */}
      {investments.length === 0 ? (
        <div className={`p-12 text-center rounded-2xl border ${darkMode ? 'bg-slate-900/20 border-slate-850' : 'bg-slate-50/50 border-slate-200/50'}`}>
          <Sparkles className="w-12 h-12 text-slate-350 mx-auto mb-3 animate-pulse" />
          <p className="text-xs font-semibold text-slate-505">No investment items registered.</p>
          <p className="text-[11px] text-slate-400 mt-1">
            Build your portfolio catalog. Register your index funds, properties, stocks, or gold trackers to assess ROI immediately.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {investments.map((inv) => {
            const costBasis = inv.quantity * inv.buyPrice;
            const currentValuation = inv.quantity * inv.currentPrice;
            const netProfit = currentValuation - costBasis;
            const profitPct = inv.buyPrice > 0 ? ((inv.currentPrice - inv.buyPrice) / inv.buyPrice) * 100 : 0;
            const positive = netProfit >= 0;

            return (
              <div
                id={`asset-card-${inv.id}`}
                key={inv.id}
                className="glass-card p-6"
              >
                {/* Header Tag */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 text-[9px] font-bold font-mono uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded">
                      {inv.type}
                    </span>
                    <h4 className="font-extrabold text-slate-800 dark:text-slate-200 mt-1.5 text-sm line-clamp-1 pr-6" title={inv.assetName}>
                      {inv.assetName}
                    </h4>
                  </div>

                  <button
                    id={`delete-asset-btn-${inv.id}`}
                    onClick={() => onDeleteInvestment(inv.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded transition cursor-pointer"
                    title="Remove Asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Pricing values */}
                <div className="grid grid-cols-2 gap-4 mt-4 py-3 border-y border-slate-100 dark:border-slate-800 text-xs font-mono">
                  <div>
                    <span className="text-slate-405 block text-[10px]">Buy Price</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{formatMoney(inv.buyPrice)}</span>
                  </div>
                  <div>
                    <span className="text-slate-405 block text-[10px]">Live Price</span>
                    <span className="font-bold text-slate-850 dark:text-slate-100">{formatMoney(inv.currentPrice)}</span>
                  </div>
                  <div>
                    <span className="text-slate-405 block text-[10px]">Holdings Volume</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{inv.quantity.toLocaleString()} units</span>
                  </div>
                  <div>
                    <span className="text-slate-405 block text-[10px]">Cost Basis</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{formatMoney(costBasis)}</span>
                  </div>
                </div>

                {/* Profit Metrics */}
                <div className="flex items-center justify-between pt-4">
                  <div>
                    <span className="text-slate-405 block text-[10px]">Current Valuation</span>
                    <span className="font-extrabold text-sm text-slate-900 dark:text-slate-50">{formatMoney(currentValuation)}</span>
                  </div>

                  {/* PROFIT BADGES */}
                  <div className={`p-2.5 rounded-xl flex items-center space-x-1.5 ${
                    positive
                      ? 'bg-emerald-100/40 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                      : 'bg-rose-100/40 text-rose-600 dark:bg-rose-955/20 dark:text-rose-450'
                  }`}>
                    {positive ? <ArrowUpRight className="w-4 h-4 animate-bounce" /> : <ArrowDownRight className="w-4 h-4" />}
                    <div className="text-right font-mono text-xs">
                      <span className="block font-extrabold">{positive ? '+' : ''}{profitPct.toFixed(1)}%</span>
                      <span className="text-[10px] opacity-90">{positive ? '+' : ''}{formatMoney(netProfit)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
