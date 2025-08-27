import React, { useState } from 'react';
import { User, Bell, Shield, Palette, Database, Download, Upload, Moon, Sun } from 'lucide-react';

interface SettingsProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ isDarkMode, onToggleDarkMode }) => {
  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    dailyReminders: false,
    weeklyReports: true,
    expenseThreshold: true
  });

  const [profile, setProfile] = useState({
    name: 'Pratheesh Krishnan',
    email: 'pratheesh@sastra.ac.in',
    studentId: '2021001234',
    course: 'B.Tech Computer Science',
    year: '3rd Year'
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Settings
      </h2>

      {/* Profile Settings */}
      <div className={`p-6 rounded-2xl border ${
        isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200/50'
      }`}>
        <div className="flex items-center space-x-3 mb-6">
          <User className="w-6 h-6 text-blue-500" />
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Profile Information
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Full Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              className={`w-full px-4 py-3 rounded-xl border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              className={`w-full px-4 py-3 rounded-xl border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Student ID
            </label>
            <input
              type="text"
              value={profile.studentId}
              onChange={(e) => setProfile({...profile, studentId: e.target.value})}
              className={`w-full px-4 py-3 rounded-xl border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Course
            </label>
            <input
              type="text"
              value={profile.course}
              onChange={(e) => setProfile({...profile, course: e.target.value})}
              className={`w-full px-4 py-3 rounded-xl border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            />
          </div>
        </div>
        
        <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
          Save Changes
        </button>
      </div>

      {/* Appearance Settings */}
      <div className={`p-6 rounded-2xl border ${
        isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200/50'
      }`}>
        <div className="flex items-center space-x-3 mb-6">
          <Palette className="w-6 h-6 text-purple-500" />
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Appearance
          </h3>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Dark Mode
            </p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Switch between light and dark themes
            </p>
          </div>
          <button
            onClick={onToggleDarkMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isDarkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className={`p-6 rounded-2xl border ${
        isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200/50'
      }`}>
        <div className="flex items-center space-x-3 mb-6">
          <Bell className="w-6 h-6 text-green-500" />
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Notifications
          </h3>
        </div>
        
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </p>
              </div>
              <button
                onClick={() => setNotifications({...notifications, [key]: !value})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Data Management */}
      <div className={`p-6 rounded-2xl border ${
        isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200/50'
      }`}>
        <div className="flex items-center space-x-3 mb-6">
          <Database className="w-6 h-6 text-orange-500" />
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Data Management
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className={`flex items-center space-x-3 p-4 rounded-xl border transition-colors ${
            isDarkMode 
              ? 'border-gray-700 hover:bg-gray-700/50' 
              : 'border-gray-200 hover:bg-gray-50'
          }`}>
            <Download className="w-5 h-5 text-blue-500" />
            <div className="text-left">
              <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Export Data
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Download your expense data
              </p>
            </div>
          </button>
          
          <button className={`flex items-center space-x-3 p-4 rounded-xl border transition-colors ${
            isDarkMode 
              ? 'border-gray-700 hover:bg-gray-700/50' 
              : 'border-gray-200 hover:bg-gray-50'
          }`}>
            <Upload className="w-5 h-5 text-green-500" />
            <div className="text-left">
              <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Import Data
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Upload expense data from file
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};