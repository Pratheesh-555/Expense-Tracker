import React, { useState } from 'react';
import { StatsGrid } from './StatsGrid';
import { ExpenseChart } from './ExpenseChart';
import { RecentExpenses } from './RecentExpenses';
import { BudgetProgress } from './BudgetProgress';
import { QuickActions } from './QuickActions';
import { NetWorthCard } from './NetWorthCard';
import { AccountCards } from './AccountCards';
import { TransactionsList } from './TransactionsList';

interface DashboardProps {
  isDarkMode: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ isDarkMode }) => {
  return (
    <div className="space-y-6">
      {/* Account Cards */}
      <AccountCards isDarkMode={isDarkMode} />
      
      {/* Net Worth */}
      <NetWorthCard isDarkMode={isDarkMode} />

      {/* Recent Transactions per bank */}
      <div className="rounded-2xl overflow-hidden">
        <TransactionsList isDarkMode={isDarkMode} />
      </div>

      {/* Stats Grid */}
      <StatsGrid isDarkMode={isDarkMode} />

      {/* Quick Actions */}
      <QuickActions isDarkMode={isDarkMode} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ExpenseChart isDarkMode={isDarkMode} />
        </div>
        <div className="space-y-6">
          <BudgetProgress isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
};