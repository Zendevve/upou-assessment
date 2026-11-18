import React from 'react';
import { LessonFooterNav } from '../Layout/LessonFooterNav';
import {
  KnowledgeCheck,
  LessonHeader,
  MisconceptionCallout,
  ObjectiveBox,
} from '../common/Blocks';
import { ActionReactionActivity } from '../activities/ActionReactionActivity';
import { ScreenId } from '../../physics/calculations';

interface LessonProps {
  isCompleted: boolean;
  onNavigate: (id: ScreenId) => void;
  onCompleteLesson: () => void;
  onActivityUsed: (activityId: string) => void;
}

export const Lesson4ThirdLaw: React.FC<LessonProps> = ({
  isCompleted,
  onNavigate,
  onCompleteLesson,
  onActivityUsed,
}) => {
  return (
    <article>
      <LessonHeader
        breadcrumbLabel="Lesson 4"
        title="Newton's Third Law"
        duration="25 min"
        objectiveTag="Objective 5"
        isCompleted={isCompleted}
      />

      <ObjectiveBox objective="Explain Newton's Third Law by identifying interacting objects and their force pairs." />

      <section className="mt-8 space-y-4 text-sm sm:text-base text-[#334155]">
        <h2 className="text-xl font-semibold text-[#172033]">
          1. Forces Always Come in Pairs
        </h2>

        <blockquote className="rounded-md border border-[#CBD5E1] bg-[#F5F7FA] p-5 text-[#172033]">
          <p className="text-xs font-semibold text-[#475569]">Formal Statement</p>
          <p className="mt-1.5 text-base sm:text-lg font-semibold leading-snug">
            “When object A exerts a force on object B, object B exerts an equal-magnitude force in the opposite direction on object A.”
          </p>
        </blockquote>

        <p>
          Because a force is an <em>interaction</em> between two objects, a single isolated force never exists on its own. Every action–reaction pair shares three strict rules:
        </p>

        <ul className="space-y-1.5 list-disc pl-5">
          <li>
            <strong>Equal magnitude:</strong> Both forces have the exact same strength in newtons, even if one object is huge (like Earth or a wall) and the other is small (like a person).
          </li>
          <li>
            <strong>Opposite direction:</strong> If object A pushes left, object B pushes right.
          </li>
          <li>
            <strong>Different objects:</strong> Force 1 acts <em>on object B</em>, while Force 2 acts <em>on object A</em>. They occur at the exact same instant.
          </li>
        </ul>
      </section>

      <section className="mt-8 space-y-4 text-sm sm:text-base text-[#334155]">
        <h2 className="text-xl font-semibold text-[#172033]">
          2. Everyday Examples of Force Pairs
        </h2>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <h3 className="text-sm font-semibold text-[#172033]">Walking</h3>
            <p className="mt-1.5 text-sm text-[#475569]">
              Your shoe pushes backward against the ground, and the ground pushes forward on your shoe with equal force.
            </p>
          </div>
          <div className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <h3 className="text-sm font-semibold text-[#172033]">Jumping</h3>
            <p className="mt-1.5 text-sm text-[#475569]">
              Your feet push downward on the floor, and the floor pushes upward on your body with equal force to lift you.
            </p>
          </div>
          <div className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <h3 className="text-sm font-semibold text-[#172033]">Pushing a Wall</h3>
            <p className="mt-1.5 text-sm text-[#475569]">
              Your hands push forward on the wall, and the wall pushes backward on your hands with equal magnitude.
            </p>
          </div>
        </div>

        <MisconceptionCallout
          statement="If action and reaction forces are equal and opposite, shouldn't they cancel to zero?"
          explanation="Action and reaction forces do not cancel because they act on different objects. Forces only cancel when two or more forces act on the SAME object."
        />
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-[#172033]">
          3. Interactive Activity: Identify Action–Reaction Pairs
        </h2>
        <p className="mt-1.5 text-sm sm:text-base text-[#475569]">
          Examine each of the three real-world situations and identify the interacting objects and force directions.
        </p>

        <ActionReactionActivity
          onAllScenariosCompleted={() => onActivityUsed('action-reaction-identifier')}
        />
      </section>

      <KnowledgeCheck
        id="lesson-4-kc"
        title="Lesson 4 Knowledge Check"
        question="When a swimmer pushes water backward with their hands, the water pushes the swimmer forward. Why do these two forces not cancel each other out?"
        options={[
          {
            id: 'a',
            label: 'Because the swimmer pushes harder than the water pushes back.',
            isCorrect: false,
            feedback:
              'By Newton’s Third Law, the two forces always have equal magnitude—the swimmer’s push on the water equals the water’s push on the swimmer.',
          },
          {
            id: 'b',
            label: 'Because one force acts on the water and the other acts on the swimmer (different objects).',
            isCorrect: true,
            feedback:
              'Correct! Only forces acting on the same object can cancel out. Here, the backward push acts on the water while the forward reaction acts on the swimmer.',
          },
          {
            id: 'c',
            label: 'Because water is a liquid and cannot exert forces.',
            isCorrect: false,
            feedback:
              'Liquids definitely exert forces—that forward push from the water is what accelerates the swimmer across the pool.',
          },
        ]}
        alreadyPassed={isCompleted}
        onPassed={onCompleteLesson}
      />

      <LessonFooterNav
        currentScreen="lesson-4"
        isCompleted={isCompleted}
        onNavigate={onNavigate}
        onMarkComplete={onCompleteLesson}
        completionHint="Complete the Lesson 4 Knowledge Check above to mark this lesson complete."
      />
    </article>
  );
};
