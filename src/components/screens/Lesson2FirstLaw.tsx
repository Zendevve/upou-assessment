import React from 'react';
import { LessonFooterNav } from '../Layout/LessonFooterNav';
import {
  KnowledgeCheck,
  LessonHeader,
  MisconceptionCallout,
  ObjectiveBox,
} from '../common/Blocks';
import { InertiaScenario } from '../activities/InertiaScenario';
import { ScreenId } from '../../physics/calculations';

interface LessonProps {
  isCompleted: boolean;
  onNavigate: (id: ScreenId) => void;
  onCompleteLesson: () => void;
  onActivityUsed: (activityId: string) => void;
}

export const Lesson2FirstLaw: React.FC<LessonProps> = ({
  isCompleted,
  onNavigate,
  onCompleteLesson,
  onActivityUsed,
}) => {
  return (
    <article>
      <LessonHeader
        breadcrumbLabel="Lesson 2"
        title="Newton's First Law and Inertia"
        duration="20 min"
        objectiveTag="Objectives 2 & 3"
        isCompleted={isCompleted}
      />

      <ObjectiveBox objective="Explain inertia and its relationship with mass, and describe Newton's First Law using familiar real-world situations." />

      <section className="mt-8 space-y-4 text-sm sm:text-base text-[#334155]">
        <h2 className="text-xl font-semibold text-[#172033]">
          1. Newton’s First Law of Motion
        </h2>

        <blockquote className="rounded-md border border-[#CBD5E1] bg-[#F5F7FA] p-5 text-[#172033]">
          <p className="text-xs font-semibold text-[#475569]">Formal Statement</p>
          <p className="mt-1.5 text-base sm:text-lg font-semibold leading-snug">
            “An object remains at rest or continues moving with constant velocity unless acted upon by a nonzero net external force.”
          </p>
        </blockquote>

        <p>
          In everyday terms, objects are “stubborn” about their state of motion—they do not speed up, slow down, or turn on their own. Two situations are covered by Newton’s First Law:
        </p>

        <div className="grid gap-4 sm:grid-cols-2 my-4">
          <div className="rounded-md border border-[#E2E8F0] bg-white p-4">
            <h3 className="text-sm font-semibold text-[#172033]">Objects at Rest</h3>
            <p className="mt-1.5 text-sm text-[#475569]">
              A stationary football sitting on flat grass does not begin rolling by itself. It stays at rest until a foot kicks it or wind exerts a nonzero net external force.
            </p>
          </div>
          <div className="rounded-md border border-[#E2E8F0] bg-white p-4">
            <h3 className="text-sm font-semibold text-[#172033]">Objects in Motion</h3>
            <p className="mt-1.5 text-sm text-[#475569]">
              A puck gliding across very smooth ice continues moving at nearly constant velocity in a straight line because friction is tiny. On rough carpet, friction acts as a nonzero net force that slows it down.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 space-y-4 text-sm sm:text-base text-[#334155]">
        <h2 className="text-xl font-semibold text-[#172033]">
          2. Inertia and Its Relationship with Mass
        </h2>
        <p>
          The natural tendency of any object to resist changes in its velocity is called <strong>inertia</strong>.
        </p>
        <p>
          <strong>Mass</strong> (measured in kilograms, kg) is the physical measure of an object’s inertia. An object with greater mass has greater inertia—meaning it takes a larger net force to change its motion by the same amount. For example, pushing an empty shopping cart into motion or stopping it is easy, whereas a fully loaded shopping cart has much more mass and resists changes in velocity much more strongly.
        </p>

        <MisconceptionCallout
          statement="Inertia is a force that pushes objects forward."
          explanation="Inertia is not a force. It is the tendency of an object to resist changes in its velocity. You will never draw an 'inertia arrow' on a force diagram because no object is exerting an inertia push."
        />
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-[#172033]">
          3. Interactive Scenario: Why Do Passengers Lurch Forward?
        </h2>
        <p className="mt-1.5 text-sm sm:text-base text-[#475569]">
          Examine what happens inside a city bus before and during sudden braking.
        </p>

        <InertiaScenario onCompleted={() => onActivityUsed('inertia-bus-scenario')} />
      </section>

      <KnowledgeCheck
        id="lesson-2-kc"
        title="Lesson 2 Knowledge Check"
        question="A bowling ball (7 kg) and a tennis ball (0.06 kg) sit side by side at rest on a flat floor. Which statement about their inertia is correct?"
        options={[
          {
            id: 'a',
            label: 'The tennis ball has more inertia because it is easier to throw fast.',
            isCorrect: false,
            feedback:
              'Being easy to accelerate means LESS resistance to changes in velocity, so the tennis ball has much less inertia.',
          },
          {
            id: 'b',
            label: 'The bowling ball has greater inertia because it has greater mass.',
            isCorrect: true,
            feedback:
              'Correct! Mass is a direct measure of inertia. Because 7 kg is much larger than 0.06 kg, the bowling ball resists changes in velocity far more strongly.',
          },
          {
            id: 'c',
            label: 'Neither ball has inertia while sitting at rest.',
            isCorrect: false,
            feedback:
              'All objects with mass always have inertia, whether at rest or in motion—the bowling ball’s inertia is why it takes effort to start it rolling.',
          },
        ]}
        alreadyPassed={isCompleted}
        onPassed={onCompleteLesson}
      />

      <LessonFooterNav
        currentScreen="lesson-2"
        isCompleted={isCompleted}
        onNavigate={onNavigate}
        onMarkComplete={onCompleteLesson}
        completionHint="Complete the Lesson 2 Knowledge Check above to mark this lesson complete."
      />
    </article>
  );
};
