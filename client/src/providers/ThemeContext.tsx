import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
 theme: Theme;
 toggleTheme: () => void;
 setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
 const [theme, setThemeState] = useState<Theme>(() => {
 const savedTheme = localStorage.getItem('plos-theme');
 if (savedTheme === 'light' || savedTheme === 'dark') {
 return savedTheme;
 }
 // Default to light as per requirements
 return 'light';
 });

 useEffect(() => {
 localStorage.setItem('plos-theme', theme);
 document.documentElement.setAttribute('data-theme', theme);
 }, [theme]);

 const toggleTheme = () => {
 setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
 };

 const setTheme = (newTheme: Theme) => {
 setThemeState(newTheme);
 };

 return (
 <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
 {children}
 </ThemeContext.Provider>
 );
};

export const useTheme = () => {
 const context = useContext(ThemeContext);
 if (context === undefined) {
 throw new Error('useTheme must be used within a ThemeProvider');
 }
 return context;
};
