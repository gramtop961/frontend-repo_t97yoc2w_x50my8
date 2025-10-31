import React from 'react';
import Spline from '@splinetool/react-spline';
import { Rocket } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-10 sm:py-14">
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-600/10 px-3 py-1 text-indigo-600 text-sm font-medium">
              <Rocket className="h-4 w-4" aria-hidden="true" />
              Learn faster with AI-assisted study
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
              Video-to-Study Dashboard
            </h1>
            <p className="mt-3 text-base sm:text-lg text-gray-600 dark:text-gray-300">
              Upload or paste a video link, view the transcript, get an instant summary, then practice with flashcards and a quiz — all in one clean, accessible interface.
            </p>
          </div>
          <div className="order-1 lg:order-2 h-[420px] sm:h-[520px] w-full rounded-xl overflow-hidden ring-1 ring-black/10 dark:ring-white/10 bg-gradient-to-br from-indigo-50 via-white to-teal-50 dark:from-indigo-950 dark:via-slate-900 dark:to-teal-950">
            <Spline
              scene="https://prod.spline.design/hGDm7Foxug7C6E8s/scene.splinecode"
              style={{ width: '100%', height: '100%' }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent dark:from-black/40" />
          </div>
        </div>
      </div>
    </section>
  );
}
