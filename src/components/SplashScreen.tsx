import React from 'react';

interface SplashScreenProps {
  isDarkMode: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ isDarkMode }) => {
  return (
    <div className={`fixed inset-0 flex items-center justify-center z-[100] ${
      isDarkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div className="flex flex-col items-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 animate-pulse" />
        <div className="text-center">
          <h1 className={`text-2xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>SpendWise</h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Smart spending starts here</p>
        </div>
      </div>
    </div>
  );
};


