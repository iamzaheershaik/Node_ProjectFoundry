import { createRoute } from '@tanstack/react-router';
import React from 'react';
import { Route as rootRoute } from './__root';
import Hero from '../components/Hero';
import CourseCard from '../components/CourseCard';

const courses = [
  {
    title: 'Full Stack Development',
    category: 'Coding / Programming',
    duration: '14 Months',
    description: 'Become a complete developer - front to back, idea to launch with specialized industry tools.'
  },
  {
    title: 'AI/ML & Data Science',
    category: 'Artificial Intelligence',
    duration: '16 Months',
    description: 'Teach machines to learn, predict, and innovate. Master the skills that drive modern automation.'
  },
  {
    title: 'UI/UX & Graphic Design',
    category: 'Design',
    duration: '14 Months',
    description: 'Master design skills that blend creativity with career success. Build aesthetic and functional interfaces.'
  },
  {
    title: 'Cyber Security',
    category: 'Security',
    duration: '6 Months',
    description: 'Protect data, prevent threats, secure the future. Become an expert in ethical hacking.'
  }
];

const HomeComponent = () => {
  return (
    <div className="flex flex-col gap-20 pb-20">
      <Hero />
      
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Top Programs</h2>
          <p className="text-slate-600 dark:text-slate-400">Join our industry-leading programs and elevate your career</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, idx) => (
            <CourseCard key={idx} {...course} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="btn-outline">View All Courses</button>
        </div>
      </section>
    </div>
  );
};

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomeComponent,
});
