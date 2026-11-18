import React from 'react';
import { LessonFooterNav } from '../Layout/LessonFooterNav';
import {
  KeyConceptGrid,
  KnowledgeCheck,
  LessonHeader,
  LessonIntro,
  LessonSummary,
  MisconceptionCallout,
} from '../common/Blocks';
import { LessonAssessment } from '../common/LessonAssessment';
import { ForceComparisonDiagrams } from '../diagrams/ForceComparisonDiagrams';
import { NetForceCalculator } from '../activities/NetForceCalculator';
import {
  LESSON_INTROS,
  LESSON_SUMMARIES,
  OPTIONAL_CHECKPOINTS,
} from '../../data/moduleContent';
import { AssessmentResultSummary, ScreenId } from '../../physics/calculations';
import { LessonProgressRecord } from '../../physics/progress';

interface LessonProps {
  lessonRecord: LessonProgressRecord;
  isNextLocked: boolean;
  onNavigate: (id: ScreenId) => void;
  onActivityCompleted: (activityId: string) => void;
  onAssessmentSubmitted: (result: AssessmentResultSummary) => void;
  onLockedNextAttempt: () => void;
  onOpenReference: () => void;
}

export const Lesson1Forces: React.FC<LessonProps> = ({
  lessonRecord,
  isNextLocked,
  onNavigate,
  onActivityCompleted,
  onAssessmentSubmitted,
  onLockedNextAttempt,
  onOpenReference,
}) => {
  const checkpoint = OPTIONAL_CHECKPOINTS['lesson-1-checkpoint'];

  return (
    <article>
      <LessonHeader
        breadcrumbLabel="Lesson 1"
        title="Understanding Forces"
        duration="20 min"
        objectiveTag="Objective 1"
        isCompleted={lessonRecord.completed}
      />

      <LessonIntro intro={LESSON_INTROS['lesson-1']} />

      <section
        id="l1-what-is-force"
        data-section-id="l1-what-is-force"
        data-section-label="1. What Is a Force?"
        className="mt-8 space-y-4 text-sm sm:text-base text-[#334155]"
      >
        <h2 className="text-xl font-semibold text-[#172033]">1. What Is a Force?</h2>
        <p>
          Whenever you push a shopping cart, pull open a door, or kick a football, you are applying a <strong>force</strong>. In physics, a force is an <strong>interaction</strong> (a push or a pull) between two objects that can change an object’s motion.
        </p>
        <p>
          Because a push or pull always has both a <em>strength</em> and a <em>direction</em>, force is a <strong>vector quantity</strong>. Saying “I pushed with 15 newtons” is incomplete until you also state which way you pushed (for example, 15 newtons to the right).
        </p>

        <KeyConceptGrid
          items={[
            {
              term: 'SI Unit: Newton (N)',
              definition:
                'Force is measured in newtons (symbol: N), named after Sir Isaac Newton. Lifting a small apple requires roughly 1 N of upward force.',
            },
            {
              term: 'Vector Quantity',
              definition:
                'A quantity described by both magnitude (size) and direction. We represent forces visually using arrows whose length shows size and arrowhead shows direction.',
            },
            {
              term: 'Velocity',
              definition:
                'How fast an object moves and in what direction. A change in speed OR a change in direction counts as a change in velocity.',
            },
            {
              term: 'Net Force (F_net)',
              definition:
                'The overall combined effect (vector sum) of all forces acting on a single object at the same time.',
            },
          ]}
        />
      </section>

      <section
        id="l1-combining-forces"
        data-section-id="l1-combining-forces"
        data-section-label="2. Combining Forces"
        className="mt-8 space-y-4 text-sm sm:text-base text-[#334155]"
      >
        <h2 className="text-xl font-semibold text-[#172033]">
          2. Combining Forces: Balanced vs. Unbalanced
        </h2>
        <p>
          In everyday life, more than one force usually acts on an object at once. To find the horizontal <strong>net force</strong> on an object, assign one direction as positive (<span className="font-mono">+</span>, typically right) and the opposite direction as negative (<span className="font-mono">-</span>, typically left), then add the signed values together.
        </p>
        <ul className="space-y-2 list-disc pl-5">
          <li>
            <strong>Balanced forces (F_net = 0 N):</strong> Opposing forces are equal in size and opposite in direction, so their vector sum is zero. Notice that “balanced forces” does <em>not</em> mean zero forces exist—it means the existing forces cancel each other out.
          </li>
          <li>
            <strong>Unbalanced forces (F_net ≠ 0 N):</strong> One direction has a greater total force than the opposite direction, leaving a nonzero net force that changes the object’s velocity.
          </li>
        </ul>

        <ForceComparisonDiagrams />

        <MisconceptionCallout
          title="Key Scientific Distinction"
          statement="An object with zero net force must be standing still."
          explanation="Not necessarily! An object experiencing zero net force (balanced forces) has constant velocity—so if it is at rest, it stays at rest, and if it is already moving at 10 m/s in a straight line, it keeps moving at 10 m/s."
        />

        <KnowledgeCheck
          id={checkpoint.id}
          title={checkpoint.title}
          type={checkpoint.type}
          question={checkpoint.question}
          options={checkpoint.options}
          isOptionalPractice
        />
      </section>

      <section
        id="l1-practice"
        data-section-id="l1-practice"
        data-section-label="3. Net Force Practice"
        className="mt-8"
      >
        <h2 className="text-xl font-semibold text-[#172033]">
          3. Practice: Build and Combine Horizontal Forces
        </h2>
        <p className="mt-1.5 text-sm sm:text-base text-[#475569]">
          Experiment with the Net Force Calculator below. Try creating a balanced pair, a net force to the right, and a net force to the left.
        </p>

        <NetForceCalculator
          isCompleted={Boolean(lessonRecord.activities['net-force-calculator'])}
          onCompleted={() => onActivityCompleted('net-force-calculator')}
        />
      </section>

      <KnowledgeCheck
        id="lesson-1-kc"
        title="Lesson 1 Knowledge Check"
        question="A heavy crate sits on a smooth floor. One student pushes with 12 N to the right while another pushes with 12 N to the left. What is the net force on the crate, and are the forces balanced?"
        options={[
          {
            id: 'a',
            label: 'Net force is 24 N to the right; the forces are unbalanced.',
            isCorrect: false,
            feedback:
              'When two forces act in opposite directions, they oppose each other rather than adding together in the same direction. Assign +12 N right and -12 N left.',
          },
          {
            id: 'b',
            label: 'Net force is 0 N; the forces are balanced.',
            isCorrect: true,
            feedback:
              'Correct! Using right as positive: F_net = (+12 N) + (-12 N) = 0 N. Equal opposing forces acting on the same object are balanced.',
          },
          {
            id: 'c',
            label: 'Net force is 12 N; only the rightward push counts.',
            isCorrect: false,
            feedback:
              'Both forces act on the crate, so both must be included when calculating the net force.',
          },
        ]}
        alreadyPassed={Boolean(lessonRecord.activities['lesson-1-kc'])}
        onPassed={() => onActivityCompleted('lesson-1-kc')}
      />

      <LessonSummary
        lessonLabel="Lesson 1"
        summary={LESSON_SUMMARIES['lesson-1']}
        onOpenReference={onOpenReference}
      />

      <section
        id="l1-assessment"
        data-section-id="l1-assessment"
        data-section-label="Lesson 1 Mastery Assessment"
      >
        <LessonAssessment
          lessonId="lesson-1"
          lessonRecord={lessonRecord}
          onSubmitAssessment={onAssessmentSubmitted}
          onNavigate={onNavigate}
        />
      </section>

      <LessonFooterNav
        currentScreen="lesson-1"
        isCompleted={lessonRecord.completed}
        isNextLocked={isNextLocked}
        onNavigate={onNavigate}
        onLockedNextAttempt={onLockedNextAttempt}
        completionHint="Complete both Lesson 1 interactive tasks and score at least 70% on the Lesson 1 Assessment above to unlock Lesson 2."
      />
    </article>
  );
};
