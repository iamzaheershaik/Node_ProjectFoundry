import { createRootRoute, Outlet } from '@tanstack/react-router';
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col font-outfit text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-950">
      <Header />
      <main className="flex-1 w-full relative">
        <Outlet />
      </main>
      <Footer />
    </div>
  ),
});
