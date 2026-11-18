import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Calculator, ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import { FORMULA_REFERENCE, GLOSSARY_TERMS } from '../../data/moduleContent';

interface ReferenceLibraryModalProps {
  isOpen: boolean;
  initialTab?: 'glossary' | 'formulas';
  onClose: () => void;
}

export const ReferenceLibraryModal: React.FC<ReferenceLibraryModalProps> = ({
  isOpen,
  initialTab = 'glossary',
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'glossary' | 'formulas'>(initialTab);
  const [query, setQuery] = useState('');
  const [expandedTerms, setExpandedTerms] = useState<Record<string, boolean>>({});
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setTimeout(() => closeBtnRef.current?.focus(), 20);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const filteredTerms = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GLOSSARY_TERMS;
    return GLOSSARY_TERMS.filter(
      (item) =>
        item.term.toLowerCase().includes(q) ||
        item.definition.toLowerCase().includes(q) ||
        item.example.toLowerCase().includes(q) ||
        item.unitsOrNotation.toLowerCase().includes(q)
    );
  }, [query]);

  if (!isOpen) return null;

  const toggleTerm = (term: string) => {
    setExpandedTerms((prev) => ({ ...prev, [term]: !prev[term] }));
  };

  const anyCollapsed = filteredTerms.some((t) => !expandedTerms[t.term]);
  const handleToggleAll = () => {
    const nextValue = anyCollapsed;
    const updated: Record<string, boolean> = {};
    for (const item of GLOSSARY_TERMS) {
      updated[item.term] = nextValue;
    }
    setExpandedTerms(updated);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reference-modal-title"
    >
      <div
        className="fixed inset-0 bg-slate-900/50"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="surface-enter relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col rounded-lg border border-[#CBD5E1] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#E2E8F0] px-5 py-4">
          <div>
            <h2 id="reference-modal-title" className="text-lg sm:text-xl font-bold text-[#172033]">
              Glossary & Formula Reference
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-[#475569]">
              Module 1 physics vocabulary, everyday examples, equations, and SI unit conventions
            </p>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close Glossary and Formula Reference"
            className="tactile-press inline-flex items-center justify-center rounded-md border border-[#CBD5E1] bg-white p-2 text-[#334155] hover:bg-slate-50 min-h-[44px] min-w-[44px]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('glossary')}
            aria-pressed={activeTab === 'glossary'}
            className={`tactile-press inline-flex items-center gap-1.5 rounded-md px-3.5 py-2 text-xs sm:text-sm font-medium min-h-[40px] ${
              activeTab === 'glossary'
                ? 'bg-[#2563EB] text-white'
                : 'border border-[#CBD5E1] bg-white text-[#334155] hover:bg-slate-50'
            }`}
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            <span>Physics Glossary ({GLOSSARY_TERMS.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('formulas')}
            aria-pressed={activeTab === 'formulas'}
            className={`tactile-press inline-flex items-center gap-1.5 rounded-md px-3.5 py-2 text-xs sm:text-sm font-medium min-h-[40px] ${
              activeTab === 'formulas'
                ? 'bg-[#2563EB] text-white'
                : 'border border-[#CBD5E1] bg-white text-[#334155] hover:bg-slate-50'
            }`}
          >
            <Calculator className="h-4 w-4" aria-hidden="true" />
            <span>Formula Reference</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {activeTab === 'glossary' ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative flex-1 min-w-[220px]">
                  <label htmlFor="glossary-search-input" className="sr-only">
                    Search glossary terms
                  </label>
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#475569]"
                    aria-hidden="true"
                  />
                  <input
                    id="glossary-search-input"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search terms, examples, or laws (e.g., inertia, N, First Law)..."
                    className="w-full rounded-md border border-[#CBD5E1] bg-white pl-9 pr-3 py-2 text-sm text-[#172033] min-h-[44px]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleToggleAll}
                  className="tactile-press rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-xs font-medium text-[#334155] hover:bg-slate-50 min-h-[44px]"
                >
                  {anyCollapsed ? 'Expand All' : 'Collapse All'}
                </button>
              </div>

              {filteredTerms.length === 0 ? (
                <p className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm text-[#475569]">
                  No glossary terms matched “{query}”. Try searching for “force”, “inertia”, “mass”, or “Newton”.
                </p>
              ) : (
                <ul className="space-y-2.5">
                  {filteredTerms.map((entry) => {
                    const isExpanded = query.trim().length > 0 || Boolean(expandedTerms[entry.term]);
                    return (
                      <li
                        key={entry.term}
                        className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC]"
                      >
                        <button
                          type="button"
                          onClick={() => toggleTerm(entry.term)}
                          aria-expanded={isExpanded}
                          className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left min-h-[44px] hover:bg-slate-100/70 rounded-md"
                        >
                          <div className="min-w-0">
                            <span className="text-sm sm:text-base font-semibold text-[#172033]">
                              {entry.term}
                            </span>
                            <span className="ml-2 font-mono text-xs text-[#1D4ED8]">
                              {entry.unitsOrNotation}
                            </span>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 shrink-0 text-[#475569]" aria-hidden="true" />
                          ) : (
                            <ChevronDown className="h-4 w-4 shrink-0 text-[#475569]" aria-hidden="true" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="border-t border-[#E2E8F0] bg-white px-4 py-3 text-sm space-y-2 rounded-b-md">
                            <p className="text-[#172033]">{entry.definition}</p>
                            <p className="text-xs sm:text-sm text-[#475569]">
                              <strong className="text-[#334155]">Everyday example:</strong> {entry.example}
                            </p>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid gap-3">
                {FORMULA_REFERENCE.formulas.map((f) => (
                  <div
                    key={f.name}
                    className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-4"
                  >
                    <p className="text-xs font-semibold text-[#475569]">{f.name}</p>
                    <p className="mt-1 font-mono text-lg sm:text-xl font-bold text-[#172033]">
                      {f.equation}
                    </p>
                    <p className="mt-1.5 text-xs font-mono text-[#1E40AF]">{f.variables}</p>
                    <p className="mt-1 text-xs sm:text-sm text-[#334155]">{f.whenToUse}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-md border border-[#BFDBFE] bg-[#EFF6FF] p-4 space-y-2">
                <h3 className="text-sm font-semibold text-[#172033]">
                  {FORMULA_REFERENCE.workedExample.title}
                </h3>
                <p className="text-sm text-[#334155]">{FORMULA_REFERENCE.workedExample.problem}</p>
                <ul className="space-y-1 font-mono text-xs sm:text-sm text-[#1E3A8A]">
                  {FORMULA_REFERENCE.workedExample.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 text-xs sm:text-sm">
                <div className="rounded-md border border-[#E2E8F0] bg-white p-4">
                  <h3 className="font-semibold text-[#172033]">Consistent SI Units</h3>
                  <p className="mt-1 text-[#475569]">{FORMULA_REFERENCE.consistentUnitsNote}</p>
                </div>
                <div className="rounded-md border border-[#E2E8F0] bg-white p-4">
                  <h3 className="font-semibold text-[#172033]">Positive & Negative Signs</h3>
                  <p className="mt-1 text-[#475569]">{FORMULA_REFERENCE.signConventionNote}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
