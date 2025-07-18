'use client'

import { useEffect } from 'react'
import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import Results from '@/components/results'

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    document.querySelectorAll('.animate-fade-in-up').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-b from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:bg-slate-950 flex flex-col items-center justify-center text-black dark:text-white scroll-smooth">
      <Navbar />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-24">
        <Hero />
        <Results />
      </main>
    </div>
  )
}

