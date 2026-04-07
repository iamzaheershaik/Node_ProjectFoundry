import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 py-12 mt-20">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold text-white mb-4">RW Skill Education</h2>
          <p className="text-slate-400 mb-6 max-w-md">Empowering students with industry-ready skills and modern technologies. Red & White is a premier institute for skill education.</p>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><a href="#" className="hover:text-rwred-500 transition-colors">Coding</a></li>
            <li><a href="#" className="hover:text-rwred-500 transition-colors">Design</a></li>
            <li><a href="#" className="hover:text-rwred-500 transition-colors">AI & ML</a></li>
            <li><a href="#" className="hover:text-rwred-500 transition-colors">Business</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>Surat, Gujarat</li>
            <li>info@rwskill.edu.in</li>
            <li>+91 99999 00000</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} Red & White Skill Education. All rights reserved.
      </div>
    </footer>
  );
}
