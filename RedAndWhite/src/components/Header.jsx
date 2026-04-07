import React from 'react';
import { Link } from '@tanstack/react-router';
import ThemeToggle from './ThemeToggle';
import { BookOpen } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 glass">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-rwred-600 dark:text-rwred-500 font-bold text-2xl">
          <BookOpen className="w-8 h-8" />
          <span>RW Skill</span>
        </Link>
        <nav className="hidden md:flex gap-6 font-medium text-slate-700 dark:text-slate-300">
          <Link to="/" className="hover:text-rwred-600 dark:hover:text-rwred-500 transition-colors">Home</Link>
          <a href="#" className="hover:text-rwred-600 dark:hover:text-rwred-500 transition-colors">Courses</a>
          <a href="#" className="hover:text-rwred-600 dark:hover:text-rwred-500 transition-colors">About Us</a>
          <a href="#" className="hover:text-rwred-600 dark:hover:text-rwred-500 transition-colors">Contact</a>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button className="btn-primary hidden md:block px-5 py-2 text-sm">Get Started</button>
        </div>
      </div>
    </header>
  );
}
