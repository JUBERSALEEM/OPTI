/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Landmark, Globe, CreditCard, Languages, Shield, User, Wallet, Moon, Sun, Calculator } from 'lucide-react';
import { Country, Currency, Language, RegionConfig, ActiveTab } from '../types';

export const countryConfigs: Record<Country, RegionConfig> = {
  India: {
    country: 'India',
    currency: 'INR',
    currencySymbol: '₹',
    phoneCode: '+91',
    languages: ['English', 'Hindi'],
    selectedLanguage: 'English',
  },
  UAE: {
    country: 'UAE',
    currency: 'AED',
    currencySymbol: 'د.إ',
    phoneCode: '+971',
    languages: ['English', 'Arabic'],
    selectedLanguage: 'English',
  },
  USA: {
    country: 'USA',
    currency: 'USD',
    currencySymbol: '$',
    phoneCode: '+1',
    languages: ['English'],
    selectedLanguage: 'English',
  },
};

interface HeaderProps {
  country: Country;
  setCountry: (country: Country) => void;
  language: string;
  setLanguage: (lang: string) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  userEmail: string;
}

export default function Header({
  country,
  setCountry,
  language,
  setLanguage,
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  userEmail,
}: HeaderProps) {
  const currentConfig = countryConfigs[country];

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextCountry = e.target.value as Country;
    setCountry(nextCountry);
    const nextConfigs = countryConfigs[nextCountry];
    setLanguage(nextConfigs.languages[0]);
  };

  const navItems: { tab: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { tab: 'Home', label: 'Dashboard', icon: <Landmark className="w-4 h-4" /> },
    { tab: 'Ledgers', label: 'Ledgers', icon: <Wallet className="w-4 h-4" /> },
    { tab: 'Investments', label: 'Investments', icon: <CreditCard className="w-4 h-4" /> },
    { tab: 'ROI Calculator', label: 'ROI Calculator', icon: <Calculator className="w-4 h-4" /> },
    { tab: 'Savings Goals', label: 'Savings Goals', icon: <Globe className="w-4 h-4" /> },
    { tab: 'Reports', label: 'Reports', icon: <Languages className="w-4 h-4" /> },
    { tab: 'Security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { tab: 'Profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <header className={`border-b ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/95 border-slate-200'} sticky top-0 z-40 backdrop-blur-md transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          {/* Logo & Version */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl shadow-md text-white">
                <Landmark className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                    Finance Flow
                  </h1>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    v1.0
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {userEmail}
                </p>
              </div>
            </div>

            {/* Dark mode & Mobile Settings quick switch */}
            <div className="flex items-center space-x-2 md:hidden">
              <button
                id="mob_dark_mode_toggle"
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Info & Localization Selection Bar */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Country Picker */}
            <div className="flex items-center space-x-1 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400">Country:</span>
              <select
                id="country-selector"
                value={country}
                onChange={handleCountryChange}
                className="font-semibold text-slate-800 dark:text-slate-200 bg-transparent border-none focus:outline-none cursor-pointer"
              >
                <option value="India" className="bg-slate-50 dark:bg-slate-900">India 🇮🇳</option>
                <option value="UAE" className="bg-slate-50 dark:bg-slate-900">UAE 🇦🇪</option>
                <option value="USA" className="bg-slate-50 dark:bg-slate-900">USA 🇺🇸</option>
              </select>
            </div>

            {/* Currency Indicator */}
            <div className="flex items-center space-x-1 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400">Currency:</span>
              <span className="font-bold text-emerald-500">
                {currentConfig.currency} {currentConfig.currencySymbol}
              </span>
            </div>

            {/* Language Selection */}
            <div className="flex items-center space-x-1 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400">Language:</span>
              <select
                id="language-selector"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="font-semibold text-slate-800 dark:text-slate-200 bg-transparent border-none focus:outline-none cursor-pointer"
              >
                {currentConfig.languages.map((lang) => (
                  <option key={lang} value={lang} className="bg-slate-50 dark:bg-slate-900">
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Desktop Dark Mode Toggle */}
            <button
              id="desktop_dark_mode_toggle"
              onClick={() => setDarkMode(!darkMode)}
              className="hidden md:flex p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-800 cursor-pointer"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="overflow-x-auto scrollbar-none flex items-center justify-between py-1 -mb-px">
          <nav className="flex space-x-1 min-w-max pb-1">
            {navItems.map((item) => {
              const active = activeTab === item.tab;
              return (
                <button
                  id={`nav-tab-${item.tab}`}
                  key={item.tab}
                  onClick={() => setActiveTab(item.tab)}
                  className={`flex items-center space-x-2 px-3.5 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-500 border-b-2 border-emerald-500 font-semibold'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
