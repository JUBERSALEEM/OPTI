/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, Edit2, Trash2, ArrowUpCircle, ArrowDownCircle, RefreshCw, XCircle, FileSpreadsheet, Eye, SlidersHorizontal } from 'lucide-react';
import { Transaction, RegionConfig } from '../types';

interface LedgerSectionProps {
  transactions: Transaction[];
  onAddTransaction: (t: Omit<Transaction, 'id'>) => void;
  onUpdateTransaction: (id: string, t: Partial<Transaction>) => void;
  onDeleteTransaction: (id: string) => void;
  region: RegionConfig;
  darkMode: boolean;
}

const defaultCategories = ['Salary', 'Food', 'Fuel', 'Rent', 'Medical', 'Shopping', 'Custom'];
const defaultAccounts = ['Cash', 'Bank', 'Savings', 'Credit Card', 'Custom'];

export default function LedgerSection({
  transactions,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
  region,
  darkMode,
}: LedgerSectionProps) {
  const symbol = region.currencySymbol;

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [type, setType] = useState<'income' | 'expense' | 'transfer'>('expense');
  const [category, setCategory] = useState<string>('Food');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [account, setAccount] = useState<string>('Cash');
  const [customAccount, setCustomAccount] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterAccount, setFilterAccount] = useState<string>('All');
  const [filterDate, setFilterDate] = useState<string>('');

  // Handle setting edit mode
  const handleStartEdit = (tx: Transaction) => {
    setEditingId(tx.id);
    setType(tx.type);
    
    if (defaultCategories.includes(tx.category)) {
      setCategory(tx.category);
      setCustomCategory('');
    } else {
      setCategory('Custom');
      setCustomCategory(tx.category);
    }

    setAmount(tx.amount.toString());
    setDate(tx.date);

    if (defaultAccounts.includes(tx.account)) {
      setAccount(tx.account);
      setCustomAccount('');
    } else {
      setAccount('Custom');
      setCustomAccount(tx.account);
    }

    setNotes(tx.notes || '');
  };

  // Actions
  const handleClear = () => {
    setEditingId(null);
    setType('expense');
    setCategory('Food');
    setCustomCategory('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setAccount('Cash');
    setCustomAccount('');
    setNotes('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('Please enter a valid transactional amount.');
      return;
    }

    const resolvedCategory = category === 'Custom' ? (customCategory.trim() || 'Other') : category;
    const resolvedAccount = account === 'Custom' ? (customAccount.trim() || 'Other') : account;

    const txData = {
      type,
      category: resolvedCategory,
      amount: Number(amount),
      date,
      account: resolvedAccount,
      notes: notes.trim() || undefined,
    };

    if (editingId) {
      onUpdateTransaction(editingId, txData);
    } else {
      onAddTransaction(txData);
    }

    handleClear();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to permanently delete this financial entry?')) {
      onDeleteTransaction(id);
      if (editingId === id) {
        handleClear();
      }
    }
  };

  // Derived list of transaction categories for search filters
  const uniqueCategories = Array.from(new Set(transactions.map((t) => t.category)));
  const uniqueAccounts = Array.from(new Set(transactions.map((t) => t.account)));

  // Filter transactions based on selection criteria
  const filteredTx = transactions.filter((tx) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.notes && tx.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      tx.account.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'All' || tx.type === filterType.toLowerCase();
    const matchesCategory = filterCategory === 'All' || tx.category === filterCategory;
    const matchesAccount = filterAccount === 'All' || tx.account === filterAccount;
    const matchesDate = filterDate === '' || tx.date === filterDate;

    return matchesSearch && matchesType && matchesCategory && matchesAccount && matchesDate;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* LEFT COLUMN: Entry Creator / Editor Card */}
      <div id="ledger-form-panel" className="lg:col-span-5">
        <div className="glass-card p-6">
          <div className="flex items-center space-x-2 mb-6">
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100">
                {editingId ? 'Modify Record Entry' : 'New Transaction Entry'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Update account and categories under live localization
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Type */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Transaction Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['income', 'expense', 'transfer'] as const).map((t) => (
                  <button
                    id={`type-btn-${t}`}
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      type === t
                        ? t === 'income'
                          ? 'bg-emerald-500 text-white'
                          : t === 'expense'
                          ? 'bg-rose-500 text-white'
                          : 'bg-amber-500 text-white'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                  Category
                </label>
                <select
                  id="ledger-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  {defaultCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {category === 'Custom' && (
                  <input
                    id="ledger-custom-category"
                    type="text"
                    placeholder="Enter Custom Category"
                    value={customCategory}
                    required
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className={`w-full mt-2 px-3 py-2 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                  Amount ({symbol})
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-400 dark:text-slate-500">
                    {symbol}
                  </span>
                  <input
                    id="ledger-amount"
                    type="number"
                    step="any"
                    placeholder="250.00"
                    value={amount}
                    required
                    onChange={(e) => setAmount(e.target.value)}
                    className={`w-full pl-8 pr-3 py-2 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-slate-100 font-bold' : 'bg-slate-50 border-slate-200 text-slate-800 font-bold'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Date */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                  Transaction Date
                </label>
                <input
                  id="ledger-date"
                  type="date"
                  value={date}
                  required
                  onChange={(e) => setDate(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              {/* Account channel */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                  Target Account
                </label>
                <select
                  id="ledger-account"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  {defaultAccounts.map((acc) => (
                    <option key={acc} value={acc}>{acc}</option>
                  ))}
                </select>
                {account === 'Custom' && (
                  <input
                    id="ledger-custom-account"
                    type="text"
                    placeholder="Enter Custom Account Name"
                    value={customAccount}
                    required
                    onChange={(e) => setCustomAccount(e.target.value)}
                    className={`w-full mt-2 px-3 py-2 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Notes / Remarks (Optional)
              </label>
              <textarea
                id="ledger-notes"
                placeholder="Dinner with office colleagues..."
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>

            {/* Master Actions */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                id="ledger-submit-btn"
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg text-xs transition duration-150 cursor-pointer flex items-center justify-center space-x-1.5"
              >
                {editingId ? <PlusCircle className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                <span>{editingId ? 'Update Entry Details' : 'Add Ledger Entry'}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                {editingId && (
                  <button
                    id="ledger-delete-active-btn"
                    type="button"
                    onClick={() => handleDelete(editingId)}
                    className="bg-rose-500/10 hover:bg-rose-500 text-rose-550 dark:text-rose-400 hover:text-white font-bold py-2 px-4 rounded-lg text-xs transition duration-150 cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                    <span>Delete Entry</span>
                  </button>
                )}
                <button
                  id="ledger-clear-btn"
                  type="button"
                  onClick={handleClear}
                  className={`border font-semibold py-2 px-4 rounded-lg text-xs transition duration-150 cursor-pointer flex items-center justify-center space-x-1.5 ${
                    darkMode
                      ? 'border-slate-800 hover:bg-slate-800 text-slate-400'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                  }`}
                >
                  <XCircle className="w-4.5 h-4.5" />
                  <span>Clear Form</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN: Database Ledger History with Search Engines */}
      <div id="ledger-history-panel" className="lg:col-span-7">
        <div className="glass-card p-6 flex flex-col h-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 gap-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 text-emerald-500 rounded-xl">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100">
                  Transaction History Database
                </h3>
                <p className="text-[11px] text-slate-400">
                  Search, filter and organize financial entries instantly
                </p>
              </div>
            </div>
            <span className="self-start sm:self-center px-2.5 py-1 text-[11px] font-mono font-bold bg-slate-50 dark:bg-slate-800/80 rounded-full text-slate-500 dark:text-slate-450 border border-slate-220/30 dark:border-slate-700/30">
              Total logs: {filteredTx.length}
            </span>
          </div>

          {/* Filters & Keyword Search Bar */}
          <div className="space-y-3 pb-6">
            <div className="relative">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
              <input
                id="ledger-search-box"
                type="text"
                placeholder="Search ledger by keyword, category, account, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                  darkMode ? 'bg-slate-800/80 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Filter Type */}
              <select
                id="filter-type-picker"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={`px-3 py-1.5 text-[11px] rounded-lg border focus:outline-none ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <option value="All">All Types</option>
                <option value="Income">Income Only</option>
                <option value="Expense">Expense Only</option>
                <option value="Transfer">Transfer Only</option>
              </select>

              {/* Filter Category */}
              <select
                id="filter-category-picker"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={`px-3 py-1.5 text-[11px] rounded-lg border focus:outline-none ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <option value="All">All Categories</option>
                {uniqueCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* Filter Account */}
              <select
                id="filter-account-picker"
                value={filterAccount}
                onChange={(e) => setFilterAccount(e.target.value)}
                className={`px-3 py-1.5 text-[11px] rounded-lg border focus:outline-none ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <option value="All">All Accounts</option>
                {uniqueAccounts.map((acc) => (
                  <option key={acc} value={acc}>{acc}</option>
                ))}
              </select>

              {/* Reset filter button */}
              {(filterType !== 'All' || filterCategory !== 'All' || filterAccount !== 'All' || filterDate !== '' || searchQuery !== '') && (
                <button
                  id="reset-ledger-filters"
                  type="button"
                  onClick={() => {
                    setFilterType('All');
                    setFilterCategory('All');
                    setFilterAccount('All');
                    setFilterDate('');
                    setSearchQuery('');
                  }}
                  className="px-2.5 py-1.5 text-[10px] text-rose-500 font-bold hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg flex items-center space-x-1 transition cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>
          </div>

          {/* TABLE LOGS */}
          <div className="flex-1 overflow-x-auto">
            {filteredTx.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileSpreadsheet className="w-12 h-12 text-slate-300 dark:text-slate-700 animate-bounce mb-3" />
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-450">
                  No transaction records align with current query parameters.
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Try clearing search inputs or add a new transaction manually to see it logged.
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className={`border-b ${darkMode ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'} font-semibold font-mono uppercase tracking-wider`}>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Account</th>
                    <th className="py-3 px-3 text-right">Amount</th>
                    <th className="py-3 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                  {filteredTx.map((tx) => (
                    <tr
                      id={`tx-row-${tx.id}`}
                      key={tx.id}
                      className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition duration-150 ${
                        editingId === tx.id ? 'bg-emerald-500/5 dark:bg-emerald-450/5' : ''
                      }`}
                    >
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        {tx.date}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-tight ${
                          tx.type === 'income'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : tx.type === 'expense'
                            ? 'bg-rose-105 text-rose-800 dark:bg-rose-955/40 dark:text-rose-400'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                        }`}>
                          {tx.type === 'income' ? <ArrowUpCircle className="w-3.5 h-3.5" /> : <ArrowDownCircle className="w-3.5 h-3.5" />}
                          <span>{tx.type}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {tx.category}
                        </span>
                        {tx.notes && (
                          <span className="block text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[150px]" title={tx.notes}>
                            {tx.notes}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-350">
                        {tx.account}
                      </td>
                      <td className={`py-3 px-3 text-right font-bold text-sm ${
                        tx.type === 'income' 
                          ? 'text-emerald-600 dark:text-emerald-400' 
                          : tx.type === 'expense' 
                          ? 'text-rose-600 dark:text-rose-400' 
                          : 'text-amber-500'
                      }`}>
                        {tx.type === 'income' ? '+' : tx.type === 'expense' ? '-' : ''}
                        {symbol} {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            id={`tx-edit-btn-${tx.id}`}
                            onClick={() => handleStartEdit(tx)}
                            className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-amber-400 rounded transition cursor-pointer"
                            title="Edit record"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`tx-delete-btn-${tx.id}`}
                            onClick={() => handleDelete(tx.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
