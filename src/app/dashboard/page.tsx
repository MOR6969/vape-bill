'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '../components/Dashboard';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img src="/images/logo.png" alt="Sierra Vape Logo" className="h-10 w-auto" />
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <a 
                href="/billing" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Billing
              </a>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v1a1 1 0 102 0V9z"
                    clipRule="evenodd"
                  />
                </svg>
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <Dashboard />
    </main>
  );
} 