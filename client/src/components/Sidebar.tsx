import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Target, Route, BookOpen, CheckSquare, BrainCircuit, Settings, LogOut } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Goal Setup', path: '/goals', icon: <Target className="h-5 w-5" /> },
    { name: 'Journey', path: '/journey', icon: <Route className="h-5 w-5" /> },
    { name: 'Learning Plan', path: '/plan', icon: <BookOpen className="h-5 w-5" /> },
    { name: 'Tasks', path: '/tasks', icon: <CheckSquare className="h-5 w-5" /> },
    { name: 'Reflection', path: '/reflection', icon: <BrainCircuit className="h-5 w-5" /> },
  ];

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 md:flex">
      <div className="flex h-16 items-center border-b border-neutral-200 px-6 dark:border-neutral-800">
        <h1 className="text-xl font-bold text-primary-600 dark:text-primary-500">PLOS</h1>
      </div>
      
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-50'
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-neutral-200 p-4 dark:border-neutral-800">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors mb-1 ${
              isActive
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-50'
            }`
          }
        >
          <Settings className="h-5 w-5" />
          Settings
        </NavLink>
        <button
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-danger-600 hover:bg-danger-50 dark:text-danger-500 dark:hover:bg-danger-950/50"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};
