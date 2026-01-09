
import React, { useState, useCallback } from 'react';
import { analyzeNarrativeConsistency } from './services/geminiService';
import { AnalysisResult, ConsistencyStatus } from './types';
import BDHVisualizer from './components/BDHVisualizer';

const App: React.FC = () => {
  const [narrative, setNarrative] = useState('');
  const [backstory, setBackstory] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunAnalysis = async () => {
    if (!narrative || !backstory) {
      setError('Please provide both narrative and backstory text.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await analyzeNarrativeConsistency(narrative, backstory);
      setResult(analysis);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during reasoning.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setter(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <header className="mb-12 border-b border-slate-800 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-red-600 p-2 rounded-lg">
              <i className="fas fa-dragon text-white text-2xl"></i>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Track B: BDH Continuous Reasoner</h1>
          </div>
          <p className="text-slate-400 max-w-2xl">
            Evaluating narrative consistency using Baby Dragon Hatchling (BDH) inspired mechanisms,
            focusing on persistent internal states and causal pathways.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
           <div className="text-right">
             <div className="text-xs uppercase text-slate-500 font-bold">Hackathon Team</div>
             <div className="text-sm font-medium">Alpha-Delta-Logic</div>
           </div>
           <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
             <i className="fas fa-users text-slate-400"></i>
           </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <i className="fas fa-book-open text-blue-400"></i>
              Narrative Input
            </h2>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-400">
                Full Text of Novel (.txt)
                <input 
                  type="file" 
                  accept=".txt" 
                  onChange={(e) => handleFileUpload(e, setNarrative)}
                  className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all cursor-pointer"
                />
              </label>
              <textarea
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
                placeholder="Or paste narrative snippet here..."
                className="w-full h-48 bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-serif resize-none"
              />
            </div>
          </section>

          <section className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <i className="fas fa-user-tag text-purple-400"></i>
              Hypothetical Backstory
            </h2>
            <textarea
              value={backstory}
              onChange={(e) => setBackstory(e.target.value)}
              placeholder="Character outline: early-life, beliefs, ambitions, assumptions..."
              className="w-full h-48 bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all font-serif resize-none"
            />
          </section>

          <button
            onClick={handleRunAnalysis}
            disabled={isProcessing}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-all ${
              isProcessing 
                ? 'bg-slate-700 cursor-not-allowed text-slate-500' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white active:scale-[0.98]'
            }`}
          >
            {isProcessing ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Processing with BDH Engine...
              </>
            ) : (
              <>
                <i className="fas fa-brain"></i>
                Execute BDH Reasoning
              </>
            )}
          </button>

          {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-xl text-sm flex items-start gap-3">
              <i className="fas fa-exclamation-triangle mt-1"></i>
              {error}
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          {!result && !isProcessing && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl min-h-[500px]">
              <i className="fas fa-microchip text-6xl mb-4 opacity-20"></i>
              <p>Upload a narrative and backstory to start BDH reasoning.</p>
            </div>
          )}

          {isProcessing && (
            <div className="space-y-4 animate-pulse">
              <div className="h-24 bg-slate-800 rounded-2xl"></div>
              <div className="h-64 bg-slate-800 rounded-2xl"></div>
              <div className="h-48 bg-slate-800 rounded-2xl"></div>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              {/* Verdict Card */}
              <div className={`p-6 rounded-2xl border flex items-center justify-between ${
                result.status === ConsistencyStatus.CONSISTENT 
                  ? 'bg-emerald-900/20 border-emerald-500/30' 
                  : 'bg-rose-900/20 border-rose-500/30'
              }`}>
                <div>
                  <div className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-1">Consistency Judgment</div>
                  <div className={`text-4xl font-black ${
                    result.status === ConsistencyStatus.CONSISTENT ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {result.status === ConsistencyStatus.CONSISTENT ? 'CONSISTENT (1)' : 'CONTRADICT (0)'}
                  </div>
                </div>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                   result.status === ConsistencyStatus.CONSISTENT ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                }`}>
                  <i className={`fas ${result.status === ConsistencyStatus.CONSISTENT ? 'fa-check' : 'fa-times'}`}></i>
                </div>
              </div>

              {/* Rationale */}
              <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
                <h3 className="text-sm font-semibold uppercase text-slate-400 mb-4 tracking-wider">Causal Reasoning Rationale</h3>
                <p className="text-slate-200 leading-relaxed font-serif">
                  {result.rationale}
                </p>
              </div>

              {/* Visualization */}
              <BDHVisualizer states={result.internalStates} />

              {/* Evidence Dossier */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase text-slate-400 tracking-wider">Evidence Dossier (Verbatim Analysis)</h3>
                {result.evidence.map((ev, i) => (
                  <div key={i} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-1 bg-slate-700 text-[10px] rounded uppercase font-bold text-slate-400">Claim ID: {ev.claimId}</span>
                      <i className="fas fa-quote-right text-slate-600"></i>
                    </div>
                    <div className="italic text-slate-300 border-l-2 border-blue-500 pl-4 py-1 bg-slate-900/50">
                      "{ev.excerpt}"
                    </div>
                    <div className="text-sm text-slate-400">
                      <span className="text-blue-400 font-semibold">Linkage Analysis:</span> {ev.analysis}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-20 pt-8 border-t border-slate-800 text-center text-slate-500 text-xs">
        <p>© 2026 Kharagpur Data Science Hackathon - Track B Submission (Simulated BDH-Driven Reasoning)</p>
      </footer>
    </div>
  );
};

export default App;
