/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Coins, Plus, Trash2, ArrowUpRight, ArrowDownRight, RefreshCw, Smartphone } from 'lucide-react';
import { CryptoAsset, RegionConfig } from '../types';

interface CryptoSectionProps {
  cryptoAssets: CryptoAsset[];
  onAddCrypto: (crypto: Omit<CryptoAsset, 'id'>) => void;
  onDeleteCrypto: (id: string) => void;
  region: RegionConfig;
  darkMode: boolean;
}

const CRYPTO_CHOICES = ['Bitcoin', 'Ethereum', 'Solana', 'XRP', 'Others'] as const;

export default function CryptoSection({
  cryptoAssets,
  onAddCrypto,
  onDeleteCrypto,
  region,
  darkMode,
}: CryptoSectionProps) {
  const symbol = region.currencySymbol;

  // State for creating new Crypto entries
  const [coin, setCoin] = useState<typeof CRYPTO_CHOICES[number]>('Bitcoin');
  const [customCoin, setCustomCoin] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantity || !buyPrice || !currentPrice) {
      alert('Kindly fill in all standard transaction fields.');
      return;
    }

    const resolvedCoinName = coin === 'Others' ? (customCoin.trim() || 'Altcoin') : coin;

    onAddCrypto({
      coin: resolvedCoinName as any,
      quantity: Number(quantity),
      buyPrice: Number(buyPrice),
      currentPrice: Number(currentPrice),
    });

    setCustomCoin('');
    setQuantity('');
    setBuyPrice('');
    setCurrentPrice('');
    setShowAddForm(false);
  };

  const formatMoney = (val: number) => {
    return `${symbol}${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  const cryptoPresets = {
    Bitcoin: { buy: 62000, current: 67300 },
    Ethereum: { buy: 3100, current: 3510 },
    Solana: { buy: 130, current: 148 },
    XRP: { buy: 0.48, current: 0.52 },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Coins className="w-5.5 h-5.5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Digital Assets & Cryptocurrencies</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Realize capital changes inside Bitcoin, Ethereum, Solana & high-volume digital holdings
          </p>
        </div>

        <button
          id="toggle-crypto-form"
          onClick={() => setShowAddForm(!showAddForm)}
          className="self-start sm:self-center bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 font-semibold text-white px-4 py-2 rounded-xl text-xs transition duration-150 cursor-pointer flex items-center space-x-1.5 shadow-sm shadow-amber-552/10"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Close Portal' : 'Register Web3 Coins'}</span>
        </button>
      </div>

      {showAddForm && (
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'} shadow-md max-w-xl animate-fade-in`}>
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-4 text-amber-550 flex items-center space-x-1">
            <span>Web3 Digital Ledger Lock</span>
          </h3>
          <form onSubmit={handleCreate} className="space-y-4 text-xs font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 dark:text-slate-500 mb-1">Cryptocurrency Asset</label>
                <select
                  id="crypto-input-coin"
                  value={coin}
                  onChange={(e) => {
                    const selected = e.target.value as any;
                    setCoin(selected);
                    if (selected !== 'Others' && cryptoPresets[selected as keyof typeof cryptoPresets]) {
                      setBuyPrice(cryptoPresets[selected as keyof typeof cryptoPresets].buy.toString());
                      setCurrentPrice(cryptoPresets[selected as keyof typeof cryptoPresets].current.toString());
                    }
                  }}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  {CRYPTO_CHOICES.map((choice) => (
                    <option key={choice} value={choice}>{choice}</option>
                  ))}
                </select>
                {coin === 'Others' && (
                  <input
                    id="crypto-input-custom-coin"
                    type="text"
                    required
                    placeholder="Enter Coin Ticker (e.g. ADA, DOT)"
                    value={customCoin}
                    onChange={(e) => setCustomCoin(e.target.value)}
                    className={`w-full mt-2 px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-amber-505 ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                )}
              </div>

              <div>
                <label className="block text-slate-400 dark:text-slate-500 mb-1">Quantity (Coins)</label>
                <input
                  id="crypto-input-qty"
                  type="number"
                  step="any"
                  placeholder="0.045"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-slate-100 font-bold' : 'bg-slate-50 border-slate-200 text-slate-850 font-bold'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 dark:text-slate-500 mb-1">Buy Price Base ({symbol})</label>
                <input
                  id="crypto-input-buy-price"
                  type="number"
                  step="any"
                  placeholder="45000"
                  required
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-850'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 dark:text-slate-500 mb-1">Current Price ({symbol})</label>
                <input
                  id="crypto-input-current-price"
                  type="number"
                  step="any"
                  placeholder="65000"
                  required
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-850'
                  }`}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                id="crypto-cancel-btn"
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-850 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="crypto-save-btn"
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-lg cursor-pointer"
              >
                Launch Coin holding
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CRYPTO PORTFOLIO LIST */}
      {cryptoAssets.length === 0 ? (
        <div className={`p-12 text-center rounded-2xl border ${darkMode ? 'bg-slate-900/20 border-slate-850' : 'bg-slate-50/50 border-slate-200/50'}`}>
          <Coins className="w-12 h-12 text-slate-350 mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-505">No cryptocurrency transactions found.</p>
          <p className="text-[11px] text-slate-400 mt-1">
            Track digital coins independently from traditional investments. Log your Bitcoin, Solana or ERC-20 assets.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cryptoAssets.map((asset) => {
            const costBasis = asset.quantity * asset.buyPrice;
            const currentValuation = asset.quantity * asset.currentPrice;
            const netProfit = currentValuation - costBasis;
            const roiPct = asset.buyPrice > 0 ? ((asset.currentPrice - asset.buyPrice) / asset.buyPrice) * 100 : 0;
            const positive = netProfit >= 0;

            return (
              <div
                id={`crypto-card-${asset.id}`}
                key={asset.id}
                className="glass-card p-6 relative overflow-hidden"
              >
                {/* Background glow emblem */}
                <div className="absolute right-0 top-0 p-6 transform translate-x-4 -translate-y-4 opacity-5 text-amber-500 pointer-events-none">
                  <Coins className="w-24 h-24" />
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-850 dark:text-slate-105 text-sm">
                      {asset.coin}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {asset.quantity.toLocaleString(undefined, { maximumFractionDigits: 5 })} units
                    </p>
                  </div>

                  <button
                    id={`delete-crypto-btn-${asset.id}`}
                    onClick={() => onDeleteCrypto(asset.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded transition cursor-pointer z-10"
                    title="Remove asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Coin indicators */}
                <div className="grid grid-cols-2 gap-4 mt-4 py-3 border-y border-slate-100 dark:border-slate-800 text-xs font-mono">
                  <div>
                    <span className="text-slate-405 block text-[10px]">Buy Exchange Price</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{formatMoney(asset.buyPrice)}</span>
                  </div>
                  <div>
                    <span className="text-slate-405 block text-[10px]">Current Asset Price</span>
                    <span className="font-bold text-slate-850 dark:text-slate-100">{formatMoney(asset.currentPrice)}</span>
                  </div>
                  <div>
                    <span className="text-slate-405 block text-[10px]">Total Invested</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{formatMoney(costBasis)}</span>
                  </div>
                  <div>
                    <span className="text-slate-405 block text-[10px]">Digital Holding Value</span>
                    <span className="font-bold text-slate-850 dark:text-slate-100">{formatMoney(currentValuation)}</span>
                  </div>
                </div>

                {/* Digital returns */}
                <div className="flex items-center justify-between pt-4">
                  <div>
                    <span className="text-slate-405 block text-[10px]">Profits / Returns</span>
                    <span className={`font-extrabold text-sm ${positive ? 'text-emerald-550 dark:text-emerald-400' : 'text-rose-600'}`}>
                      {positive ? '+' : ''}{formatMoney(netProfit)}
                    </span>
                  </div>

                  <div className={`px-2.5 py-1.5 rounded-xl font-mono text-xs font-bold leading-none ${
                    positive
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  }`}>
                    {positive ? '+' : ''}{roiPct.toFixed(2)}% ROI
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
