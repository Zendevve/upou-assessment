import React, { useState } from 'react';
import {
  AlertTriangle,
  BookmarkCheck,
  CheckCircle2,
  Compass,
  HelpCircle,
  RotateCcw,
  Target,
  XCircle,
} from 'lucide-react';
import { COURSE_INFO, LessonIntroSpec, LessonSummarySpec } from '../../data/moduleContent';

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
    <p className="text-xs font-medium tracking-[0.01em] text-[#475569]">
      {COURSE_INFO.moduleLabel} <span aria-hidden="true">/</span> {breadcrumbLabel}
    </p>
    <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-[#172033]">
      {title}
    </h1>
    <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-[#475569]">
      <span>Estimated time: {duration}</span>
      <span aria-hidden="true">·</span>
      <span>{objectiveTag}</span>
      {isCompleted && (
        <>
          <span aria-hidden="true">·</span>
          <span className="surface-enter inline-flex items-center gap-1 font-medium text-[#15803D]">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            Completed
          </span>
        </>
      )}
    </div>
  </header>
);

export const LessonIntro: React.FC<{
  intro: LessonIntroSpec;
}> = ({ intro }) => (
  <section
    aria-label="Lesson introduction and learning objectives"
    className="mt-6 rounded-md border border-[#BFDBFE] bg-[#EFF6FF] p-5 sm:p-6 space-y-4"
  >
    <div>
      <p className="text-xs font-semibold tracking-[0.01em] text-[#1E40AF] flex items-center gap-1.5">
        <Target className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Lesson Overview & Learning Objectives</span>
      </p>
      <p className="mt-1.5 text-sm sm:text-base text-[#172033] leading-relaxed">
        {intro.description}
      </p>
    </div>

    <div className="rounded border border-[#BFDBFE]/80 bg-white p-4">
      <h2 className="text-sm font-semibold text-[#172033]">
        Specific Objectives (What You Will Be Able to Do)
      </h2>
      <ul className="mt-2 space-y-1.5 text-sm text-[#334155] list-disc pl-5">
        {intro.objectives.map((obj) => (
          <li key={obj}>{obj}</li>
        ))}
      </ul>
    </div>

    <div className="grid gap-3 sm:grid-cols-2 text-sm">
      <div className="rounded border border-[#E2E8F0] bg-white/85 px-4 py-3">
        <p className="text-xs font-semibold text-[#1E40AF]">Everyday Connection</p>
        <p className="mt-1 text-[#334155]">{intro.everydayExample}</p>
      </div>
      <div className="rounded border border-[#E2E8F0] bg-white/85 px-4 py-3">
        <p className="text-xs font-semibold text-[#15803D]">What You Will Accomplish</p>
        <p className="mt-1 text-[#334155]">{intro.accomplishment}</p>
      </div>
    </div>
  </section>
);

export const LessonSummary: React.FC<{
  lessonLabel: string;
  summary: LessonSummarySpec;
  onOpenReference?: () => void;
}> = ({ lessonLabel, summary, onOpenReference }) => (
  <section
    aria-label={`${lessonLabel} key summary`}
    className="my-8 rounded-md border border-[#CBD5E1] bg-[#F8FAFC] p-5 sm:p-6 space-y-4"
  >
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
      <div className="flex items-center gap-2">
        <BookmarkCheck className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-[#172033]">
          {lessonLabel} Summary & Quick Review
        </h2>
      </div>
      {onOpenReference && (
        <button
          type="button"
          onClick={onOpenReference}
          className="tactile-press text-xs font-medium text-[#1D4ED8] hover:underline"
        >
          Open Glossary & Formulas →
        </button>
      )}
    </div>

    <div>
      <h3 className="text-sm font-semibold text-[#172033]">Key Takeaways</h3>
      <ul className="mt-2 space-y-1.5 text-sm text-[#334155] list-disc pl-5">
        {summary.takeaways.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </div>

    <div className="grid gap-3 sm:grid-cols-2 text-sm">
      <div className="rounded border border-[#E2E8F0] bg-white p-3.5">
        <h3 className="text-xs font-semibold text-[#475569]">Core Definitions</h3>
        <dl className="mt-2 space-y-1.5">
          {summary.definitions.map((d) => (
            <div key={d.term}>
              <dt className="font-semibold text-[#172033] inline">{d.term}: </dt>
              <dd className="text-[#334155] inline">{d.text}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="rounded border border-[#E2E8F0] bg-white p-3.5 space-y-2.5">
        <div>
          <h3 className="text-xs font-semibold text-[#475569]">Key Relationship / Formula</h3>
          <div className="mt-1.5 space-y-1">
            {summary.formulas.map((f) => (
              <p key={f} className="font-mono text-xs sm:text-sm font-semibold text-[#1E3A8A]">
                {f}
              </p>
            ))}
          </div>
        </div>
        <div className="border-t border-[#E2E8F0] pt-2">
          <h3 className="text-xs font-semibold text-[#475569] flex items-center gap-1">
            <Compass className="h-3.5 w-3.5 text-[#15803D]" aria-hidden="true" />
            <span>Everyday Application</span>
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-[#334155]">{summary.everydayApplication}</p>
        </div>
      </div>
    </div>
  </section>
);

export const ObjectiveBox: React.FC<{ objective: string; label?: string }> = ({
  objective,
  label = 'Learning Objective',
}) => (
  <section
    aria-label={label}
    className="mt-6 rounded-md border border-[#BFDBFE] bg-[#EFF6FF] px-5 py-4"
  >
    <p className="text-xs font-semibold tracking-[0.01em] text-[#1E40AF]">
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
    <p className="text-xs font-semibold tracking-[0.01em] text-[#475569]">{title}</p>
    <p className="mt-2 font-mono text-xl sm:text-2xl font-semibold text-[#172033] tracking-tight">
      {formula}
    </p>
    <dl className="mt-4 grid gap-2.5 sm:grid-cols-3 border-t border-[#E2E8F0] pt-4 text-sm">
      {variables.map((v) => (
        <div key={v.symbol} className="bg-white rounded border border-[#E2E8F0] px-3 py-2.5">
          <dt className="font-mono font-semibold text-[#2563EB]">{v.symbol}</dt>
          <dd className="mt-0.5 text-xs text-[#334155]">{v.meaning}</dd>
          <dd className="mt-0.5 text-xs font-medium text-[#475569]">Unit: {v.unit}</dd>
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
        <p className="text-xs font-semibold tracking-[0.01em] text-[#92400E]">{title}</p>
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
  type?: 'choice' | 'numerical';
  question: string;
  helperText?: string;
  options?: KnowledgeCheckOption[];
  correctNumericValue?: number;
  numericTolerance?: number;
  numericUnit?: string;
  correctFeedback?: string;
  incorrectFeedback?: string;
  onPassed?: () => void;
  alreadyPassed?: boolean;
  isOptionalPractice?: boolean;
}

export const KnowledgeCheck: React.FC<KnowledgeCheckProps> = ({
  id,
  title = 'Quick Knowledge Check',
  type = 'choice',
  question,
  helperText,
  options = [],
  correctNumericValue,
  numericTolerance = 0.05,
  numericUnit,
  correctFeedback = 'Correct!',
  incorrectFeedback = 'Not quite right — review the explanation and try again.',
  onPassed,
  alreadyPassed = false,
  isOptionalPractice = false,
}) => {
  const [selectedId, setSelectedId] = useState<string>('');
  const [numericInput, setNumericInput] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);

  const selectedOption = options.find((o) => o.id === selectedId);
  const parsedNumeric = Number(numericInput.trim());
  const isNumericValid = numericInput.trim() !== '' && Number.isFinite(parsedNumeric);
  const isNumericCorrect =
    type === 'numerical' &&
    isNumericValid &&
    correctNumericValue !== undefined &&
    Math.abs(parsedNumeric - correctNumericValue) <= numericTolerance;

  const isCorrect =
    submitted && (type === 'numerical' ? isNumericCorrect : Boolean(selectedOption?.isCorrect));

  const feedbackText =
    type === 'numerical'
      ? isNumericCorrect
        ? correctFeedback
        : incorrectFeedback
      : selectedOption?.feedback ?? '';

  const canSubmit = type === 'numerical' ? numericInput.trim() !== '' : Boolean(selectedId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitted(true);
    const passedNow =
      type === 'numerical'
        ? isNumericCorrect
        : Boolean(options.find((o) => o.id === selectedId)?.isCorrect);
    if (passedNow) {
      onPassed?.();
    }
  };

  const handleRetry = () => {
    setSelectedId('');
    setNumericInput('');
    setSubmitted(false);
  };

  return (
    <section
      aria-labelledby={`kc-heading-${id}`}
      className={`my-7 rounded-md border p-5 sm:p-6 ${
        isOptionalPractice
          ? 'border-[#CBD5E1] bg-white'
          : 'border-[#CBD5E1] bg-[#F8FAFC]'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />
          <div>
            <h3 id={`kc-heading-${id}`} className="text-base font-semibold text-[#172033]">
              {title}
            </h3>
            {isOptionalPractice && (
              <p className="text-xs font-medium text-[#475569]">
                Optional Practice Checkpoint · Does not lock progression
              </p>
            )}
          </div>
        </div>
        {alreadyPassed && (
          <span className="surface-enter inline-flex items-center gap-1 text-xs font-medium text-[#15803D]">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Check completed
          </span>
        )}
      </div>

      <p className="mt-3 text-sm sm:text-base font-medium text-[#172033]">{question}</p>
      {helperText && <p className="mt-1 text-xs sm:text-sm text-[#475569]">{helperText}</p>}

      <form onSubmit={handleSubmit} className="mt-4 space-y-2.5">
        {type === 'choice' ? (
          <fieldset className="space-y-2">
            <legend className="sr-only">{question}</legend>
            {options.map((opt) => {
              const isSelected = selectedId === opt.id;
              return (
                <label
                  key={opt.id}
                  className={`tactile-card flex items-start gap-3 rounded-md border p-3.5 cursor-pointer min-h-[44px] ${
                    isSelected
                      ? 'border-[#2563EB] bg-[#EFF6FF] shadow-[0_1px_2px_rgba(37,99,235,0.08)]'
                      : 'border-[#E2E8F0] bg-[#F8FAFC] hover:bg-slate-100'
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
        ) : (
          <div>
            <label htmlFor={`kc-num-${id}`} className="block text-sm font-medium text-[#334155]">
              Your Answer {numericUnit ? `(${numericUnit})` : ''}
            </label>
            <div className="mt-2 flex items-center gap-2.5">
              <input
                id={`kc-num-${id}`}
                type="number"
                step="any"
                value={numericInput}
                onChange={(e) => {
                  setNumericInput(e.target.value);
                  if (submitted) setSubmitted(false);
                }}
                placeholder="Enter a number"
                className="w-40 rounded-md border border-[#CBD5E1] bg-white px-3.5 py-2 font-mono text-base text-[#172033] min-h-[44px]"
              />
              {numericUnit && (
                <span className="font-mono text-sm font-semibold text-[#475569]">
                  {numericUnit}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={!canSubmit}
            className="tactile-press rounded-md bg-[#2563EB] px-4 py-2 text-sm font-medium text-white hover:bg-[#1D4ED8] disabled:opacity-45 disabled:cursor-not-allowed min-h-[44px]"
          >
            Check Answer
          </button>

          {submitted && (
            <button
              type="button"
              onClick={handleRetry}
              className="tactile-press inline-flex items-center gap-1.5 rounded-md border border-[#CBD5E1] bg-white px-4 py-2 text-sm font-medium text-[#172033] hover:bg-slate-50 min-h-[44px]"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              {isCorrect ? 'Practice Again' : 'Try Again'}
            </button>
          )}
        </div>
      </form>

      {submitted && (
        <div
          key={`${type === 'numerical' ? numericInput : selectedId}-${isCorrect ? 'ok' : 'no'}`}
          role="status"
          aria-live="polite"
          className={`surface-enter mt-4 rounded-md border p-4 text-sm flex items-start gap-3 ${
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
              {isCorrect ? 'Correct' : 'Incorrect — review and try again'}
            </p>
            <p className="mt-1">{feedbackText}</p>
          </div>
        </div>
      )}
    </section>
  );
};

