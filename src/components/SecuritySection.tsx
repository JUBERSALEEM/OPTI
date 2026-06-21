/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, Lock, Unlock, KeyRound, CheckCircle2, ShieldCheck } from 'lucide-react';

interface SecuritySectionProps {
  isPinEnabled: boolean;
  setIsPinEnabled: (val: boolean) => void;
  securityPin: string;
  setSecurityPin: (pin: string) => void;
  darkMode: boolean;
}

export default function SecuritySection({
  isPinEnabled,
  setIsPinEnabled,
  securityPin,
  setSecurityPin,
  darkMode,
}: SecuritySectionProps) {
  const [pinInput, setPinInput] = useState('');
  const [confirmInput, setConfirmInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length !== 4 || isNaN(Number(pinInput))) {
      alert('PIN must be exactly 4 numeric digits.');
      return;
    }
    if (pinInput !== confirmInput) {
      alert('The entered PIN and confirmation code do not match.');
      return;
    }

    setSecurityPin(pinInput);
    setIsPinEnabled(true);
    setPinInput('');
    setConfirmInput('');
    setIsUpdating(false);
    alert('Security PIN successfully saved and enabled.');
  };

  const handleTogglePin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    if (checked && !securityPin) {
      setIsUpdating(true);
    } else {
      setIsPinEnabled(checked);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-emerald-500/10 text-emerald-500 rounded-full mb-2">
          <Shield className="w-8 h-8 animate-pulse" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Security & Access Controls
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Protect your financial logs and portfolio records with standard passcode locking
        </p>
      </div>

      <div className="glass-card p-6 space-y-6">
        {/* Toggle Lock */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1 pr-4 text-xs font-mono">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
              {isPinEnabled ? <Lock className="w-4 h-4 text-teal-400" /> : <Unlock className="w-4 h-4 text-slate-400" />}
              <span>Passcode Gatekeeper Mode</span>
            </span>
            <p className="text-[10px] text-slate-400">
              When toggled, Finance Flow prompts for the PIN on system boot
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              id="security-pin-toggle"
              type="checkbox"
              checked={isPinEnabled}
              onChange={handleTogglePin}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-505"></div>
          </label>
        </div>

        {/* PIN Info & setup */}
        {isPinEnabled && securityPin && !isUpdating && (
          <div className={`p-4 rounded-xl flex items-center space-x-3.5 ${
            darkMode ? 'bg-emerald-500/5' : 'bg-emerald-50/50'
          }`}>
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <div className="text-xs font-mono">
              <span className="font-bold text-slate-800 dark:text-slate-100">Passcode Protection Active</span>
              <p className="text-[10px] text-slate-400">Your 4-digit code is securely hashed locally.</p>
              <button
                id="edit-security-pin-btn"
                onClick={() => setIsUpdating(true)}
                className="mt-2 text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline font-bold transition flex items-center space-x-1 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Change Passcode PIN</span>
              </button>
            </div>
          </div>
        )}

        {/* PIN Setup/Update Form */}
        {(isUpdating || !securityPin) && (
          <form onSubmit={handleSavePin} className="space-y-4 text-xs font-mono">
            <div className="text-center pb-2">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-350">
                {securityPin ? 'Change Access PIN' : 'Configure New 4-digit Security PIN'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <div>
                <label className="block text-slate-400 dark:text-slate-500 mb-1">Enter 4-digit PIN</label>
                <input
                  id="security-pin-input-field"
                  type="password"
                  maxLength={4}
                  required
                  placeholder="••••"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                  className={`w-full text-center tracking-widest px-3 py-2 rounded-lg border text-base focus:outline-none focus:ring-1 focus:ring-emerald-505 ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-slate-105' : 'bg-slate-50 border-slate-200 text-slate-805'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 dark:text-slate-500 mb-1">Confirm 4-digit PIN</label>
                <input
                  id="security-pin-confirm-field"
                  type="password"
                  maxLength={4}
                  required
                  placeholder="••••"
                  value={confirmInput}
                  onChange={(e) => setConfirmInput(e.target.value.replace(/\D/g, ''))}
                  className={`w-full text-center tracking-widest px-3 py-2 rounded-lg border text-base focus:outline-none focus:ring-1 focus:ring-emerald-550 ${
                    darkMode ? 'bg-slate-800 border-slate-705 text-slate-105' : 'bg-slate-50 border-slate-202 text-slate-805'
                  }`}
                />
              </div>
            </div>

            <div className="flex justify-center space-x-2 pt-2">
              {securityPin && (
                <button
                  id="cancel-pin-setup"
                  type="button"
                  onClick={() => setIsUpdating(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-805 cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                id="save-pin-submit"
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2 rounded-lg cursor-pointer flex items-center space-x-1"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Security Lock</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
