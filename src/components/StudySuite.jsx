import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, Cards, ListChecks, RefreshCw } from 'lucide-react';

function summarizeText(text) {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) return '';
  const sentences = clean.split(/(?<=[.!?])\s+/).slice(0, 6);
  // naive scoring: prefer sentences with frequent keywords
  const words = clean.toLowerCase().match(/[a-zA-Z][a-zA-Z\-']+/g) || [];
  const freq = words.reduce((m, w) => (m[w] = (m[w] || 0) + 1, m), {});
  const scored = sentences.map(s => ({ s, score: (s.toLowerCase().match(/[a-zA-Z][a-zA-Z\-']+/g) || []).reduce((acc, w) => acc + (freq[w] || 0), 0) / (s.length + 1) }));
  return scored.sort((a,b) => b.score - a.score).slice(0, Math.min(3, scored.length)).map(x => x.s).join(' ');
}

function generateFlashcards(text, limit = 10) {
  const paras = text.split(/\n{2,}/).map(p => p.replace(/\s+/g, ' ').trim()).filter(Boolean);
  const cards = [];
  paras.forEach((p, idx) => {
    const words = (p.match(/\b([A-Z][a-z]+|[a-z]{6,})\b/g) || []).slice(0, 3);
    if (words.length) {
      words.forEach((w, i) => {
        cards.push({
          id: `${idx}-${i}-${w}`,
          front: `Define: ${w}`,
          back: `In this context, ${w} refers to a key idea from your notes. Explain it in your own words.`
        });
      });
    } else if (p.length > 40) {
      cards.push({ id: `${idx}-summary`, front: p.slice(0, 60) + '…', back: 'Summarize this idea in one sentence.' });
    }
  });
  return cards.slice(0, limit);
}

function createQuizFromCards(cards) {
  const optionsFrom = (word) => {
    const wrongs = cards.map(c => c.front.replace('Define: ', '')).filter(w => w !== word);
    const shuffled = wrongs.sort(() => Math.random() - 0.5).slice(0, 3);
    const choices = [...shuffled, word].sort(() => Math.random() - 0.5);
    return choices;
  };
  return cards.slice(0, 5).map((c, i) => {
    const answer = c.front.replace('Define: ', '');
    return {
      id: `q-${i}`,
      prompt: `Which term best matches this prompt? "${c.back}"`,
      choices: optionsFrom(answer),
      answer,
    };
  });
}

export default function StudySuite({ transcript }) {
  const [activeTab, setActiveTab] = useState('summary');

  const summary = useMemo(() => summarizeText(transcript), [transcript]);
  const cards = useMemo(() => generateFlashcards(transcript), [transcript]);
  const quiz = useMemo(() => createQuizFromCards(cards), [cards]);

  useEffect(() => {
    // reset to summary when transcript changes
    setActiveTab('summary');
  }, [transcript]);

  return (
    <section aria-labelledby="study-suite-heading" className="w-full">
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600" aria-hidden="true" />
            <h2 id="study-suite-heading" className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">3. Study tools</h2>
          </div>
          <div className="text-xs text-gray-500" aria-live="polite">Auto-updates as you edit the transcript</div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2" role="tablist" aria-label="Study views">
          <TabButton icon={BookOpen} label="Summary" id="summary" active={activeTab==='summary'} onClick={() => setActiveTab('summary')} />
          <TabButton icon={Cards} label="Flashcards" id="flashcards" active={activeTab==='flashcards'} onClick={() => setActiveTab('flashcards')} />
          <TabButton icon={ListChecks} label="Quiz" id="quiz" active={activeTab==='quiz'} onClick={() => setActiveTab('quiz')} />
        </div>

        <div className="mt-4">
          {activeTab === 'summary' && <SummaryView summary={summary} transcript={transcript} />}
          {activeTab === 'flashcards' && <FlashcardsView cards={cards} />}
          {activeTab === 'quiz' && <QuizView quiz={quiz} />}
        </div>
      </div>
    </section>
  );
}

function TabButton({ icon: Icon, label, id, active, onClick }) {
  return (
    <button
      role="tab"
      aria-selected={active}
      aria-controls={`${id}-panel`}
      id={`${id}-tab`}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ring-1 ring-inset transition ${active ? 'bg-indigo-600 text-white ring-indigo-600' : 'bg-transparent text-gray-700 dark:text-gray-200 ring-gray-300 dark:ring-gray-700 hover:bg-gray-50/50 dark:hover:bg-white/5'}`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </button>
  );
}

function SummaryView({ summary, transcript }) {
  return (
    <div role="tabpanel" id="summary-panel" aria-labelledby="summary-tab">
      {summary ? (
        <p className="text-gray-900 dark:text-gray-100 leading-relaxed text-sm sm:text-base">{summary}</p>
      ) : (
        <p className="text-gray-500">Add some transcript text to see a concise summary here.</p>
      )}
      {transcript && (
        <details className="mt-3 group">
          <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-300">Show full transcript context</summary>
          <div className="mt-2 max-h-60 overflow-auto rounded-lg bg-gray-50 dark:bg-slate-800 p-3 text-xs text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
            {transcript}
          </div>
        </details>
      )}
    </div>
  );
}

function FlashcardsView({ cards }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => { setIndex(0); setFlipped(false); }, [cards]);

  if (!cards.length) {
    return <p className="text-gray-500">Add more transcript text to generate practice cards.</p>;
  }

  const current = cards[index];

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(cards.length - 1, i + 1));

  return (
    <div role="tabpanel" id="flashcards-panel" aria-labelledby="flashcards-tab">
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
        <span>Card {index + 1} of {cards.length}</span>
        <button onClick={() => { setFlipped(false); setIndex(Math.floor(Math.random() * cards.length)); }} className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md ring-1 ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-white/5"><RefreshCw className="h-4 w-4" /> Random</button>
      </div>
      <button
        onClick={() => setFlipped((f) => !f)}
        className="mt-3 w-full aspect-[3/2] perspective rounded-xl bg-gradient-to-br from-indigo-50 via-white to-teal-50 dark:from-indigo-950 dark:via-slate-900 dark:to-teal-950 ring-1 ring-black/10 dark:ring-white/10 flex items-center justify-center"
        aria-label={flipped ? 'Show question' : 'Show answer'}
      >
        <div className={`transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? 'rotate-y-180' : ''} w-full h-full flex items-center justify-center p-6`}> 
          <div className="absolute backface-hidden text-center text-gray-900 dark:text-white text-base sm:text-lg font-medium">
            {current.front}
          </div>
          <div className="absolute backface-hidden rotate-y-180 text-center text-gray-900 dark:text-white text-sm sm:text-base">
            {current.back}
          </div>
        </div>
      </button>
      <div className="mt-3 flex items-center justify-between">
        <button onClick={prev} disabled={index === 0} className="rounded-lg px-4 py-2 text-sm font-medium ring-1 ring-gray-300 dark:ring-gray-700 disabled:opacity-50">Previous</button>
        <button onClick={next} disabled={index === cards.length - 1} className="rounded-lg px-4 py-2 text-sm font-medium ring-1 ring-gray-300 dark:ring-gray-700 disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}

function QuizView({ quiz }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!quiz.length) return <p className="text-gray-500">Add more transcript text to build a quick quiz.</p>;

  const score = Object.entries(answers).reduce((acc, [id, ans]) => acc + (quiz.find(q => q.id === id)?.answer === ans ? 1 : 0), 0);

  return (
    <form role="tabpanel" id="quiz-panel" aria-labelledby="quiz-tab" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
      <ol className="space-y-4 list-decimal list-inside">
        {quiz.map((q) => (
          <li key={q.id} className="rounded-lg p-3 ring-1 ring-gray-200 dark:ring-gray-800">
            <p className="font-medium text-gray-900 dark:text-gray-100">{q.prompt}</p>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {q.choices.map((c) => {
                const checked = answers[q.id] === c;
                const correct = submitted && q.answer === c;
                const wrong = submitted && checked && q.answer !== c;
                return (
                  <label key={c} className={`flex items-center gap-2 rounded-md px-3 py-2 ring-1 ${checked ? 'ring-indigo-500' : 'ring-gray-300 dark:ring-gray-700'} ${correct ? 'bg-green-50 dark:bg-green-950/30 ring-green-500' : ''} ${wrong ? 'bg-red-50 dark:bg-red-950/30 ring-red-500' : ''}`}>
                    <input
                      type="radio"
                      name={q.id}
                      value={c}
                      checked={checked}
                      onChange={() => setAnswers(a => ({ ...a, [q.id]: c }))}
                      className="h-4 w-4"
                      aria-checked={checked}
                    />
                    <span className="text-sm text-gray-800 dark:text-gray-200">{c}</span>
                  </label>
                );
              })}
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-4 flex items-center justify-between">
        <button type="submit" className="rounded-lg bg-indigo-600 text-white px-4 py-2 font-medium hover:bg-indigo-500">Check answers</button>
        {submitted && (
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100" aria-live="polite">Score: {score} / {quiz.length}</div>
        )}
      </div>
    </form>
  );
}
