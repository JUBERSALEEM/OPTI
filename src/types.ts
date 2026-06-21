/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Country = 'India' | 'UAE' | 'USA';
export type Currency = 'INR' | 'AED' | 'USD';
export type Language = 'English' | 'Hindi' | 'Arabic';

export interface RegionConfig {
  country: Country;
  currency: Currency;
  currencySymbol: string;
  phoneCode: string;
  languages: string[];
  selectedLanguage: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  amount: number;
  date: string;
  account: string;
  notes?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  deadline: string;
}

export interface Investment {
  id: string;
  assetName: string;
  type: 'Stocks' | 'Mutual Funds' | 'Gold' | 'Bonds' | 'ETFs' | 'Real Estate';
  quantity: number;
  buyPrice: number;
  currentPrice: number;
}

export interface CryptoAsset {
  id: string;
  coin: 'Bitcoin' | 'Ethereum' | 'Solana' | 'XRP' | 'Others';
  quantity: number;
  buyPrice: number;
  currentPrice: number;
}

export interface UserProfile {
  name: string;
  email: string;
  profilePhoto: string;
  country: Country;
  currency: Currency;
  language: string;
  securityPin: string;
  isPinEnabled: boolean;
}

export type ActiveTab = 'Home' | 'Ledgers' | 'Investments' | 'ROI Calculator' | 'Savings Goals' | 'Reports' | 'Security' | 'Profile';
