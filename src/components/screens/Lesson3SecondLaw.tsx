import React from 'react';
import { LessonFooterNav } from '../Layout/LessonFooterNav';
import {
  FormulaPanel,
  KnowledgeCheck,
  LessonHeader,
  ObjectiveBox,
  WorkedExample,
} from '../common/Blocks';
import { SecondLawSimulator } from '../activities/SecondLawSimulator';
import { ScreenId } from '../../physics/calculations';

interface LessonProps {
  isCompleted: boolean;
  onNavigate: (id: ScreenId) => void;
  onCompleteLesson: () => void;
  onActivityUsed: (activityId: string) => void;
}

export const Lesson3SecondLaw: React.FC<LessonProps> = ({
  isCompleted,
  onNavigate,
  onCompleteLesson,
  onActivityUsed,
}) => {
  return (
    <article>
      <LessonHeader
        breadcrumbLabel="Lesson 3"
        title="Newton's Second Law"
        duration="30 min"
        objectiveTag="Objective 4"
        isCompleted={isCompleted}
      />

      <ObjectiveBox objective="Apply Newton's Second Law using F_net = ma." />

      <section className="mt-8 space-y-4 text-sm sm:text-base text-[#334155]">
        <h2 className="text-xl font-semibold text-[#172033]">
          1. Connecting Net Force, Mass, and Acceleration
        </h2>
        <p>
          Newton’s First Law tells us that a nonzero net force changes an object’s velocity—meaning it produces <strong>acceleration</strong>. Newton’s Second Law tells us <em>exactly how much</em> acceleration occurs.
        </p>
        <p>
          Two patterns hold for every object:
        </p>
        <ul className="space-y-1.5 list-disc pl-5">
          <li>
            <strong>Effect of changing net force (mass constant):</strong> Applying a larger net force produces a proportionally larger acceleration. Doubling the net force doubles the acceleration.
          </li>
          <li>
            <strong>Effect of changing mass (net force constant):</strong> A larger mass has greater inertia, so the same net force produces a smaller acceleration. Doubling the mass cuts the acceleration in half.
          </li>
          <li>
            <strong>Direction of acceleration:</strong> Acceleration always points in the <strong>same direction as the net force</strong>. If the net force points to the right, the object accelerates to the right.
          </li>
        </ul>

        <FormulaPanel
          title="Newton's Second Law Equation & Rearranged Form"
          formula="F_net = m × a    and    a = F_net / m"
          variables={[
            { symbol: 'F_net', meaning: 'Net force acting on object', unit: 'newtons (N)' },
            { symbol: 'm', meaning: 'Mass of the object', unit: 'kilograms (kg)' },
            { symbol: 'a', meaning: 'Acceleration produced', unit: 'metres per second² (m/s²)' },
          ]}
          note="Note: 1 newton (1 N) is defined as the net force needed to accelerate a 1 kg mass at 1 m/s²."
        />
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold text-[#172033]">
          2. Worked Examples (Step-by-Step)
        </h2>

        <WorkedExample
          title="Worked Example A: Direct Application of a = F_net / m"
          problem="A 5 kg box experiences a net horizontal force of 20 N to the right. Calculate its acceleration."
          steps={[
            { label: 'Given', content: 'm = 5 kg,  F_net = 20 N to the right' },
            { label: 'Formula', content: 'a = F_net / m' },
            { label: 'Substitution', content: 'a = 20 N / 5 kg' },
          ]}
          answer="a = 4 m/s² to the right"
        />

        <WorkedExample
          title="Worked Example B: Finding Net Force First"
          problem="A 5 kg box is pushed with 15 N to the right while friction acts with 5 N to the left. Find the box’s acceleration."
          steps={[
            {
              label: 'Step 1 (Net force)',
              content: 'F_net = (+15 N) + (-5 N) = +10 N (10 N to the right)',
            },
            { label: 'Step 2 (Formula)', content: 'a = F_net / m' },
            { label: 'Substitution', content: 'a = 10 N / 5 kg' },
          ]}
          answer="a = 2 m/s² to the right"
        />
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-[#172033]">
          3. Interactive Experiment: Force, Mass, and Acceleration
        </h2>
        <p className="mt-1.5 text-sm sm:text-base text-[#475569]">
          Use the simulator below to test what happens when you double the net force or double the mass.
        </p>

        <SecondLawSimulator onInteracted={() => onActivityUsed('second-law-simulator')} />
      </section>

      <KnowledgeCheck
        id="lesson-3-kc"
        title="Lesson 3 Practice Question"
        question="A 6 kg cart experiences a net force of 18 N to the right. Using a = F_net / m, what is the cart’s acceleration?"
        options={[
          {
            id: 'a',
            label: '3 m/s² to the right',
            isCorrect: true,
            feedback:
              'Correct! Substituting into Newton’s Second Law: a = 18 N / 6 kg = 3 m/s², pointing to the right (the same direction as the net force).',
          },
          {
            id: 'b',
            label: '108 m/s² to the right',
            isCorrect: false,
            feedback:
              'Careful: 18 × 6 multiplies force by mass. To find acceleration, divide net force by mass: a = F_net / m = 18 / 6.',
          },
          {
            id: 'c',
            label: '0.33 m/s² to the left',
            isCorrect: false,
            feedback:
              'Two checks: divide F_net by m (18 / 6 = 3), and remember acceleration always points in the direction of the net force (to the right).',
          },
        ]}
        alreadyPassed={isCompleted}
        onPassed={onCompleteLesson}
      />

      <LessonFooterNav
        currentScreen="lesson-3"
        isCompleted={isCompleted}
        onNavigate={onNavigate}
        onMarkComplete={onCompleteLesson}
        completionHint="Complete the Lesson 3 Practice Question above to mark this lesson complete."
      />
    </article>
  );
};
