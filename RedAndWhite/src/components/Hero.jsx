import React from 'react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-40">
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-rwred-500/10 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Master the Future with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rwred-500 to-rwred-700 dark:from-rwred-400 dark:to-rwred-600">Red & White Skills</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-10">
          Unlock your potential with premium courses in Full Stack Development, AI/ML, Design, and more.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="btn-primary">
            Explore Courses
          </button>
          <button className="btn-outline">
            Talk to an Advisor
          </button>
        </div>
      </div>
    </section>
  );
}
