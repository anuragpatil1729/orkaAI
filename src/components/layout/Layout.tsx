import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background text-text-primary antialiased overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 py-8 px-6 max-w-4xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
};
