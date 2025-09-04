import React, { useState } from 'react';
import {
  TreePine,
  Bell,
  Settings,
  HelpCircle,
  Minimize2,
  Maximize2,
  X,
  Moon,
  Sun
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OFFICE_INFO } from '@/lib/constants';
import { useStaffCount } from '@/hooks/useStaff';

const Header: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications] = useState(0); // Placeholder for notifications
  const { data: staffCount } = useStaffCount();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, you'd implement theme switching logic here
  };

  const minimizeWindow = () => {
    // Tauri window controls would go here
    console.log('Minimize window');
  };

  const maximizeWindow = () => {
    // Tauri window controls would go here
    console.log('Maximize/Restore window');
  };

  const closeWindow = () => {
    // Tauri window controls would go here
    console.log('Close window');
  };

  return (
    <header className="glass border-b border-white/20 sticky top-0 z-50">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section - Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <TreePine className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  Forest Office
                </h1>
                <p className="text-xs text-gray-600 -mt-1">
                  Staff Manager
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-gray-300" />

            {/* Office Info */}
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-700">
                {OFFICE_INFO.name}
              </p>
              <p className="text-xs text-gray-500">
                {staffCount?.total || 0} Active Staff Members
              </p>
            </div>
          </div>

          {/* Right Section - Actions and Window Controls */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 rounded-lg hover:bg-white/20"
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4 text-yellow-500" />
              ) : (
                <Moon className="h-4 w-4 text-gray-600" />
              )}
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg hover:bg-white/20 relative"
            >
              <Bell className="h-4 w-4 text-gray-600" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications > 9 ? '9+' : notifications}
                </span>
              )}
            </Button>

            {/* Help */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg hover:bg-white/20"
            >
              <HelpCircle className="h-4 w-4 text-gray-600" />
            </Button>

            {/* Settings */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg hover:bg-white/20"
            >
              <Settings className="h-4 w-4 text-gray-600" />
            </Button>

            {/* Window Controls (for Tauri) */}
            <div className="flex items-center space-x-1 ml-3 pl-3 border-l border-gray-300">
              <Button
                variant="ghost"
                size="icon"
                onClick={minimizeWindow}
                className="h-8 w-8 rounded-md hover:bg-gray-200/70"
              >
                <Minimize2 className="h-3 w-3 text-gray-600" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={maximizeWindow}
                className="h-8 w-8 rounded-md hover:bg-gray-200/70"
              >
                <Maximize2 className="h-3 w-3 text-gray-600" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={closeWindow}
                className="h-8 w-8 rounded-md hover:bg-red-500 hover:text-white"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Office Info */}
        <div className="md:hidden mt-2 pt-2 border-t border-white/20">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-600">{OFFICE_INFO.name}</span>
            <span className="text-gray-500">
              {staffCount?.total || 0} Staff
            </span>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 px-6 py-1">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4 text-gray-600">
            <span>Ready</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
          <div className="flex items-center space-x-3 text-gray-500">
            <span className="hidden sm:inline">Sri Lanka Standard Time</span>
            <span>{new Date().toLocaleDateString('en-GB')}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;