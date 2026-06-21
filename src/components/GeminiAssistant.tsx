/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, ArrowUpRight, Loader2, Bot, BrainCircuit, Lightbulb, TrendingUp, Landmark } from 'lucide-react';
import { Transaction, Investment, CryptoAsset, SavingsGoal, RegionConfig } from '../types';

interface GeminiAssistantProps {
  transactions: Transaction[];
  investments: Investment[];
  cryptoAssets: CryptoAsset[];
  savingsGoals: SavingsGoal[];
  region: RegionConfig;
  darkMode: boolean;
}

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

export default function GeminiAssistant({
  transactions,
  investments,
  cryptoAssets,
  savingsGoals,
  region,
  darkMode,
}: GeminiAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: "👋 Hello! I am **Flow AI**, your executive finance coach. Ask me to **analyze spending patterns**, **suggest budgets**, or **evaluate standard Stocks vs Cryptocurrencies ROI** based on your active ledger records!"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto Scroll
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSend = async (messageText: string) => {
    if (!messageText.trim() || loading) return;

    const userMsg = messageText;
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInputMessage('');
    setLoading(true);

    try {
      // Package the entire current application state to send as rich context under secure server proxy
      const appStateContext = {
        localization: region,
        investmentCount: investments.length,
        cryptoCount: cryptoAssets.length,
        savingsGoalsCount: savingsGoals.length,
        summary: {
          totalIncome: transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
          totalExpense: transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
          totalVestedSavings: savingsGoals.reduce((sum, g) => sum + g.savedAmount, 0),
          totalPortfolioValuation: investments.reduce((sum, inv) => sum + inv.quantity * inv.currentPrice, 0) + cryptoAssets.reduce((sum, cry) => sum + cry.quantity * cry.currentPrice, 0),
        },
        recentTransactions: transactions.slice(-10), // send last 10 transactions
        activeInvestments: investments,
        activeCryptoHoldings: cryptoAssets,
        savingsGoals: savingsGoals
      };

      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userMsg,
          state: appStateContext,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response failure');
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { sender: 'bot', text: data.text }]);
    } catch (err: any) {
      console.error('Coaching Engine Error:', err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "I met with a connectivity exception while analyzing those numbers. Please confirm your API Key details are configured inside **Secrets** and try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Render Bold Markdown and headers parsed cleanly
  const renderMessageContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Headers
      if (line.startsWith('### ')) {
        return <h4 key={i} className="text-xs font-bold text-emerald-500 dark:text-emerald-400 mt-2.5 mb-1">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={i} className="text-sm font-bold text-emerald-500 dark:text-emerald-400 mt-3 mb-1.5">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('# ')) {
        return <h2 key={i} className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mt-4 mb-2">{line.replace('# ', '')}</h2>;
      }
      // Bullets
      if (line.startsWith('• ') || line.startsWith('* ') || line.startsWith('- ')) {
        const cleanText = line.replace(/^[•*\-]\s+/, '');
        return (
          <li key={i} className="ml-4 list-disc text-[11px] my-1 text-slate-700 dark:text-slate-300">
            {renderBoldText(cleanText)}
          </li>
        );
      }
      // Standard line
      return (
        <p key={i} className="text-[11px] leading-relaxed my-1 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
          {renderBoldText(line)}
        </p>
      );
    });
  };

  const renderBoldText = (text: string) => {
    // simple regex to split on **
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="font-extrabold text-slate-900 dark:text-white">{part}</strong>;
      }
      return part;
    });
  };

  // Coaching Preset queries
  const presets = [
    { text: 'Analyze spend layout', prompt: 'Based on my recent logged transaction ledgers, analyze my spending patterns, identify highest outlays, and provide thrift suggestions.', icon: <BrainCircuit className="w-3.5 h-3.5 text-emerald-500" /> },
    { text: 'Formulate budget plan', prompt: 'Construct a tailored high-yield monthly savings and operational budget scheme using my currency and current income parameters.', icon: <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> },
    { text: 'Stocks vs Crypto ROI', prompt: 'Perform a comparative audit of my investment stocks vs digital cryptocurrency holdings. Highlight top performers, risk percentages, and calculate standard return on investment.', icon: <TrendingUp className="w-3.5 h-3.5 text-indigo-500" /> },
  ];

  return (
    <>
      {/* FLOATING ACTION TRIGGER */}
      <button
        id="gemini-floating-chat-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-4 rounded-full floating-ai text-white shadow-2xl hover:scale-105 transition-all duration-200 cursor-pointer z-50 flex items-center space-x-2 group"
        title="Consult Gemini Flow Coach"
      >
        <Sparkles className="w-5.5 h-5.5 text-white group-hover:rotate-12 transition-transform duration-300" />
        <span className="text-xs font-bold font-mono tracking-tight hidden sm:inline">Ask Flow AI</span>
      </button>

      {/* ASSISTANT SLIDE-OVER SIDEBAR PANEL */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex justify-end animate-fade-in">
          {/* Backdrop Closer */}
          <div className="absolute inset-0 cursor-pointer" onClick={() => setIsOpen(false)} />

          {/* Coach Board Container */}
          <div className={`relative w-full max-w-md h-full flex flex-col shadow-2xl transition-transform duration-200 ${
            darkMode ? 'bg-slate-905 bg-slate-900 border-l border-slate-800' : 'bg-white border-l border-slate-205'
          }`}>
            {/* Header */}
            <div className={`p-4 border-b flex items-center justify-between ${
              darkMode ? 'border-slate-800 bg-slate-950/30' : 'border-slate-100 bg-slate-50/50'
            }`}>
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl text-white">
                  <Bot className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm flex items-center space-x-1">
                    <span>Flow AI Assistant</span>
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded-full font-bold">
                       Gemini 3.5
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400">Your executive digital fintech mentor</p>
                </div>
              </div>

              <button
                id="close-gemini-assistant"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-405 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CHAT LOG AREA */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  id={`chat-msg-${i}`}
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs flex flex-col font-mono ${
                    msg.sender === 'user'
                      ? 'bg-emerald-500 text-white rounded-tr-none shadow-md shadow-emerald-50s'
                      : darkMode
                      ? 'bg-slate-800 border border-slate-700/60 text-slate-200 rounded-tl-none'
                      : 'bg-slate-50 border border-slate-200/60 text-slate-800 rounded-tl-none'
                  }`}>
                    {/* Rendered output */}
                    <div className="space-y-1">
                      {renderMessageContent(msg.text)}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className={`p-4 rounded-2xl text-xs flex items-center space-x-2.5 ${
                    darkMode ? 'bg-slate-800/50' : 'bg-slate-50'
                  }`}>
                    <Loader2 className="w-4 h-4 text-emerald-505 animate-spin" />
                    <span className="text-slate-400 font-mono text-[11px] animate-pulse">
                      Analyzing portfolio ledgers and asset patterns...
                    </span>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* COACH CHIPS PRESETS LIST */}
            <div className={`p-3 border-t border-dashed flex flex-col gap-2 ${
              darkMode ? 'border-slate-800 bg-slate-900/40' : 'border-slate-100 bg-slate-50/10'
            }`}>
              <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider pl-1 font-bold">
                 Quick coaching prompts
              </span>
              <div className="grid grid-cols-3 gap-2">
                {presets.map((preset, index) => (
                  <button
                    id={`preset-prompt-${index}`}
                    key={index}
                    onClick={() => handleSend(preset.prompt)}
                    className={`p-2 rounded-xl text-left border flex flex-col justify-between transition cursor-pointer hover:scale-[1.02] h-20 ${
                      darkMode
                        ? 'bg-slate-800/80 border-slate-700 hover:border-slate-600 text-slate-350'
                        : 'bg-white border-slate-220/80 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <div className="p-1 bg-slate-100 dark:bg-slate-900 rounded-lg max-w-fit mb-1.5">
                      {preset.icon}
                    </div>
                    <span className="text-[10px] font-bold font-mono tracking-tight leading-tight line-clamp-2">
                      {preset.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* MESSAGE ENTRY FORM */}
            <div className={`p-4 border-t ${
              darkMode ? 'border-slate-805 bg-slate-950/20' : 'border-slate-200 bg-slate-50/30'
            }`}>
              <div className="relative">
                <input
                  id="gemini-chat-input"
                  type="text"
                  placeholder="Ask a financial advice question..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend(inputMessage);
                  }}
                  className={`w-full pl-3 pr-10 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-slate-101' : 'bg-white border-slate-220 text-slate-800'
                  }`}
                />
                <button
                  id="gemini-chat-submit"
                  onClick={() => handleSend(inputMessage)}
                  className="absolute right-2 top-2 p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition cursor-pointer flex items-center justify-center shadow-sm"
                  title="Send message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
