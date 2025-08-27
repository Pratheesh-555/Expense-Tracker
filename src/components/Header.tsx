import React, { useState } from 'react';
import { Menu, MessageCircle, X, GraduationCap, Bell, Moon, Sun, User, Settings, ChevronDown, Plus } from 'lucide-react';
import { useBanks } from '../contexts/BankContext';

interface HeaderProps {
  onToggleSidebar: () => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onToggleSidebar, 
  onToggleChat, 
  isChatOpen, 
  isDarkMode, 
  onToggleDarkMode 
}) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showBanks, setShowBanks] = useState(false);
  const { banks, currentBankId, switchBank, addBank } = useBanks();
  const currentBank = banks.find(b => b.id === currentBankId);

  return (
    <header className={`backdrop-blur-lg border-b sticky top-0 z-40 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-900/80 border-gray-700/50' 
        : 'bg-white/80 border-gray-200/50'
    }`}>
      <div className="px-4 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className={`p-2 rounded-xl transition-colors lg:hidden ${
              isDarkMode 
                ? 'hover:bg-gray-800/80 text-gray-300' 
                : 'hover:bg-gray-100/80 text-gray-700'
            }`}
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Good afternoon
              </h1>
              <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Pratheesh Krishnan
              </p>
            </div>
          </div>
          
          {/* Bank switcher */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowBanks(!showBanks)}
              className={`ml-4 px-3 py-2 rounded-xl border text-sm flex items-center space-x-2 ${
                isDarkMode ? 'border-gray-700 text-gray-200 hover:bg-gray-800' : 'border-gray-200 text-gray-800 hover:bg-gray-100'
              }`}
            >
              <span>{currentBank?.name ?? 'Select Bank'}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showBanks && (
              <div className={`absolute mt-2 w-56 rounded-xl shadow-lg border z-50 ${
                isDarkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'
              }`}>
                <div className="p-2 max-h-64 overflow-auto">
                  {banks.map(b => (
                    <button
                      key={b.id}
                      onClick={() => { switchBank(b.id); setShowBanks(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                        b.id === currentBankId ? 'bg-blue-600 text-white' : isDarkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-800'
                      }`}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
                <div className="border-t border-gray-200/20 p-2">
                  <button
                    onClick={async () => { await addBank(`Bank ${banks.length + 1}`, 0); setShowBanks(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center space-x-2 ${
                      isDarkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-800'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add bank</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={onToggleDarkMode}
            className={`p-2 rounded-xl transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-800/80 text-gray-300' 
                : 'hover:bg-gray-100/80 text-gray-700'
            }`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button className={`p-2 rounded-xl transition-colors relative ${
            isDarkMode 
              ? 'hover:bg-gray-800/80 text-gray-300' 
              : 'hover:bg-gray-100/80 text-gray-700'
          }`}>
            <Bell className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
          </button>
          
          <button
            onClick={onToggleChat}
            className={`p-2 rounded-xl transition-all duration-200 ${
              isChatOpen 
                ? 'bg-blue-600 text-white' 
                : isDarkMode 
                  ? 'hover:bg-gray-800/80 text-gray-300' 
                  : 'hover:bg-gray-100/80 text-gray-700'
            }`}
          >
            {isChatOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className={`p-2 rounded-xl transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-800/80 text-gray-300' 
                  : 'hover:bg-gray-100/80 text-gray-700'
              }`}
            >
              <User className="w-5 h-5" />
            </button>
            
            {showProfile && (
              <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg border backdrop-blur-lg z-50 ${
                isDarkMode 
                  ? 'bg-gray-800/90 border-gray-700' 
                  : 'bg-white/90 border-gray-200'
              }`}>
                <div className="p-4">
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Pratheesh Krishnan
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Student ID: 2021001234
                  </p>
                </div>
                <div className="border-t border-gray-200/20 p-2">
                  <button className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'hover:bg-gray-700 text-gray-300' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}>
                    <Settings className="w-4 h-4 inline mr-2" />
                    Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};