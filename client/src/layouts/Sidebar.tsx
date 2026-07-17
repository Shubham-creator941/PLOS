import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Target, Route, BookOpen, CheckSquare, BrainCircuit, Settings, LogOut } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { name: 'Goal Setup', path: '/goals', icon: <Target className="h-4 w-4" /> },
    { name: 'Journey', path: '/journey', icon: <Route className="h-4 w-4" /> },
    { name: 'Learning Plan', path: '/plan', icon: <BookOpen className="h-4 w-4" /> },
    { name: 'Tasks', path: '/tasks', icon: <CheckSquare className="h-4 w-4" /> },
    { name: 'Reflection', path: '/reflection', icon: <BrainCircuit className="h-4 w-4" /> },
  ];

  return (
    <aside className="hidden h-screen w-[240px] flex-col bg-background md:flex border-r border-border">
      <div className="flex h-14 items-center px-6">
        <h1 className="text-sm font-bold tracking-tight text-text-primary">PLOS</h1>
      </div>
      
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-1.5 text-sm transition-colors rounded-sm ${
                isActive
                  ? 'text-text-primary font-semibold border-l-2 border-primary bg-transparent'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover/50 border-l-2 border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`${isActive ? 'text-primary' : 'text-text-muted group-hover:text-text-primary'} transition-colors`}>
                  {item.icon}
                </span>
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-3">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `group flex items-center gap-3 px-3 py-1.5 text-sm transition-colors mb-1 rounded-sm ${
              isActive
                ? 'text-text-primary font-semibold border-l-2 border-primary bg-transparent'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover/50 border-l-2 border-transparent'
            }`
          }
        >
          <Settings className="h-4 w-4 text-text-muted group-hover:text-text-primary transition-colors" />
          Settings
        </NavLink>
        <button
          className="group flex w-full items-center gap-3 px-3 py-1.5 text-sm text-text-secondary hover:text-danger hover:bg-surface-hover/50 border-l-2 border-transparent transition-colors rounded-sm"
        >
          <LogOut className="h-4 w-4 text-text-muted group-hover:text-danger transition-colors" />
          Logout
        </button>
      </div>
    </aside>
  );
};
