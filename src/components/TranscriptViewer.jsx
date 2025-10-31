import React from 'react';

export default function TranscriptViewer({ transcript, onTranscriptChange, videoUrl }) {
  return (
    <section aria-labelledby="transcript-heading" className="w-full">
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur p-4 sm:p-6">
        <h2 id="transcript-heading" className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          2. Transcript
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Paste the transcript or notes here. You can edit as you go.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="aspect-video w-full rounded-lg overflow-hidden ring-1 ring-black/5">
            {videoUrl ? (
              <video src={videoUrl} className="h-full w-full" controls aria-label="Video player" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                No video loaded yet
              </div>
            )}
          </div>
          <div>
            <label htmlFor="transcript-textarea" className="sr-only">Transcript text</label>
            <textarea
              id="transcript-textarea"
              value={transcript}
              onChange={(e) => onTranscriptChange(e.target.value)}
              placeholder="Paste transcript or notes here..."
              rows={12}
              className="w-full resize-y rounded-lg border-0 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 bg-white/80 dark:bg-slate-900/80 p-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="mt-1 text-xs text-gray-500">Tip: Keep paragraphs short for clearer flashcards.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
