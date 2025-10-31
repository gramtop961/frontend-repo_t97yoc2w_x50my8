import React, { useState } from 'react';
import Hero from './components/Hero';
import VideoInput from './components/VideoInput';
import TranscriptViewer from './components/TranscriptViewer';
import StudySuite from './components/StudySuite';

export default function App() {
  const [video, setVideo] = useState({ url: '', fileName: '' });
  const [transcript, setTranscript] = useState('');

  const handleVideoSubmit = ({ url, fileName }) => {
    setVideo({ url, fileName });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Hero />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <VideoInput onVideoSubmit={handleVideoSubmit} />
            <TranscriptViewer transcript={transcript} onTranscriptChange={setTranscript} videoUrl={video.url} />
          </div>
          <div className="space-y-6">
            <StudySuite transcript={transcript} />
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 py-6 text-center text-xs text-gray-500">
        Built for learning — accessible, responsive, and private. No data leaves your browser.
      </footer>
    </div>
  );
}
