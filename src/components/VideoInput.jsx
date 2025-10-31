import React, { useRef, useState } from 'react';
import { Link as LinkIcon, Upload } from 'lucide-react';

export default function VideoInput({ onVideoSubmit }) {
  const fileInputRef = useRef(null);
  const [url, setUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const objectUrl = URL.createObjectURL(file);
      setUrl(objectUrl);
      setStatus(`Selected file: ${file.name}`);
    } else {
      setFileName('');
      setStatus('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url) {
      setStatus('Please select a video file or paste a link.');
      return;
    }
    onVideoSubmit({ url, fileName });
    setStatus('Video loaded. You can paste a transcript or start studying.');
  };

  return (
    <section aria-labelledby="video-input-heading" className="w-full">
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="video-input-heading" className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              1. Add your video
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Upload a file or paste a public link. Then paste the transcript or use your own notes.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3" noValidate>
          <div className="sm:col-span-2">
            <label htmlFor="video-url" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Video URL</label>
            <div className="mt-1 flex rounded-lg ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus-within:ring-2 focus-within:ring-indigo-500 dark:bg-slate-900">
              <span className="inline-flex items-center px-3 text-gray-500"><LinkIcon className="h-4 w-4" aria-hidden="true" /></span>
              <input
                id="video-url"
                type="url"
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 rounded-r-lg border-0 bg-transparent py-2.5 px-3 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none"
                aria-describedby="video-url-help"
              />
            </div>
            <p id="video-url-help" className="mt-1 text-xs text-gray-500">You can also choose a local file.</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Or upload</label>
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 text-white font-medium px-4 py-2.5 shadow hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                aria-label="Upload a video file"
              >
                <Upload className="h-4 w-4" aria-hidden="true" />
                Choose file
              </button>
              <input ref={fileInputRef} onChange={handleFileChange} type="file" accept="video/*" className="sr-only" aria-label="Video file input" />
              {fileName && (
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-300 truncate" aria-live="polite">{fileName}</p>
              )}
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-lg bg-gray-900 text-white font-medium px-4 py-2.5 shadow hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
            >
              Load video
            </button>
            <p className="text-xs text-gray-500" aria-live="polite">{status}</p>
          </div>
        </form>
      </div>
    </section>
  );
}
