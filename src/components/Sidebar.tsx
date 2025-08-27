import React from 'react';
import { 
  Home, 
  Plus, 
  PieChart, 
  Calendar, 
  Settings, 
  X,
  TrendingUp,
  CreditCard
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  currentView: string;
  onViewChange: (view: string) => void;
  onClose: () => void;
  isDarkMode?: boolean;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'add-expense', label: 'Add Expense', icon: Plus },
  { id: 'analytics', label: 'Analytics', icon: PieChart },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'budget', label: 'Budget', icon: CreditCard },
  { id: 'trends', label: 'Trends', icon: TrendingUp },
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  currentView, 
  onViewChange, 
  onClose,
  isDarkMode
}) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative top-0 left-0 h-screen ${isDarkMode ? 'bg-gray-900/90' : 'bg-white/90'} backdrop-blur-xl 
        ${isDarkMode ? 'border-gray-800/50' : 'border-gray-200/50'} border-r z-50 transition-transform duration-300
        w-64 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-200/50 lg:hidden">
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100/80 transition-colors"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                onViewChange(id);
                onClose();
              }}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-xl
                text-left transition-all duration-200 group
                ${currentView === id 
                  ? (isDarkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-600 shadow-sm') 
                  : (isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50')
                }
              `}
            >
              <Icon className={`w-5 h-5 ${
                currentView === id ? (isDarkMode ? 'text-blue-400' : 'text-blue-600') : (isDarkMode ? 'text-gray-500 group-hover:text-gray-300' : 'text-gray-400 group-hover:text-gray-600')
              }`} />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'}`}>
            <Settings className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
};