import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Target, Route, BookOpen, CheckSquare, BrainCircuit, Settings, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useSidebarStore } from '@/stores/sidebar';

export const Sidebar: React.FC = () => {
  const { isOpen, toggle, setOpen } = useSidebarStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && isOpen) {
        setOpen(false);
      }
    };
    handleResize(); // Init
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, setOpen]);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { name: 'Goal Setup', path: '/goals', icon: <Target className="h-4 w-4" /> },
    { name: 'Journey', path: '/journey', icon: <Route className="h-4 w-4" /> },
    { name: 'Learning Plan', path: '/plan', icon: <BookOpen className="h-4 w-4" /> },
    { name: 'Tasks', path: '/tasks', icon: <CheckSquare className="h-4 w-4" /> },
    { name: 'Reflection', path: '/reflection', icon: <BrainCircuit className="h-4 w-4" /> },
  ];

  const sidebarContent = (
    <>
      <div className="flex h-14 items-center justify-between px-4">
        {isOpen ? <h1 className="text-sm font-bold tracking-tight text-text-primary ml-2">PLOS</h1> : <span />}
        <button onClick={toggle} className="p-1.5 text-text-muted hover:text-text-primary hover:bg-surface-hover rounded-md transition-colors" aria-label="Toggle Sidebar">
          {isOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
        </button>
      </div>
      
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            title={!isOpen ? item.name : undefined}
            onClick={() => isMobile && setOpen(false)}
            className={({ isActive }) =>
              `group flex items-center gap-3 py-1.5 transition-colors rounded-sm ${
                isOpen ? 'px-3' : 'justify-center px-0'
              } ${
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
                {isOpen && item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-3">
        <NavLink
          to="/settings"
          title={!isOpen ? 'Settings' : undefined}
          onClick={() => isMobile && setOpen(false)}
          className={({ isActive }) =>
            `group flex items-center gap-3 py-1.5 text-sm transition-colors mb-1 rounded-sm ${
              isOpen ? 'px-3' : 'justify-center px-0'
            } ${
              isActive
                ? 'text-text-primary font-semibold border-l-2 border-primary bg-transparent'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover/50 border-l-2 border-transparent'
            }`
          }
        >
          <Settings className="h-4 w-4 text-text-muted group-hover:text-text-primary transition-colors" />
          {isOpen && 'Settings'}
        </NavLink>
        <button
          title={!isOpen ? 'Logout' : undefined}
          className={`group flex w-full items-center gap-3 py-1.5 text-sm text-text-secondary hover:text-danger hover:bg-surface-hover/50 border-l-2 border-transparent transition-colors rounded-sm ${
            isOpen ? 'px-3' : 'justify-center px-0'
          }`}
        >
          <LogOut className="h-4 w-4 text-text-muted group-hover:text-danger transition-colors" />
          {isOpen && 'Logout'}
        </button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Header Toggle */}
        <div className="fixed top-0 left-0 h-14 w-full bg-background border-b border-border z-40 flex items-center px-4 md:hidden">
           <button onClick={toggle} className="p-1.5 text-text-muted hover:text-text-primary rounded-md">
             <LayoutDashboard className="h-5 w-5" />
           </button>
           <h1 className="text-sm font-bold ml-4">PLOS</h1>
        </div>

        {/* Mobile Drawer Overlay */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 md:hidden" onClick={() => setOpen(false)} />
        )}
        
        {/* Mobile Drawer */}
        <aside className={`fixed top-0 left-0 h-full w-[240px] bg-background border-r border-border z-50 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
          {sidebarContent}
        </aside>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <aside className={`hidden md:flex h-screen flex-col bg-background border-r border-border transition-all duration-300 ${isOpen ? 'w-[240px]' : 'w-[60px]'}`}>
      {sidebarContent}
    </aside>
  );
};
