import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function CourseCard({ title, duration, category, description }) {
  return (
    <div className="glass rounded-2xl p-6 group cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div className="text-xs font-bold text-rwred-600 dark:text-rwred-400 mb-2 uppercase tracking-wide">
        {category}
      </div>
      <h3 className="text-xl font-bold mb-3 group-hover:text-rwred-600 dark:group-hover:text-rwred-400 transition-colors">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3">
        {description}
      </p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
          {duration}
        </span>
        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-rwred-600 transition-colors group-hover:translate-x-1" />
      </div>
    </div>
  );
}
