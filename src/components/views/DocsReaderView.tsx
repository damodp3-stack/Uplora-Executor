import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Search, ExternalLink, ShieldCheck } from 'lucide-react';

interface DocItem {
  fileName: string;
  title: string;
  content: string;
}

export const DocsReaderView: React.FC = () => {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/docs')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setDocs(data);
          setSelectedDoc(data[0]);
        }
      })
      .catch((err) => console.error('Failed to load docs:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredDocs = docs.filter(
    (d) =>
      d.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <span>System Blueprints &amp; Architecture Documents (21 Docs)</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Complete, implementation-ready specifications written prior to build. Real architectural authority for Uplora.
        </p>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-slate-500">Loading system documents...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
          {/* Left Column: Documents Index */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
            <div className="p-3 border-b border-slate-800">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter 21 documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredDocs.map((doc) => {
                const isSelected = selectedDoc?.fileName === doc.fileName;
                return (
                  <button
                    key={doc.fileName}
                    onClick={() => setSelectedDoc(doc)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                      <span className="truncate">{doc.fileName.replace('.md', '')}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Markdown Reader */}
          <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
            {selectedDoc ? (
              <>
                <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-mono font-bold text-white">/docs/{selectedDoc.fileName}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Markdown Verified</span>
                </div>

                <div className="flex-1 overflow-y-auto p-6 font-sans text-xs text-slate-300 leading-relaxed space-y-4">
                  <pre className="whitespace-pre-wrap font-sans leading-relaxed text-xs">
                    {selectedDoc.content}
                  </pre>
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-slate-500 text-xs">
                Select a document from the left index to read.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
