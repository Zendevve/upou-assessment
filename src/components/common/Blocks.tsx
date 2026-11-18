import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, HelpCircle, RotateCcw, XCircle } from 'lucide-react';
import { COURSE_INFO } from '../../data/moduleContent';

interface LessonHeaderProps {
  breadcrumbLabel: string;
  title: string;
  duration: string;
  objectiveTag: string;
  isCompleted?: boolean;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  breadcrumbLabel,
  title,
  duration,
  objectiveTag,
  isCompleted,
}) => (
  <header className="border-b border-[#E2E8F0] pb-6">
    <p className="text-xs font-medium text-[#64748B]">
      {COURSE_INFO.moduleLabel} <span aria-hidden="true">/</span> {breadcrumbLabel}
    </p>
    <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[#172033]">
      {title}
    </h1>
    <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-[#64748B]">
      <span>Estimated time: {duration}</span>
      <span aria-hidden="true">·</span>
      <span>{objectiveTag}</span>
      {isCompleted && (
        <>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1 font-medium text-[#15803D]">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            Completed
          </span>
        </>
      )}
    </div>
  </header>
);

export const ObjectiveBox: React.FC<{ objective: string; label?: string }> = ({
  objective,
  label = 'Learning Objective',
}) => (
  <section
    aria-label={label}
    className="mt-6 rounded-md border border-[#BFDBFE] bg-[#EFF6FF] px-5 py-4"
  >
    <p className="text-xs font-semibold tracking-tight text-[#1E40AF]">
      {label}
    </p>
    <p className="mt-1 text-sm sm:text-base font-medium text-[#172033]">
      {objective}
    </p>
  </section>
);

export const FormulaPanel: React.FC<{
  title: string;
  formula: string;
  variables: Array<{ symbol: string; meaning: string; unit: string }>;
  note?: string;
}> = ({ title, formula, variables, note }) => (
  <section className="my-6 rounded-md border border-[#E2E8F0] bg-[#F5F7FA] p-5">
    <p className="text-xs font-semibold text-[#475569]">{title}</p>
    <p className="mt-2 font-mono text-xl sm:text-2xl font-semibold text-[#172033] tracking-tight">
      {formula}
    </p>
    <dl className="mt-4 grid gap-2.5 sm:grid-cols-3 border-t border-[#E2E8F0] pt-4 text-sm">
      {variables.map((v) => (
        <div key={v.symbol} className="bg-white rounded border border-[#E2E8F0] px-3 py-2.5">
          <dt className="font-mono font-semibold text-[#2563EB]">{v.symbol}</dt>
          <dd className="mt-0.5 text-xs text-[#334155]">{v.meaning}</dd>
          <dd className="mt-0.5 text-xs font-medium text-[#64748B]">Unit: {v.unit}</dd>
        </div>
      ))}
    </dl>
    {note && <p className="mt-3 text-xs text-[#475569]">{note}</p>}
  </section>
);

export const WorkedExample: React.FC<{
  title: string;
  problem: string;
  steps: Array<{ label: string; content: string }>;
  answer: string;
}> = ({ title, problem, steps, answer }) => (
  <section className="my-6 rounded-md border border-[#E2E8F0] bg-white p-5">
    <h3 className="text-base font-semibold text-[#172033]">{title}</h3>
    <p className="mt-2 text-sm sm:text-base text-[#334155]">{problem}</p>
    <div className="mt-4 space-y-2.5 border-t border-[#E2E8F0] pt-4">
      {steps.map((step) => (
        <div key={step.label} className="grid sm:grid-cols-[120px_1fr] gap-1 sm:gap-4 text-sm">
          <span className="font-semibold text-[#475569]">{step.label}</span>
          <span className="font-mono text-[#172033]">{step.content}</span>
        </div>
      ))}
      <div className="mt-3 rounded border border-[#BBF7D0] bg-[#F0FDF4] px-3.5 py-2.5 text-sm font-medium text-[#15803D] flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>Answer: {answer}</span>
      </div>
    </div>
  </section>
);

export const MisconceptionCallout: React.FC<{
  title?: string;
  statement: string;
  explanation: string;
}> = ({ title = 'Common Misconception to Avoid', statement, explanation }) => (
  <aside
    aria-label={title}
    className="my-6 rounded-md border border-[#FDE68A] bg-[#FFFBEB] p-5"
  >
    <div className="flex items-start gap-3">
      <AlertTriangle className="h-5 w-5 text-[#B45309] shrink-0 mt-0.5" aria-hidden="true" />
      <div>
        <p className="text-xs font-semibold text-[#92400E]">{title}</p>
        <p className="mt-1 text-sm sm:text-base font-semibold text-[#172033]">
          “{statement}”
        </p>
        <p className="mt-1.5 text-sm text-[#475569]">{explanation}</p>
      </div>
    </div>
  </aside>
);

export const KeyConceptGrid: React.FC<{
  items: Array<{ term: string; definition: string }>;
}> = ({ items }) => (
  <div className="my-6 grid gap-3 sm:grid-cols-2">
    {items.map((item) => (
      <div
        key={item.term}
        className="rounded-md border border-[#E2E8F0] bg-[#F5F7FA] p-4"
      >
        <h3 className="text-sm font-semibold text-[#172033]">{item.term}</h3>
        <p className="mt-1 text-sm text-[#475569]">{item.definition}</p>
      </div>
    ))}
  </div>
);

export interface KnowledgeCheckOption {
  id: string;
  label: string;
  isCorrect: boolean;
  feedback: string;
}

interface KnowledgeCheckProps {
  id: string;
  title?: string;
  question: string;
  options: KnowledgeCheckOption[];
  onPassed: () => void;
  alreadyPassed?: boolean;
}

export const KnowledgeCheck: React.FC<KnowledgeCheckProps> = ({
  id,
  title = 'Quick Knowledge Check',
  question,
  options,
  onPassed,
  alreadyPassed = false,
}) => {
  const [selectedId, setSelectedId] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);

  const selectedOption = options.find((o) => o.id === selectedId);
  const isCorrect = Boolean(submitted && selectedOption?.isCorrect);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;
    setSubmitted(true);
    if (options.find((o) => o.id === selectedId)?.isCorrect) {
      onPassed();
    }
  };

  const handleRetry = () => {
    setSelectedId('');
    setSubmitted(false);
  };

  return (
    <section
      aria-labelledby={`kc-heading-${id}`}
      className="my-8 rounded-md border border-[#CBD5E1] bg-[#F8FAFC] p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />
          <h3 id={`kc-heading-${id}`} className="text-base font-semibold text-[#172033]">
            {title}
          </h3>
        </div>
        {alreadyPassed && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#15803D]">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Check completed
          </span>
        )}
      </div>

      <p className="mt-3 text-sm sm:text-base font-medium text-[#172033]">{question}</p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-2.5">
        <fieldset className="space-y-2">
          <legend className="sr-only">{question}</legend>
          {options.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <label
                key={opt.id}
                className={`flex items-start gap-3 rounded-md border p-3.5 cursor-pointer transition-colors min-h-[44px] ${
                  isSelected
                    ? 'border-[#2563EB] bg-[#EFF6FF]'
                    : 'border-[#E2E8F0] bg-white hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name={`kc-${id}`}
                  value={opt.id}
                  checked={isSelected}
                  onChange={() => {
                    setSelectedId(opt.id);
                    if (submitted) setSubmitted(false);
                  }}
                  className="mt-1 h-4 w-4 accent-[#2563EB]"
                />
                <span className="text-sm text-[#172033]">{opt.label}</span>
              </label>
            );
          })}
        </fieldset>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={!selectedId}
            className="rounded-md bg-[#2563EB] px-4 py-2 text-sm font-medium text-white hover:bg-[#1D4ED8] disabled:opacity-45 disabled:cursor-not-allowed min-h-[44px]"
          >
            Check Answer
          </button>

          {submitted && !isCorrect && (
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#CBD5E1] bg-white px-4 py-2 text-sm font-medium text-[#172033] hover:bg-slate-50 min-h-[44px]"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Try Again
            </button>
          )}
        </div>
      </form>

      {submitted && selectedOption && (
        <div
          role="status"
          aria-live="polite"
          className={`mt-4 rounded-md border p-4 text-sm flex items-start gap-3 ${
            isCorrect
              ? 'border-[#BBF7D0] bg-[#F0FDF4] text-[#14532D]'
              : 'border-[#FECACA] bg-[#FEF2F2] text-[#7F1D1D]'
          }`}
        >
          {isCorrect ? (
            <CheckCircle2 className="h-5 w-5 text-[#15803D] shrink-0 mt-0.5" aria-hidden="true" />
          ) : (
            <XCircle className="h-5 w-5 text-[#B91C1C] shrink-0 mt-0.5" aria-hidden="true" />
          )}
          <div>
            <p className="font-semibold">
              {isCorrect ? 'Correct' : 'Not quite right — review and try again'}
            </p>
            <p className="mt-1">{selectedOption.feedback}</p>
          </div>
        </div>
      )}
    </section>
  );
};
