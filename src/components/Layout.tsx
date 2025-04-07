
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Meal Planner' },
    { path: '/settings', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-green-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">MealPrep Pal</Link>
          <nav>
            <ul className="flex space-x-6">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    className={cn(
                      "hover:text-green-200 transition-colors",
                      location.pathname === item.path && "font-bold underline"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto flex-grow p-4">
        {children}
      </main>
      
      <footer className="bg-green-600 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 MealPrep Pal - Your AI Meal Planning Assistant</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
