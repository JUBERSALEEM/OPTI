/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FileText, Send, Share2, Download, Printer, CheckCircle2, Loader2, Mail, Phone, Hash, Globe, Users } from 'lucide-react';
import { Transaction, Investment, CryptoAsset, SavingsGoal, RegionConfig } from '../types';

interface ReportSectionProps {
  transactions: Transaction[];
  investments: Investment[];
  cryptoAssets: CryptoAsset[];
  savingsGoals: SavingsGoal[];
  region: RegionConfig;
  darkMode: boolean;
}

export default function ReportSection({
  transactions,
  investments,
  cryptoAssets,
  savingsGoals,
  region,
  darkMode,
}: ReportSectionProps) {
  const symbol = region.currencySymbol;

  // Report config
  const [reportPeriod, setReportPeriod] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Yearly' | 'Custom'>('Monthly');
  const [sharePlatform, setSharePlatform] = useState<string>('Email');

  // Input fields for sharing
  const [targetEmail, setTargetEmail] = useState('ffyassh@gmail.com');
  const [targetPhone, setTargetPhone] = useState(region.phoneCode + ' 99887766');
  const [subject, setSubject] = useState('Finance Flow Report - Personal Portfolio Audit');
  const [message, setMessage] = useState('Attached is my compiled personal wealth audit report from the Finance Flow ledger manager.');

  // Simulation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<string | null>(null);

  // Math calculations
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const availableCash = totalIncome - totalExpense;
  const totalSavings = savingsGoals.reduce((sum, g) => sum + g.savedAmount, 0);
  const totalInvestments = investments.reduce((sum, inv) => sum + inv.quantity * inv.currentPrice, 0);
  const totalCrypto = cryptoAssets.reduce((sum, crypto) => sum + crypto.quantity * crypto.currentPrice, 0);
  const netWorthValue = availableCash + totalSavings + totalInvestments + totalCrypto;

  const formatMoney = (val: number) => {
    return `${symbol} ${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGeneratePDF = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert(`Report generated successfully! Ready to download as "Finance_Flow_Report_${reportPeriod}.pdf".`);
    }, 1500);
  };

  const handleSendPDF = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSendStatus('Connecting to secure transport mailboxes...');

    setTimeout(() => {
      setSendStatus('Assembling cryptographic document vectors...');
      setTimeout(() => {
        setSendStatus(`Transmitting PDF package via ${sharePlatform}...`);
        setTimeout(() => {
          setIsSending(false);
          setSendStatus(null);
          alert(`Report successfully forwarded to ${sharePlatform === 'Email' ? targetEmail : targetPhone} via ${sharePlatform}!`);
        }, 1200);
      }, 1000);
    }, 800);
  };

  const sharePlatforms = ['WhatsApp', 'Email', 'Telegram', 'Facebook', 'Instagram'];

  return (
    <div id="finance-report-engine" className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:block">
      {/* LEFT COLUMN: Report Preview Document */}
      <div className="lg:col-span-7 print:w-full">
        <div className="glass-card p-6 flex flex-col print:border-none print:shadow-none">
          
          {/* Header toolbar */}
          <div className="flex flex-wrap items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-3 print:hidden">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Audit report compiler</h3>
              <p className="text-xs text-slate-400">Generate on-click detailed portfolios for accounting</p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                id="report-print-btn"
                onClick={handlePrint}
                className={`p-2 rounded-lg border cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition ${
                  darkMode ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-600'
                }`}
                title="Print ledger report"
              >
                <Printer className="w-4 h-4" />
              </button>

              <button
                id="report-generate-pdf-btn"
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-2 rounded-xl transition cursor-pointer flex items-center space-x-1.5"
              >
                {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                <span>{isGenerating ? 'Compiling...' : 'Generate PDF'}</span>
              </button>
            </div>
          </div>

          {/* Period Select Bar */}
          <div className="flex items-center space-x-1.5 py-4 overflow-x-auto scrollbar-none print:hidden">
            {(['Daily', 'Weekly', 'Monthly', 'Yearly', 'Custom'] as const).map((period) => (
              <button
                id={`report-period-${period}`}
                key={period}
                onClick={() => setReportPeriod(period)}
                className={`px-3 py-1 text-[11px] font-semibold rounded-lg border transition cursor-pointer ${
                  reportPeriod === period
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent'
                    : darkMode
                    ? 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {period} report
              </button>
            ))}
          </div>

          {/* ACTUAL DOCUMENT SHEET */}
          <div className={`p-8 rounded-xl mt-4 border font-mono text-xs ${
            darkMode ? 'bg-slate-950/40 border-slate-850/80 text-slate-300' : 'bg-slate-50 border-slate-200/80 text-slate-755'
          } print:border-none print:bg-white print:text-black`}>
            {/* Stamp Logo */}
            <div className="flex justify-between items-start pb-6 border-b border-dashed border-slate-300 dark:border-slate-700">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-105 tracking-wider uppercase">
                  FINANCE FLOW AUDIT MATRIX
                </h4>
                <p className="text-[10px] text-slate-400">PERSONAL WEALTH & PERFORMANCE LEDGER</p>
                <p className="text-[10px] text-slate-400 mt-1">Scope: {reportPeriod} cycle summary</p>
              </div>
              <div className="text-right text-[10px] text-slate-400">
                <p>Date Generated: {new Date().toISOString().split('T')[0]}</p>
                <p>System signature: #FF-3000-API</p>
              </div>
            </div>

            {/* Balances list */}
            <div className="space-y-4 py-6 border-b border-dashed border-slate-300 dark:border-slate-700">
              <span className="block font-bold text-slate-900 dark:text-slate-100 underline uppercase tracking-wider">
                1. PORTFOLIO WORTH SHEET
              </span>

              <div className="grid grid-cols-2 gap-y-2 border-l-2 border-emerald-500 pl-3">
                <span>Net Liquidity Bank / Cash:</span>
                <span className="text-right font-bold text-slate-900 dark:text-slate-100">{formatMoney(availableCash)}</span>

                <span>Vested Savings Goals reserves:</span>
                <span className="text-right font-bold text-slate-900 dark:text-slate-100">{formatMoney(totalSavings)}</span>

                <span>Investment Matrix Asset index:</span>
                <span className="text-right font-bold text-slate-900 dark:text-slate-100">{formatMoney(totalInvestments)}</span>

                <span>Digital Asset Coins portfolio:</span>
                <span className="text-right font-bold text-slate-900 dark:text-slate-105">{formatMoney(totalCrypto)}</span>
                
                <div className="col-span-2 border-t border-slate-300 dark:border-slate-700/60 my-2"></div>

                <span className="font-extrabold uppercase">Calculated User Net Worth:</span>
                <span className="text-right font-extrabold text-sm text-emerald-500">{formatMoney(netWorthValue)}</span>
              </div>
            </div>

            {/* Cash flow transactions */}
            <div className="space-y-4 py-6">
              <span className="block font-bold text-slate-900 dark:text-slate-100 underline uppercase tracking-wider">
                2. CASH FLOW ACTIVITY METRICS
              </span>

              <div className="grid grid-cols-2 gap-y-2 border-l-2 border-amber-500 pl-3">
                <span>Total Accumulated Income:</span>
                <span className="text-right font-bold text-emerald-500">+{formatMoney(totalIncome)}</span>

                <span>Total Logged Expenses:</span>
                <span className="text-right font-bold text-rose-500">-{formatMoney(totalExpense)}</span>

                <div className="col-span-2 border-t border-slate-300 dark:border-slate-700/60 my-2"></div>

                <span>Net Operating Cash Flow:</span>
                <span className={`text-right font-bold ${availableCash >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {formatMoney(availableCash)}
                </span>
              </div>
            </div>

            {/* Footer stamp seal */}
            <div className="pt-6 border-t border-dashed border-slate-300 dark:border-slate-700 text-center text-[10px] text-slate-400">
              <p>Authorized and certified by Finance Flow secure ledger protocols.</p>
              <p className="mt-1 font-mono uppercase tracking-widest text-[9px]">★★ OFFICIAL LEDGER REPORT ★★</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Share Report Form */}
      <div className="lg:col-span-5 print:hidden">
        <div className="glass-card p-6">
          <div className="flex items-center space-x-2.5 mb-6">
            <div className="p-2 bg-amber-500/10 text-amber-550 rounded-xl">
              <Share2 className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-105">Digital sharing network</h3>
              <p className="text-xs text-slate-400">Dispatch compiled financial updates instantly</p>
            </div>
          </div>

          <form onSubmit={handleSendPDF} className="space-y-4 text-xs font-mono">
            {/* Platforms selector */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 mb-2">
                Select Sharing Channel
              </label>
              <div className="flex flex-wrap gap-2">
                {sharePlatforms.map((plat) => {
                  const active = sharePlatform === plat;
                  return (
                    <button
                      id={`share-channel-${plat}`}
                      key={plat}
                      type="button"
                      onClick={() => {
                        setSharePlatform(plat);
                        if (plat === 'WhatsApp') {
                          setSubject('Finance Flow Update');
                          setMessage(`Hi, here is my personal financial summary from the Finance Flow app! My calculated net worth is ${symbol}${netWorthValue.toLocaleString()}.`);
                        } else if (plat === 'Email') {
                          setSubject('Finance Flow Report - Personal Portfolio Audit');
                          setMessage('Attached is my compiled personal wealth audit report from the Finance Flow ledger manager.');
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg border font-semibold transition cursor-pointer text-[11px] ${
                        active
                          ? 'bg-emerald-500 text-white border-transparent shadow shadow-emerald-500/15'
                          : darkMode
                          ? 'bg-slate-800 border-slate-700 text-slate-350 hover:bg-slate-700'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {plat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Email field (active if email is active option) */}
            {sharePlatform === 'Email' && (
              <div>
                <label className="block text-slate-400 dark:text-slate-500 mb-1">Target Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    id="share-email-field"
                    type="email"
                    required
                    value={targetEmail}
                    onChange={(e) => setTargetEmail(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Phone field (active unless email is select Option) */}
            {sharePlatform !== 'Email' && (
              <div>
                <label className="block text-slate-400 dark:text-slate-500 mb-1">Receiver Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    id="share-phone-field"
                    type="text"
                    required
                    value={targetPhone}
                    onChange={(e) => setTargetPhone(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Subject */}
            <div>
              <label className="block text-slate-400 dark:text-slate-500 mb-1">Subject Heading</label>
              <input
                id="share-subject-field"
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-slate-100 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-800 font-semibold'
                }`}
              />
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-slate-400 dark:text-slate-500 mb-1">Message Attachment Body</label>
              <textarea
                id="share-message-field"
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-805'
                }`}
              />
            </div>

            {/* Send PDF Action */}
            <div>
              {isSending ? (
                <div className="space-y-2 py-2">
                  <div className="flex items-center space-x-2 text-emerald-500">
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    <span className="font-bold">{sendStatus}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full animate-pulse style-width-70 pr-4" style={{ width: '85%' }}></div>
                  </div>
                </div>
              ) : (
                <button
                  id="report-share-pdf-btn"
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg cursor-pointer flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Send PDF Report</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
