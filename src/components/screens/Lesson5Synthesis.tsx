import React from 'react';
import { LessonFooterNav } from '../Layout/LessonFooterNav';
import { LessonHeader, ObjectiveBox } from '../common/Blocks';
import { SynthesisForceDiagram } from '../diagrams/ForceComparisonDiagrams';
import { IntegratedSynthesisActivity } from '../activities/IntegratedSynthesisActivity';
import { ScreenId } from '../../physics/calculations';

interface LessonProps {
  isCompleted: boolean;
  onNavigate: (id: ScreenId) => void;
  onCompleteLesson: () => void;
  onActivityUsed: (activityId: string) => void;
}

export const Lesson5Synthesis: React.FC<LessonProps> = ({
  isCompleted,
  onNavigate,
  onCompleteLesson,
  onActivityUsed,
}) => {
  const handleCompleted = () => {
    onActivityUsed('integrated-synthesis');
    onCompleteLesson();
  };

  return (
    <article>
      <LessonHeader
        breadcrumbLabel="Lesson 5"
        title="Putting the Laws Together"
        duration="15 min"
        objectiveTag="Objective 6"
        isCompleted={isCompleted}
      />

      <ObjectiveBox objective="Interpret simple real-world force-and-motion situations using Newton's laws." />

      <section className="mt-8 space-y-4 text-sm sm:text-base text-[#334155]">
        <h2 className="text-xl font-semibold text-[#172033]">
          1. Integrated Real-World Scenario
        </h2>
        <blockquote className="rounded-md border border-[#CBD5E1] bg-[#F5F7FA] p-5 text-[#172033]">
          <p className="text-base sm:text-lg font-medium leading-relaxed">
            “A student pushes a 5 kg box across a horizontal floor with a force of 15 N. Friction acts on the box with a force of 5 N in the opposite direction.”
          </p>
        </blockquote>

        <p>
          In real situations, solving a motion problem means combining ideas from all four previous lessons:
        </p>
        <ul className="space-y-1.5 list-disc pl-5">
          <li>
            <strong>Lesson 1 (Net Force):</strong> Combine the opposing horizontal forces acting on the box.
          </li>
          <li>
            <strong>Lesson 2 (First Law):</strong> Check whether the net force is zero or nonzero to decide if velocity changes.
          </li>
          <li>
            <strong>Lesson 3 (Second Law):</strong> Use <span className="font-mono">a = F_net / m</span> to compute acceleration magnitude and direction.
          </li>
          <li>
            <strong>Contextual Vertical Forces:</strong> As the box slides across a level floor, <strong>gravity</strong> pulls it downward and the floor’s <strong>normal force</strong> pushes upward with equal strength. Because vertical forces are balanced, vertical acceleration is zero—so we can focus cleanly on horizontal motion. <em>(Detailed free-body diagrams and friction formulas will be explored in Module 2.)</em>
          </li>
        </ul>

        <SynthesisForceDiagram />
      </section>

      <IntegratedSynthesisActivity onCompleted={handleCompleted} />

      {/* Reference Solution Summary */}
      <section aria-labelledby="synth-summary-heading" className="my-8 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-5">
        <h2 id="synth-summary-heading" className="text-base font-semibold text-[#172033]">
          Summary Check: Complete Interpretation
        </h2>
        <dl className="mt-3 grid gap-2 sm:grid-cols-2 text-sm">
          <div className="bg-white rounded border border-[#E2E8F0] p-3">
            <dt className="text-xs font-medium text-[#64748B]">Horizontal Forces</dt>
            <dd className="mt-0.5 font-medium text-[#172033]">Applied: 15 N right · Friction: 5 N left</dd>
          </div>
          <div className="bg-white rounded border border-[#E2E8F0] p-3">
            <dt className="text-xs font-medium text-[#64748B]">Horizontal Net Force</dt>
            <dd className="mt-0.5 font-mono font-medium text-[#172033]">15 N - 5 N = 10 N right</dd>
          </div>
          <div className="bg-white rounded border border-[#E2E8F0] p-3">
            <dt className="text-xs font-medium text-[#64748B]">Acceleration (a = F_net / m)</dt>
            <dd className="mt-0.5 font-mono font-medium text-[#172033]">10 N / 5 kg = 2 m/s² right</dd>
          </div>
          <div className="bg-white rounded border border-[#E2E8F0] p-3">
            <dt className="text-xs font-medium text-[#64748B]">Governing Principle</dt>
            <dd className="mt-0.5 font-medium text-[#172033]">Newton’s Second Law (horizontal)</dd>
          </div>
        </dl>
      </section>

      <LessonFooterNav
        currentScreen="lesson-5"
        isCompleted={isCompleted}
        onNavigate={onNavigate}
        onMarkComplete={onCompleteLesson}
        completionHint="Complete the 5-step guided practice above before starting the Final Module Assessment."
      />
    </article>
  );
};
