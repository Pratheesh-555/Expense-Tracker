import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { ExpenseForm } from './components/ExpenseForm';
import { Chatbot } from './components/Chatbot';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Analytics } from './components/Analytics';
import { TransactionsList } from './components/TransactionsList';
import { BudgetManager } from './components/BudgetManager';
import { Settings } from './components/Settings';
import { ExpenseProvider } from './contexts/ExpenseContext';
import { BankProvider } from './contexts/BankContext';
import { ChatProvider } from './contexts/ChatContext';
import { SplashScreen } from './components/SplashScreen';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    navigate(`/${currentView}`);
  }, [currentView]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <BankProvider>
      <ExpenseProvider>
      <ChatProvider>
        <div className={`min-h-screen transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
            : 'bg-gradient-to-br from-slate-50 to-blue-50'
        }`}>
          {showSplash && <SplashScreen isDarkMode={isDarkMode} />}
          <Header 
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            onToggleChat={() => setIsChatOpen(!isChatOpen)}
            isChatOpen={isChatOpen}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          />
          
          <div className="flex">
            <Sidebar 
              isOpen={isSidebarOpen}
              currentView={currentView}
              onViewChange={setCurrentView}
              onClose={() => setIsSidebarOpen(false)}
              isDarkMode={isDarkMode}
            />
            
            <main className="flex-1 p-4 lg:p-8 transition-all duration-300">
              <div className="max-w-7xl mx-auto">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard isDarkMode={isDarkMode} />} />
                  <Route path="/add-expense" element={<ExpenseForm isDarkMode={isDarkMode} />} />
                  <Route path="/analytics" element={<Analytics isDarkMode={isDarkMode} />} />
                  <Route path="/transactions" element={<TransactionsList isDarkMode={isDarkMode} />} />
                  <Route path="/budget" element={<BudgetManager isDarkMode={isDarkMode} />} />
                  <Route path="/settings" element={<Settings isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />} />
                  <Route path="*" element={<Dashboard isDarkMode={isDarkMode} />} />
                </Routes>
              </div>
            </main>
          </div>

          <Chatbot 
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            onAddExpense={() => setCurrentView('add-expense')}
            onViewChange={setCurrentView}
            isDarkMode={isDarkMode}
          />
        </div>
      </ChatProvider>
      </ExpenseProvider>
    </BankProvider>
  );
}

export default App;