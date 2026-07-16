import React from 'react';
import { Bell, Menu, Moon, Sun } from 'lucide-react';
import { Avatar } from './Avatar';
import { useTheme } from '../contexts/ThemeContext';

interface TopNavbarProps {
 onMenuClick?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onMenuClick }) => {
 const { theme, toggleTheme } = useTheme();

 return (
 <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-surface/80 px-4 backdrop-blur-md md:px-6">
 <div className="flex items-center gap-4">
 <button
 onClick={onMenuClick}
 className="inline-flex items-center justify-center rounded-md p-2 text-text-secondary hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary/50 md:hidden"
 >
 <Menu className="h-5 w-5" />
 </button>
 <h2 className="text-title text-text-primary md:hidden">PLOS</h2>
 </div>

 <div className="flex items-center gap-4">
 <button onClick={toggleTheme} className="relative rounded-full p-2 text-text-secondary hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary/50">
 {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
 </button>
 <button className="relative rounded-full p-2 text-text-secondary hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary/50">
 <Bell className="h-5 w-5" />
 <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-danger ring-2 ring-surface" />
 </button>

 <Avatar initials="JD" size="sm" className="cursor-pointer" />
 </div>
 </header>
 );
};
