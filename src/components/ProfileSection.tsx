/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Mail, Globe, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Country, RegionConfig } from '../types';

interface ProfileSectionProps {
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  country: Country;
  currency: string;
  language: string;
  isPinEnabled: boolean;
  region: RegionConfig;
  darkMode: boolean;
}

export default function ProfileSection({
  name,
  setName,
  email,
  setEmail,
  country,
  currency,
  language,
  isPinEnabled,
  region,
  darkMode,
}: ProfileSectionProps) {
  const [tempName, setTempName] = useState(name);
  const [tempEmail, setTempEmail] = useState(email);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setName(tempName);
    setEmail(tempEmail);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-1 shadow-lg ring-4 ring-emerald-500/10">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-extrabold text-2xl">
              {tempName ? tempName.charAt(0).toUpperCase() : tempEmail.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-teal-500 text-white p-1.5 rounded-full shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-105">{name}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{email}</p>
        </div>
      </div>

      <div className="glass-card p-6 space-y-6">
        <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
          Personal Identity Settings
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 dark:text-slate-500 mb-1">Full Legal Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  id="profile-name-input"
                  type="text"
                  required
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 dark:text-slate-500 mb-1">Authenticated Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  id="profile-email-input"
                  type="email"
                  required
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-slate-101' : 'bg-slate-50 border-slate-202 text-slate-800'
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-dashed border-slate-100 dark:border-slate-800">
            <div>
              <span className="block text-slate-400 dark:text-slate-500 mb-0.5">Primary Region</span>
              <span className="font-bold text-slate-800 dark:text-slate-250 flex items-center space-x-1">
                <span>{country}</span>
              </span>
            </div>
            <div>
              <span className="block text-slate-400 dark:text-slate-500 mb-0.5">Primary Currency</span>
              <span className="font-bold text-emerald-500">{currency} ({region.currencySymbol})</span>
            </div>
            <div>
              <span className="block text-slate-400 dark:text-slate-500 mb-0.5">Active Language</span>
              <span className="font-bold text-slate-800 dark:text-slate-250">{language}</span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isPinEnabled ? (
                <span className="inline-flex items-center space-x-1.5 text-slate-450 text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full font-bold">
                  <span>Passcode PIN Enabled</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1.5 text-slate-450 text-[10px] bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2.5 py-1 rounded-full font-bold">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Passcode PIN Disabled</span>
                </span>
              )}
            </div>

            <button
              id="profile-save-btn"
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg transition duration-150 cursor-pointer flex items-center space-x-1 shadow-md shadow-emerald-500/10"
            >
              {isSaved ? <CheckCircle2 className="w-4 h-4 animate-bounce" /> : <Sparkles className="w-4 h-4" />}
              <span>{isSaved ? 'Changes Saved' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
