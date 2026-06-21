/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Unlock, KeyRound, ArrowRight, Landmark, RefreshCw, Eye, Sparkles, Coins, TrendingUp, FileText, User } from 'lucide-react';
import { Transaction, Investment, CryptoAsset, SavingsGoal, Country, RegionConfig, ActiveTab, UserProfile } from './types';
import Header, { countryConfigs } from './components/Header';
import DashboardKPIs from './components/DashboardKPIs';
import AnalyticsSection from './components/AnalyticsSection';
import LedgerSection from './components/LedgerSection';
import SavingsGoalsSection from './components/SavingsGoalsSection';
import InvestmentSection from './components/InvestmentSection';
import CryptoSection from './components/CryptoSection';
import ReportSection from './components/ReportSection';
import ROICalculator from './components/ROICalculator';
import SecuritySection from './components/SecuritySection';
import ProfileSection from './components/ProfileSection';
import GeminiAssistant from './components/GeminiAssistant';

// High-fidelity Deluxe Datasets for outstanding initial state feel
const initialTransactions: Transaction[] = [
  { id: 'tx-1', type: 'income', category: 'Salary', amount: 185000, date: '2026-06-01', account: 'Bank', notes: 'Monthly corporate executive salary' },
  { id: 'tx-2', type: 'income', category: 'Freelance', amount: 35000, date: '2026-06-12', account: 'Savings', notes: 'UI architecture advisory retainer' },
  { id: 'tx-3', type: 'expense', category: 'Rent', amount: 45000, date: '2026-06-02', account: 'Savings', notes: 'Duplex lease apartment' },
  { id: 'tx-4', type: 'expense', category: 'Food', amount: 6200, date: '2026-06-05', account: 'Cash', notes: 'Weekly organic groceries' },
  { id: 'tx-5', type: 'expense', category: 'Medical', amount: 15000, date: '2026-06-15', account: 'Credit Card', notes: 'Laser dental work' },
  { id: 'tx-6', type: 'expense', category: 'Shopping', amount: 12500, date: '2026-06-10', account: 'Credit Card', notes: 'Leather boots and wear' },
  { id: 'tx-7', type: 'expense', category: 'Fuel', amount: 4800, date: '2026-06-18', account: 'Cash', notes: 'Premium gas refuel' },
  { id: 'tx-8', type: 'expense', category: 'Food', amount: 3200, date: '2026-06-20', account: 'Credit Card', notes: 'Sushi corporate dinner' }
];

const initialSavingsGoals: SavingsGoal[] = [
  { id: 'goal-1', name: 'Emergency Reserves Fund', targetAmount: 150000, savedAmount: 90000, deadline: '2026-12-31' },
  { id: 'goal-2', name: 'Sister College Graduation', targetAmount: 500000, savedAmount: 180000, deadline: '2027-04-15' },
  { id: 'goal-3', name: 'Father Healthcare Lock', targetAmount: 200000, savedAmount: 85000, deadline: '2026-11-30' }
];

const initialInvestments: Investment[] = [
  { id: 'inv-1', assetName: 'NVIDIA Corporation (NVDA)', type: 'Stocks', quantity: 20, buyPrice: 420, currentPrice: 950 },
  { id: 'inv-2', assetName: 'Vanguard S&P 500 Index ETF (VOO)', type: 'ETFs', quantity: 45, buyPrice: 380, currentPrice: 460 },
  { id: 'inv-3', assetName: 'Physical Gold Bullion Coin', type: 'Gold', quantity: 8, buyPrice: 1950, currentPrice: 2350 }
];

const initialCrypto: CryptoAsset[] = [
  { id: 'cry-1', coin: 'Bitcoin', quantity: 0.75, buyPrice: 58000, currentPrice: 67300 },
  { id: 'cry-2', coin: 'Ethereum', quantity: 4.2, buyPrice: 2850, currentPrice: 3510 },
  { id: 'cry-3', coin: 'Solana', quantity: 50, buyPrice: 110, currentPrice: 148 }
];

export default function App() {
  // Localization state
  const [country, setCountry] = useState<Country>('India');
  const [language, setLanguage] = useState<string>('English');

  // Interface state
  const [activeTab, setActiveTab] = useState<ActiveTab>('Home');
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Profile data
  const [userName, setUserName] = useState<string>('Yash Vardhan');
  const [userEmail, setUserEmail] = useState<string>('ffyassh@gmail.com');

  // Security Lock state
  const [isPinEnabled, setIsPinEnabled] = useState<boolean>(false);
  const [securityPin, setSecurityPin] = useState<string>('');
  const [pinUnlocked, setPinUnlocked] = useState<boolean>(true);
  const [pinEntry, setPinEntry] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);

  // Financial collections
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(initialSavingsGoals);
  const [investments, setInvestments] = useState<Investment[]>(initialInvestments);
  const [cryptoAssets, setCryptoAssets] = useState<CryptoAsset[]>(initialCrypto);

  // Analytics slice filters
  const [analyticsFilter, setAnalyticsFilter] = useState<'All' | 'Day' | 'Week' | 'Month' | 'Year' | 'Custom'>('All');
  const [dateFrom, setDateFrom] = useState<string>('2026-06-01');
  const [dateTo, setDateTo] = useState<string>('2026-06-30');

  // 1. Initial hydration from local storage
  useEffect(() => {
    try {
      const storedCountry = localStorage.getItem('ff_country');
      if (storedCountry) setCountry(storedCountry as Country);

      const storedLang = localStorage.getItem('ff_language');
      if (storedLang) setLanguage(storedLang);

      const storedDarkMode = localStorage.getItem('ff_darkMode');
      if (storedDarkMode) setDarkMode(storedDarkMode === 'true');

      const storedName = localStorage.getItem('ff_userName');
      if (storedName) setUserName(storedName);

      const storedEmail = localStorage.getItem('ff_userEmail');
      if (storedEmail) setUserEmail(storedEmail);

      const storedPinEnabled = localStorage.getItem('ff_isPinEnabled');
      if (storedPinEnabled) {
        const enabled = storedPinEnabled === 'true';
        setIsPinEnabled(enabled);
        if (enabled) {
          setPinUnlocked(false); // Enable lock screen on startup if active
        }
      }

      const storedPinValue = localStorage.getItem('ff_securityPin');
      if (storedPinValue) setSecurityPin(storedPinValue);

      const storedTxs = localStorage.getItem('ff_transactions');
      if (storedTxs) setTransactions(JSON.parse(storedTxs));

      const storedGoals = localStorage.getItem('ff_savingsGoals');
      if (storedGoals) setSavingsGoals(JSON.parse(storedGoals));

      const storedInvs = localStorage.getItem('ff_investments');
      if (storedInvs) setInvestments(JSON.parse(storedInvs));

      const storedCrypto = localStorage.getItem('ff_cryptoAssets');
      if (storedCrypto) setCryptoAssets(JSON.parse(storedCrypto));
    } catch (e) {
      console.error('Error hydating persistent assets:', e);
    }
  }, []);

  // 2. Synchronize states with persistent layers
  useEffect(() => {
    localStorage.setItem('ff_country', country);
  }, [country]);

  useEffect(() => {
    localStorage.setItem('ff_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('ff_darkMode', darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('ff_userName', userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('ff_userEmail', userEmail);
  }, [userEmail]);

  useEffect(() => {
    localStorage.setItem('ff_isPinEnabled', isPinEnabled.toString());
  }, [isPinEnabled]);

  useEffect(() => {
    localStorage.setItem('ff_securityPin', securityPin);
  }, [securityPin]);

  useEffect(() => {
    localStorage.setItem('ff_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('ff_savingsGoals', JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  useEffect(() => {
    localStorage.setItem('ff_investments', JSON.stringify(investments));
  }, [investments]);

  useEffect(() => {
    localStorage.setItem('ff_cryptoAssets', JSON.stringify(cryptoAssets));
  }, [cryptoAssets]);

  // Derived regional specifics
  const currentRegion = countryConfigs[country];

  // Financial actions
  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const tx: Transaction = {
      ...newTx,
      id: 'tx-' + Date.now(),
    };
    setTransactions((prev) => [tx, ...prev]);

    // SMART AUTO WORKFLOW: If account is "Savings", we can automatically find any savings goals that are not yet satisfied
    // and allocate some savings towards them as a delighting detail!
    if (tx.type === 'expense' && tx.account === 'Savings') {
       // Also treat savings accounts expense as allocation decrease, but if income or dedicated transfer to savings, top up goals!
    } else if (tx.type === 'income' && tx.account === 'Savings') {
       // Auto-topup first uncompleted savings goal!
       const firstGoal = savingsGoals.find(g => g.savedAmount < g.targetAmount);
       if (firstGoal) {
          const added = Math.min(firstGoal.targetAmount - firstGoal.savedAmount, tx.amount);
          handleUpdateGoalSaved(firstGoal.id, firstGoal.savedAmount + added);
       }
    }
  };

  const handleUpdateTransaction = (id: string, updatedFields: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedFields } : t))
    );
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddGoal = (newGoal: Omit<SavingsGoal, 'id'>) => {
    const goal: SavingsGoal = {
      ...newGoal,
      id: 'goal-' + Date.now(),
    };
    setSavingsGoals((prev) => [...prev, goal]);
  };

  const handleUpdateGoalSaved = (id: string, newAmount: number) => {
    setSavingsGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, savedAmount: newAmount } : g))
    );
  };

  const handleDeleteGoal = (id: string) => {
    setSavingsGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const handleAddInvestment = (newInv: Omit<Investment, 'id'>) => {
    const inv: Investment = {
      ...newInv,
      id: 'inv-' + Date.now(),
    };
    setInvestments((prev) => [...prev, inv]);
  };

  const handleDeleteInvestment = (id: string) => {
    setInvestments((prev) => prev.filter((inv) => inv.id !== id));
  };

  const handleAddCrypto = (newCry: Omit<CryptoAsset, 'id'>) => {
    const cry: CryptoAsset = {
      ...newCry,
      id: 'cry-' + Date.now(),
    };
    setCryptoAssets((prev) => [...prev, cry]);
  };

  const handleDeleteCrypto = (id: string) => {
    setCryptoAssets((prev) => prev.filter((cry) => cry.id !== id));
  };

  // Safe Passcode Verification Handler
  const handlePinUnlock = () => {
    if (pinEntry === securityPin) {
      setPinUnlocked(true);
      setPinEntry('');
      setPinError(null);
    } else {
      setPinError('Access Denied. Passcode is incorrect.');
      setPinEntry('');
    }
  };

  // Perform timeline chronological query filtering for the dashboard analytics
  const filterTransactionsByPeriod = (txList: Transaction[], period: string, fromDateText: string, toDateText: string) => {
    const now = new Date('2026-06-20'); // static context time from instructions
    return txList.filter((tx) => {
      const txDate = new Date(tx.date);
      if (!tx.date) return false;

      if (period === 'All') return true;

      if (period === 'Day') {
        return tx.date === '2026-06-20';
      }

      if (period === 'Week') {
        const diffTime = Math.abs(now.getTime() - txDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      }

      if (period === 'Month') {
        return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
      }

      if (period === 'Year') {
        return txDate.getFullYear() === now.getFullYear();
      }

      if (period === 'Custom') {
        if (!fromDateText || !toDateText) return true;
        return tx.date >= fromDateText && tx.date <= toDateText;
      }

      return true;
    });
  };

  const filteredTransactions = filterTransactionsByPeriod(transactions, analyticsFilter, dateFrom, dateTo);

  return (
    <div className={darkMode ? 'dark bg-slate-950 text-slate-100 min-h-screen transition-colors duration-200' : 'bg-slate-50 text-slate-800 min-h-screen transition-colors duration-200'}>
      
      {/* 🔐 SECURITY PIN ACCESS LOCK SCREEN STAGE */}
      {isPinEnabled && !pinUnlocked ? (
        <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50 px-4 animate-fade-in font-mono text-white">
          <div className="text-center space-y-6 max-w-sm w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
            {/* Shield emblem */}
            <div className="inline-flex p-4 bg-emerald-500/10 text-emerald-500 rounded-full animate-pulse">
              <Lock className="w-10 h-10" />
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                Finance Flow Secure
              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Encrypted Access Gate</p>
            </div>

            <p className="text-xs text-slate-450 px-2 leading-relaxed">
              Kindly input your 4-digit security PIN passcode credentials to unlock audit records.
            </p>

            {/* Locked Visual Bullets */}
            <div className="flex justify-center space-x-3.5 py-2">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full border transition-all ${
                    pinEntry.length > idx
                      ? 'bg-emerald-450 border-emerald-400 scale-110 shadow-md shadow-emerald-500/10'
                      : 'border-slate-750 bg-slate-850'
                  }`}
                />
              ))}
            </div>

            {pinError && (
              <p className="text-[11px] text-rose-500 font-bold bg-rose-500/10 py-1.5 px-3 rounded-lg animate-bounce">
                {pinError}
              </p>
            )}

            {/* Numerical Keypad panel */}
            <div className="grid grid-cols-3 gap-3.5 py-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  id={`pin-key-${num}`}
                  key={num}
                  onClick={() => {
                    if (pinEntry.length < 4) {
                      setPinEntry((prev) => prev + num);
                      setPinError(null);
                    }
                  }}
                  className="p-3.5 text-base font-extrabold rounded-full bg-slate-800 hover:bg-slate-750 transition-all font-mono hover:scale-105 cursor-pointer"
                >
                  {num}
                </button>
              ))}
              <button
                id="pin-key-back"
                onClick={() => setPinEntry((prev) => prev.slice(0, -1))}
                className="p-3.5 text-xs text-rose-450 font-bold rounded-full hover:bg-rose-500/10 transition cursor-pointer"
              >
                Clear
              </button>
              <button
                id="pin-key-0"
                onClick={() => {
                  if (pinEntry.length < 4) {
                    setPinEntry((prev) => prev + '0');
                    setPinError(null);
                  }
                }}
                className="p-3.5 text-base font-extrabold rounded-full bg-slate-850 hover:bg-slate-750 cursor-pointer"
              >
                0
              </button>
              <button
                id="pin-key-unlock"
                onClick={handlePinUnlock}
                className="p-3.5 text-xs text-emerald-450 font-bold rounded-full hover:bg-emerald-500/10 transition cursor-pointer"
              >
                Unlock
              </button>
            </div>

            {/* Reset All Security Emergency Valve */}
            <button
               id="pin-lock-factory-reset"
               onClick={() => {
                  if (confirm("Resetting database sweeps and purges all local storage ledgers. Do you wish to perform factory emergency reset?")) {
                    localStorage.clear();
                    window.location.reload();
                  }
               }}
               className="text-[10px] text-rose-500 hover:underline cursor-pointer block mx-auto pt-2"
            >
               Reset and Purge All Cache
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Main Integrated Layout Header */}
          <Header
            country={country}
            setCountry={setCountry}
            language={language}
            setLanguage={setLanguage}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            userEmail={userEmail}
          />

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
            
            {/* DYNAMIC TAB COMPONENT SWITCH CASE */}
            {activeTab === 'Home' && (
              <div className="space-y-8 animate-fade-in">
                {/* 1. KPI Panel */}
                <DashboardKPIs
                  transactions={filteredTransactions}
                  investments={investments}
                  cryptoAssets={cryptoAssets}
                  savingsGoals={savingsGoals}
                  region={currentRegion}
                  darkMode={darkMode}
                />

                {/* 2. Region & Telephony Quick-View Card */}
                <div className="glass-card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-500/15 text-emerald-400 rounded-lg font-mono">
                      {country === 'India' ? '🇮🇳' : country === 'UAE' ? '🇦🇪' : '🇺🇸'}
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Localization region active: {country}</span>
                      <p className="text-[10px] text-slate-400">Phone Code prefix: {currentRegion.phoneCode} • Language setup: {language}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400 dark:text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>Synchronizing ledger records under {currentRegion.currency} valuer</span>
                  </div>
                </div>

                {/* 3. Analytics Slicers & charts */}
                <AnalyticsSection
                  transactions={transactions}
                  selectedFilter={analyticsFilter}
                  setSelectedFilter={setAnalyticsFilter}
                  dateFrom={dateFrom}
                  setDateFrom={setDateFrom}
                  dateTo={dateTo}
                  setDateTo={setDateTo}
                  region={currentRegion}
                  darkMode={darkMode}
                />

                {/* 4. Active Portfolio distribution helper */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   {/* Stocks and Investments box */}
                   <div className="glass-card p-5">
                     <h3 className="font-bold text-sm mb-3 text-slate-800 dark:text-slate-100">Portfolio Asset Indices</h3>
                     <InvestmentSection
                        investments={investments.slice(0, 3)}
                        onAddInvestment={handleAddInvestment}
                        onDeleteInvestment={handleDeleteInvestment}
                        region={currentRegion}
                        darkMode={darkMode}
                     />
                   </div>
                   
                   {/* Cryptocurrencies Box */}
                   <div className="glass-card p-5">
                     <h3 className="font-bold text-sm mb-3 text-slate-800 dark:text-slate-100">Web3 Crypto Distribution</h3>
                     <CryptoSection
                        cryptoAssets={cryptoAssets.slice(0, 3)}
                        onAddCrypto={handleAddCrypto}
                        onDeleteCrypto={handleDeleteCrypto}
                        region={currentRegion}
                        darkMode={darkMode}
                     />
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'Ledgers' && (
              <div className="animate-fade-in-quick">
                <LedgerSection
                  transactions={transactions}
                  onAddTransaction={handleAddTransaction}
                  onUpdateTransaction={handleUpdateTransaction}
                  onDeleteTransaction={handleDeleteTransaction}
                  region={currentRegion}
                  darkMode={darkMode}
                />
              </div>
            )}

            {activeTab === 'Investments' && (
              <div className="animate-fade-in-quick">
                <InvestmentSection
                  investments={investments}
                  onAddInvestment={handleAddInvestment}
                  onDeleteInvestment={handleDeleteInvestment}
                  region={currentRegion}
                  darkMode={darkMode}
                />
              </div>
            )}

            {activeTab === 'ROI Calculator' && (
              <div className="animate-fade-in-quick">
                <ROICalculator
                  region={currentRegion}
                  darkMode={darkMode}
                />
              </div>
            )}

            {activeTab === 'Savings Goals' && (
              <div className="animate-fade-in-quick">
                <SavingsGoalsSection
                  savingsGoals={savingsGoals}
                  onAddGoal={handleAddGoal}
                  onUpdateGoalSaved={handleUpdateGoalSaved}
                  onDeleteGoal={handleDeleteGoal}
                  region={currentRegion}
                  darkMode={darkMode}
                />
              </div>
            )}

            {activeTab === 'Reports' && (
              <div className="animate-fade-in-quick">
                <ReportSection
                  transactions={transactions}
                  investments={investments}
                  cryptoAssets={cryptoAssets}
                  savingsGoals={savingsGoals}
                  region={currentRegion}
                  darkMode={darkMode}
                />
              </div>
            )}

            {activeTab === 'Security' && (
              <div className="animate-fade-in-quick">
                <SecuritySection
                  isPinEnabled={isPinEnabled}
                  setIsPinEnabled={setIsPinEnabled}
                  securityPin={securityPin}
                  setSecurityPin={setSecurityPin}
                  darkMode={darkMode}
                />
              </div>
            )}

            {activeTab === 'Profile' && (
              <div className="animate-fade-in-quick">
                <ProfileSection
                  name={userName}
                  setName={setUserName}
                  email={userEmail}
                  setEmail={setUserEmail}
                  country={country}
                  currency={currentRegion.currency}
                  language={language}
                  isPinEnabled={isPinEnabled}
                  region={currentRegion}
                  darkMode={darkMode}
                />
              </div>
            )}
          </main>

          {/* 💬 FLOATING AI ASSISTANT PANEL */}
          <GeminiAssistant
            transactions={transactions}
            investments={investments}
            cryptoAssets={cryptoAssets}
            savingsGoals={savingsGoals}
            region={currentRegion}
            darkMode={darkMode}
          />

          {/* 📱 BOTTOM PORTABLE PORTFOLIO BAR */}
          <footer className={`fixed bottom-0 left-0 right-0 py-2.5 px-4 md:hidden border-t ${
            darkMode ? 'bg-slate-905 bg-slate-900 border-slate-800' : 'bg-white border-slate-205'
          } z-40 flex items-center justify-around text-xs font-mono font-bold print:hidden`}>
            <button
              id="mob-nav-home"
              onClick={() => setActiveTab('Home')}
              className={`flex flex-col items-center space-y-0.5 cursor-pointer ${activeTab === 'Home' ? 'text-emerald-500' : 'text-slate-400'}`}
            >
              <Landmark className="w-4 h-4" />
              <span className="text-[10px]">Home</span>
            </button>
            <button
              id="mob-nav-ledgers"
              onClick={() => setActiveTab('Ledgers')}
              className={`flex flex-col items-center space-y-0.5 cursor-pointer ${activeTab === 'Ledgers' ? 'text-emerald-505' : 'text-slate-400'}`}
            >
              <Coins className="w-4 h-4" />
              <span className="text-[10px]">Ledgers</span>
            </button>
            <button
              id="mob-nav-investments"
              onClick={() => setActiveTab('Investments')}
              className={`flex flex-col items-center space-y-0.5 cursor-pointer ${activeTab === 'Investments' ? 'text-emerald-505' : 'text-slate-400'}`}
            >
              <TrendingUp className="w-4 h-4" />
              <span className="text-[10px]">Invest</span>
            </button>
            <button
              id="mob-nav-reports"
              onClick={() => setActiveTab('Reports')}
              className={`flex flex-col items-center space-y-0.5 cursor-pointer ${activeTab === 'Reports' ? 'text-emerald-505' : 'text-slate-400'}`}
            >
              <FileText className="w-4 h-4" />
              <span className="text-[10px]">Reports</span>
            </button>
            <button
              id="mob-nav-profile"
              onClick={() => setActiveTab('Profile')}
              className={`flex flex-col items-center space-y-0.5 cursor-pointer ${activeTab === 'Profile' ? 'text-emerald-505' : 'text-slate-400'}`}
            >
              <User className="w-4 h-4" />
              <span className="text-[10px]">Profile</span>
            </button>
          </footer>
        </>
      )}
    </div>
  );
}
