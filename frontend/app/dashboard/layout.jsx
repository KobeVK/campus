// frontend/app/dashboard/layout.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Mock function to get current time
const getCurrentTime = () => {
  return new Date().toLocaleTimeString('he-IL', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

export default function DashboardLayout({ children }) {
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClockInOut = () => {
    // In a real app, this would make an API call to record the clock in/out time
    setIsClockedIn(!isClockedIn);
    
    // Mock API call
    const timestamp = new Date().toISOString();
    console.log(`Teacher ${isClockedIn ? 'clocked out' : 'clocked in'} at ${timestamp}`);
  };

  const navItems = [
    { name: 'דף הבית', href: '/dashboard', icon: '📊' },
    { name: 'יומן', href: '/dashboard/calendar', icon: '📅' },
    { name: 'כיתות', href: '/dashboard/classes', icon: '👨‍👩‍👧‍👦' },
    { name: 'תלמידים', href: '/dashboard/students', icon: '👨‍🎓' },
    { name: 'ציונים', href: '/dashboard/grades', icon: '📝' },
    { name: 'מבחנים', href: '/dashboard/exams', icon: '📄' },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        
        <div className="fixed inset-y-0 right-0 flex max-w-xs w-full bg-white">
          <div className="h-full flex flex-col w-64">
            {/* Sidebar header */}
            <div className="flex items-center justify-between px-4 py-5 bg-blue-700 text-white">
              <h2 className="text-lg font-medium">מערכת ניהול בית הספר</h2>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="text-white focus:outline-none"
              >
                ✕
              </button>
            </div>
            
            {/* Sidebar content */}
            <div className="flex-1 overflow-auto">
              <nav className="px-2 py-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      pathname === item.href
                        ? 'bg-blue-100 text-blue-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            
            {/* Clock In/Out button */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleClockInOut}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isClockedIn ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isClockedIn ? 'החתמת יציאה' : 'החתמת כניסה'}
              </button>
              <p className="mt-2 text-center text-xs text-gray-500">
                {currentTime}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:right-0 md:w-64 md:bg-white md:border-l">
        {/* Sidebar header */}
        <div className="flex items-center justify-center h-16 px-4 bg-blue-700 text-white">
          <h2 className="text-lg font-medium">מערכת ניהול בית הספר</h2>
        </div>
        
        {/* Sidebar content */}
        <div className="flex-1 overflow-auto">
          <nav className="px-2 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  pathname === item.href
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
              >
                <span className="ml-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Clock In/Out button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleClockInOut}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isClockedIn ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isClockedIn ? 'החתמת יציאה' : 'החתמת כניסה'}
          </button>
          <p className="mt-2 text-center text-xs text-gray-500">
            {currentTime}
          </p>
        </div>
      </div>
      
      {/* Main content */}
      <div className="md:pr-64">
        {/* Top header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-4 md:py-0 md:px-6">
            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">פתח תפריט</span>
              ☰
            </button>
            
            {/* Teacher profile dropdown would go here */}
            <div className="flex-1 md:flex md:items-center md:justify-between md:h-16">
              <div className="flex-1" />
              <div className="ml-4 flex items-center md:ml-6">
                <div className="relative">
                  <button className="flex items-center max-w-xs text-sm rounded-full focus:outline-none">
                    <span className="hidden md:inline-block ml-2 text-gray-700">שלום, מורה</span>
                    <span className="inline-block h-8 w-8 rounded-full bg-gray-300 text-center leading-8">מ</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="py-6 px-4 sm:px-6 md:px-8">
          {children}
        </main>
      </div>
    </div>
  );