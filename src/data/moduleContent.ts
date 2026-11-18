import { AssessmentQuestionSpec, ScreenId } from '../physics/calculations';

export interface LessonNavItem {
  id: ScreenId;
  shortLabel: string;
  title: string;
  duration: string;
  objectiveTag: string;
}

export const COURSE_INFO = {
  courseTitle: 'Physics in Everyday Life: Forces and Motion',
  moduleLabel: 'Module 1',
  moduleTitle: "Understanding Forces and Newton's Laws",
  estimatedTime: 'Approximately 2 hours',
  totalCourseTime: 'Approximately 6 hours across 3 modules',
  targetAudience: 'Secondary-level students (introductory mathematics)',
  welcomeIntro:
    'Everyday life is full of motion. A bus accelerates, a ball falls, a person walks, and a cart moves when pushed. But what causes these changes? In this module, you will explore forces and discover how Isaac Newton’s three laws help explain the movement of objects around us.',
};

export const MODULE_OBJECTIVES = [
  {
    number: 1,
    text: 'Define force and distinguish between balanced and unbalanced forces.',
    lessonId: 'lesson-1' as ScreenId,
  },
  {
    number: 2,
    text: 'Explain inertia and its relationship with mass.',
    lessonId: 'lesson-2' as ScreenId,
  },
  {
    number: 3,
    text: "Describe Newton's First Law using familiar real-world situations.",
    lessonId: 'lesson-2' as ScreenId,
  },
  {
    number: 4,
    text: "Apply Newton's Second Law using F_net = ma.",
    lessonId: 'lesson-3' as ScreenId,
  },
  {
    number: 5,
    text: "Explain Newton's Third Law by identifying interacting objects and their force pairs.",
    lessonId: 'lesson-4' as ScreenId,
  },
  {
    number: 6,
    text: "Interpret simple force-and-motion situations using Newton's laws.",
    lessonId: 'lesson-5' as ScreenId,
  },
];

export const LESSON_NAV_ITEMS: LessonNavItem[] = [
  {
    id: 'welcome',
    shortLabel: 'Orientation',
    title: 'Welcome and Orientation',
    duration: '10 min',
    objectiveTag: 'Module Overview',
  },
  {
    id: 'lesson-1',
    shortLabel: 'Lesson 1',
    title: 'Understanding Forces',
    duration: '20 min',
    objectiveTag: 'Objective 1',
  },
  {
    id: 'lesson-2',
    shortLabel: 'Lesson 2',
    title: "Newton's First Law and Inertia",
    duration: '20 min',
    objectiveTag: 'Objectives 2 & 3',
  },
  {
    id: 'lesson-3',
    shortLabel: 'Lesson 3',
    title: "Newton's Second Law",
    duration: '30 min',
    objectiveTag: 'Objective 4',
  },
  {
    id: 'lesson-4',
    shortLabel: 'Lesson 4',
    title: "Newton's Third Law",
    duration: '25 min',
    objectiveTag: 'Objective 5',
  },
  {
    id: 'lesson-5',
    shortLabel: 'Lesson 5',
    title: 'Putting the Laws Together',
    duration: '15 min',
    objectiveTag: 'Objective 6',
  },
  {
    id: 'assessment',
    shortLabel: 'Assessment',
    title: 'Final Module Assessment',
    duration: '20 min',
    objectiveTag: 'Objectives 1–6',
  },
];

export interface ThirdLawScenario {
  id: string;
  title: string;
  context: string;
  diagramType: 'walking' | 'jumping' | 'wall';
  objectAOptions: string[];
  correctObjectA: string;
  objectBOptions: string[];
  correctObjectB: string;
  reactionDirectionOptions: Array<{ id: string; label: string }>;
  correctReactionDirectionId: string;
  nonCancelReasonOptions: Array<{ id: string; label: string }>;
  correctNonCancelReasonId: string;
  explanation: string;
}

export const THIRD_LAW_SCENARIOS: ThirdLawScenario[] = [
  {
    id: 'walking',
    title: 'Scenario 1: Walking Forward',
    context: 'As you take a step forward on a paved sidewalk, your shoe pushes backward against the ground.',
    diagramType: 'walking',
    objectAOptions: ['Your foot / shoe', 'The sidewalk / ground', 'Air resistance'],
    correctObjectA: 'Your foot / shoe',
    objectBOptions: ['The sidewalk / ground', 'Your foot / shoe', 'Your backpack'],
    correctObjectB: 'The sidewalk / ground',
    reactionDirectionOptions: [
      { id: 'forward', label: 'Forward on your foot' },
      { id: 'backward', label: 'Backward on your foot' },
      { id: 'downward', label: 'Downward on the ground' },
    ],
    correctReactionDirectionId: 'forward',
    nonCancelReasonOptions: [
      { id: 'different-objects', label: 'They act on different objects (one on the ground, one on your foot).' },
      { id: 'different-sizes', label: 'The ground pushes harder than your foot does.' },
      { id: 'delay', label: 'The reaction happens a few seconds after the push.' },
    ],
    correctNonCancelReasonId: 'different-objects',
    explanation:
      'Your foot exerts a backward force on the ground, and simultaneously the ground exerts an equal-magnitude forward force on your foot. Because one force acts on the ground and the other acts on you, they do not cancel each other—the forward force from the ground propels you forward.',
  },
  {
    id: 'jumping',
    title: 'Scenario 2: Jumping Upward',
    context: 'To jump up from a basketball court, a student bends their knees and pushes downward on the floor with their feet.',
    diagramType: 'jumping',
    objectAOptions: ["The student's feet", 'The court floor', 'Earth’s atmosphere'],
    correctObjectA: "The student's feet",
    objectBOptions: ['The court floor', "The student's feet", 'A nearby wall'],
    correctObjectB: 'The court floor',
    reactionDirectionOptions: [
      { id: 'upward', label: "Upward on the student's feet" },
      { id: 'downward', label: "Downward on the student's feet" },
      { id: 'sideways', label: 'Sideways along the floor' },
    ],
    correctReactionDirectionId: 'upward',
    nonCancelReasonOptions: [
      { id: 'different-objects', label: 'One force acts on the floor and the other acts on the student.' },
      { id: 'no-gravity', label: 'Gravity turns off while the student is jumping.' },
      { id: 'larger-upward', label: 'The floor pushes with more force than the student pushes down.' },
    ],
    correctNonCancelReasonId: 'different-objects',
    explanation:
      "The student's feet exert a downward force on the floor, and the floor exerts an equal-magnitude upward force on the student. Because these two forces act on different objects (the floor vs. the student), they never cancel.",
  },
  {
    id: 'wall',
    title: 'Scenario 3: Pushing a Wall on Roller Skates',
    context: 'A student wearing roller skates stands facing a sturdy concrete wall and pushes forward against the wall with their hands.',
    diagramType: 'wall',
    objectAOptions: ["The student's hands", 'The concrete wall', 'The floor wheels'],
    correctObjectA: "The student's hands",
    objectBOptions: ['The concrete wall', "The student's hands", 'The ceiling'],
    correctObjectB: 'The concrete wall',
    reactionDirectionOptions: [
      { id: 'backward', label: 'Backward on the student (away from the wall)' },
      { id: 'forward', label: 'Forward into the wall' },
      { id: 'upward', label: 'Upward toward the ceiling' },
    ],
    correctReactionDirectionId: 'backward',
    nonCancelReasonOptions: [
      { id: 'different-objects', label: 'One force acts on the wall and the reaction acts on the student.' },
      { id: 'wall-moves', label: 'The wall has zero mass so forces cannot cancel.' },
      { id: 'unequal', label: 'The wall pushes back with twice as much force.' },
    ],
    correctNonCancelReasonId: 'different-objects',
    explanation:
      "The student pushes forward on the wall, and the wall exerts an equal-magnitude backward force on the student's hands. Since the backward force acts on the student (who is on skates), the student rolls backward.",
  },
];

export const FINAL_ASSESSMENT_QUESTIONS: AssessmentQuestionSpec[] = [
  {
    id: 'q1',
    number: 1,
    type: 'multiple-choice',
    objectiveNumber: 1,
    lessonReferenceId: 'lesson-1',
    prompt: 'What is a force?',
    options: [
      {
        id: 'a',
        label: 'A push or pull resulting from an interaction between two objects.',
        feedback: 'Correct. A force is an interaction (push or pull) with both magnitude and direction that can change an object’s motion.',
      },
      {
        id: 'b',
        label: 'The total amount of matter contained inside an object.',
        feedback: 'Incorrect. The amount of matter (or measure of inertia) is mass, measured in kilograms, not force.',
      },
      {
        id: 'c',
        label: 'A property inside an object that keeps it moving forever without interactions.',
        feedback: 'Incorrect. That describes inertia, which is a property of matter—not a force.',
      },
      {
        id: 'd',
        label: 'The distance an object travels per unit of time.',
        feedback: 'Incorrect. Distance traveled per unit of time describes speed, not force.',
      },
    ],
    correctChoiceId: 'a',
    modelAnswer: 'A push or pull resulting from an interaction between two objects.',
    correctExplanation: 'A force is a push or pull resulting from an interaction between objects, measured in newtons (N).',
    incorrectExplanation: 'A force is specifically a push or pull resulting from an interaction between objects (not mass, speed, or inertia).',
  },
  {
    id: 'q2',
    number: 2,
    type: 'numerical',
    objectiveNumber: 1,
    lessonReferenceId: 'lesson-1',
    prompt: 'A box experiences 12 N to the right and 12 N to the left. What is the magnitude of the net force acting on the box?',
    helperText: 'Enter a number in newtons (N).',
    correctNumericValue: 0,
    numericTolerance: 0.01,
    numericUnit: 'N',
    modelAnswer: '0 N',
    correctExplanation: 'Correct. Taking right as positive: F_net = (+12 N) + (-12 N) = 0 N. The forces are balanced.',
    incorrectExplanation: 'Because the 12 N forces act in opposite directions, assign right as +12 N and left as -12 N. Adding them gives F_net = 12 N - 12 N = 0 N.',
  },
  {
    id: 'q3',
    number: 3,
    type: 'multiple-choice',
    objectiveNumber: 2,
    lessonReferenceId: 'lesson-2',
    prompt: "Which term describes an object's tendency to resist changes in its velocity?",
    options: [
      {
        id: 'a',
        label: 'Acceleration',
        feedback: 'Incorrect. Acceleration is the rate at which velocity changes, not the resistance to change.',
      },
      {
        id: 'b',
        label: 'Inertia',
        feedback: 'Correct. Inertia is the tendency of an object to resist changes in its velocity, and mass is a measure of inertia.',
      },
      {
        id: 'c',
        label: 'Net force',
        feedback: 'Incorrect. Net force is the combined vector sum of all forces acting on an object.',
      },
      {
        id: 'd',
        label: 'Friction',
        feedback: 'Incorrect. Friction is a contact force that opposes relative sliding motion between surfaces.',
      },
    ],
    correctChoiceId: 'b',
    modelAnswer: 'Inertia',
    correctExplanation: 'Inertia is the natural tendency of any object with mass to resist changes in its state of rest or constant-velocity motion.',
    incorrectExplanation: 'Inertia is the correct term for an object’s tendency to resist changes in velocity. Note that inertia is a property of matter, not a force.',
  },
  {
    id: 'q4',
    number: 4,
    type: 'true-false-reason',
    objectiveNumber: 3,
    lessonReferenceId: 'lesson-2',
    prompt:
      'Evaluate this statement: "According to Newton’s First Law, an object moving at constant velocity must have a continuous nonzero net force pushing it forward." Choose whether it is True or False and why.',
    options: [
      {
        id: 'a',
        label: 'True — without a nonzero forward net force, every moving object immediately stops.',
        feedback: 'Incorrect. Everyday objects slow down because friction acts as an external net force, not because motion requires a net force.',
      },
      {
        id: 'b',
        label: 'True — constant velocity requires constant acceleration.',
        feedback: 'Incorrect. Constant velocity means zero acceleration, which corresponds to zero net force.',
      },
      {
        id: 'c',
        label: 'False — an object remains at rest or continues moving with constant velocity unless acted upon by a nonzero net external force.',
        feedback: 'Correct. Newton’s First Law states that zero net force keeps velocity constant—whether at rest or already moving.',
      },
      {
        id: 'd',
        label: 'False — an object only keeps moving if no forces exist anywhere on it.',
        feedback: 'Incorrect. Multiple forces can still act on the object as long as they are balanced (vector sum equals 0 N).',
      },
    ],
    correctChoiceId: 'c',
    modelAnswer:
      'False — an object remains at rest or continues moving with constant velocity unless acted upon by a nonzero net external force.',
    correctExplanation:
      'Newton’s First Law tells us that a nonzero net external force is needed to change velocity, not to maintain constant velocity.',
    incorrectExplanation:
      'The statement is False. By Newton’s First Law, an object continues moving with constant velocity when the net external force is zero (balanced forces).',
  },
  {
    id: 'q5',
    number: 5,
    type: 'numerical',
    objectiveNumber: 4,
    lessonReferenceId: 'lesson-3',
    prompt: 'A 4 kg object experiences a net force of 12 N. Calculate the magnitude of its acceleration.',
    helperText: 'Use a = F_net / m and enter a number in m/s².',
    correctNumericValue: 3,
    numericTolerance: 0.05,
    numericUnit: 'm/s²',
    modelAnswer: '3 m/s²',
    correctExplanation: 'Correct. Using Newton’s Second Law: a = F_net / m = 12 N / 4 kg = 3 m/s².',
    incorrectExplanation: 'Use the rearranged formula a = F_net / m. Dividing 12 N by 4 kg gives 3 m/s² (not 12 × 4).',
  },
  {
    id: 'q6',
    number: 6,
    type: 'multiple-choice',
    objectiveNumber: 4,
    lessonReferenceId: 'lesson-3',
    prompt: 'If the net force acting on an object doubles while its mass remains constant, what happens to its acceleration?',
    options: [
      {
        id: 'a',
        label: 'It doubles.',
        feedback: 'Correct. Because a = F_net / m, acceleration is directly proportional to net force when mass is constant.',
      },
      {
        id: 'b',
        label: 'It becomes half as large.',
        feedback: 'Incorrect. Acceleration halves when mass doubles (with constant force), not when force doubles.',
      },
      {
        id: 'c',
        label: 'It stays the same.',
        feedback: 'Incorrect. Changing the net force on a fixed mass changes its acceleration proportionally.',
      },
      {
        id: 'd',
        label: 'It becomes four times as large.',
        feedback: 'Incorrect. Acceleration increases linearly with net force (2 × F_net produces 2 × a), not as the square.',
      },
    ],
    correctChoiceId: 'a',
    modelAnswer: 'It doubles.',
    correctExplanation: 'Since a = F_net / m, doubling F_net while holding m constant multiplies the acceleration by 2.',
    incorrectExplanation: 'Acceleration is directly proportional to net force (a = F_net / m), so doubling the net force doubles the acceleration.',
  },
  {
    id: 'q7',
    number: 7,
    type: 'multiple-choice',
    objectiveNumber: 4,
    lessonReferenceId: 'lesson-3',
    prompt: 'If an object’s mass doubles while the net force acting on it remains constant, what happens to its acceleration?',
    options: [
      {
        id: 'a',
        label: 'It doubles.',
        feedback: 'Incorrect. A heavier object has more inertia and is harder to accelerate with the same force.',
      },
      {
        id: 'b',
        label: 'It becomes half as large.',
        feedback: 'Correct. Because a = F_net / m, acceleration is inversely proportional to mass when net force is constant.',
      },
      {
        id: 'c',
        label: 'It becomes zero.',
        feedback: 'Incorrect. A larger mass reduces acceleration, but as long as net force is nonzero, acceleration is nonzero.',
      },
      {
        id: 'd',
        label: 'It stays the same.',
        feedback: 'Incorrect. Doubling the denominator m in a = F_net / m changes the acceleration.',
      },
    ],
    correctChoiceId: 'b',
    modelAnswer: 'It becomes half as large.',
    correctExplanation: 'Because mass is in the denominator of a = F_net / m, doubling mass with constant net force divides acceleration by 2.',
    incorrectExplanation: 'Acceleration is inversely proportional to mass (a = F_net / m). Doubling the mass halves the acceleration.',
  },
  {
    id: 'q8',
    number: 8,
    type: 'multiple-choice',
    objectiveNumber: 5,
    lessonReferenceId: 'lesson-4',
    prompt: 'A person pushes horizontally against a wall with a force of 40 N. According to Newton’s Third Law, what happens?',
    options: [
      {
        id: 'a',
        label: 'The wall exerts a 40 N force in the opposite direction on the person.',
        feedback: 'Correct. Forces always come in equal-magnitude, opposite-direction pairs acting on the two interacting objects.',
      },
      {
        id: 'b',
        label: 'The wall exerts a smaller force back because it does not move.',
        feedback: 'Incorrect. Even when a rigid wall stays still, the interaction pair always has equal magnitude (40 N).',
      },
      {
        id: 'c',
        label: 'The wall exerts no force unless it begins sliding.',
        feedback: 'Incorrect. The wall pushes back on the person’s hands the entire time they are pushing.',
      },
      {
        id: 'd',
        label: 'The wall exerts a 40 N force in the same direction on the wall itself.',
        feedback: 'Incorrect. The reaction force acts in the opposite direction and acts on the person, not on the wall.',
      },
    ],
    correctChoiceId: 'a',
    modelAnswer: 'The wall exerts an equal-magnitude force (40 N) in the opposite direction on the person.',
    correctExplanation: 'By Newton’s Third Law, when the person exerts 40 N on the wall, the wall simultaneously exerts 40 N in the opposite direction on the person.',
    incorrectExplanation: 'Newton’s Third Law states that object B (the wall) exerts an equal-magnitude force in the opposite direction on object A (the person).',
  },
  {
    id: 'q9',
    number: 9,
    type: 'short-answer',
    objectiveNumber: 5,
    lessonReferenceId: 'lesson-4',
    prompt: 'In your own words (1–2 sentences), why do action and reaction forces NOT cancel each other out?',
    helperText: 'Mention which objects the two forces act on.',
    requiredConceptKeywords: [
      ['different', 'separate', 'two', 'each other', 'distinct', 'opposite object', 'other object'],
      ['object', 'objects', 'body', 'bodies', 'thing', 'things'],
    ],
    modelAnswer: 'Action and reaction forces do not cancel because they act on different objects.',
    correctExplanation:
      'Correct! Forces can only cancel out when they act on the same object. An action-reaction pair always acts on two different interacting objects.',
    incorrectExplanation:
      'Remember the key rule from Lesson 4: action and reaction forces do not cancel because they act on different objects (only forces acting on the same object combine to give net force).',
  },
  {
    id: 'q10',
    number: 10,
    type: 'numerical-direction',
    objectiveNumber: 6,
    lessonReferenceId: 'lesson-5',
    prompt:
      'A student pushes a 5 kg box with 15 N to the right across a floor while friction acts with 5 N to the left. Calculate the acceleration and select its direction.',
    helperText: 'Step 1: Find horizontal F_net. Step 2: Calculate a = F_net / m.',
    correctNumericValue: 2,
    numericTolerance: 0.05,
    numericUnit: 'm/s²',
    correctDirection: 'right',
    modelAnswer: '2 m/s² to the right',
    correctExplanation:
      'Correct! Horizontal F_net = 15 N right − 5 N left = 10 N to the right. Then a = 10 N / 5 kg = 2 m/s² to the right.',
    incorrectExplanation:
      'First combine the opposing horizontal forces: F_net = 15 N − 5 N = 10 N to the right. Then divide by mass: a = 10 N / 5 kg = 2 m/s² to the right.',
  },
];

export const LESSON_ASSESSMENTS: Record<
  'lesson-1' | 'lesson-2' | 'lesson-3' | 'lesson-4' | 'lesson-5',
  {
    title: string;
    description: string;
    questions: AssessmentQuestionSpec[];
  }
> = {
  'lesson-1': {
    title: 'Lesson 1 Mastery Assessment',
    description: 'Score at least 70% (3 of 4) and finish both Lesson 1 activities to unlock Lesson 2.',
    questions: [
      {
        id: 'l1-q1',
        number: 1,
        type: 'multiple-choice',
        objectiveNumber: 1,
        lessonReferenceId: 'lesson-1',
        prompt: 'Why is force classified as a vector quantity?',
        options: [
          {
            id: 'a',
            label: 'Because it is completely described by a single number without direction.',
            feedback: 'Incorrect. Quantities with magnitude only (like mass or time) are scalars, not vectors.',
          },
          {
            id: 'b',
            label: 'Because it has both magnitude (strength in newtons) and direction.',
            feedback: 'Correct! A force always has both size and direction, which we represent using arrows.',
          },
          {
            id: 'c',
            label: 'Because it only acts on stationary objects.',
            feedback: 'Incorrect. Forces can act on both stationary and moving objects.',
          },
        ],
        correctChoiceId: 'b',
        modelAnswer: 'Because it has both magnitude (strength in newtons) and direction.',
        correctExplanation: 'Forces are vectors because both strength and direction determine the resulting effect.',
        incorrectExplanation: 'A vector quantity requires both magnitude and direction.',
      },
      {
        id: 'l1-q2',
        number: 2,
        type: 'numerical',
        objectiveNumber: 1,
        lessonReferenceId: 'lesson-1',
        prompt: 'Two students pull a sled horizontally: 18 N to the right and 7 N to the left. What is the magnitude of the net force?',
        helperText: 'Enter a number in newtons (N).',
        correctNumericValue: 11,
        numericTolerance: 0.05,
        numericUnit: 'N',
        modelAnswer: '11 N',
        correctExplanation: 'Correct! (+18 N) + (-7 N) = +11 N, so the net force magnitude is 11 N to the right.',
        incorrectExplanation: 'Because the forces act in opposite directions, subtract the smaller from the larger: 18 N − 7 N = 11 N.',
      },
      {
        id: 'l1-q3',
        number: 3,
        type: 'true-false-reason',
        objectiveNumber: 1,
        lessonReferenceId: 'lesson-1',
        prompt: 'Evaluate: "If balanced forces act on a hockey puck, no forces can be acting on it at all."',
        options: [
          {
            id: 'a',
            label: 'True — balanced forces only happen when zero forces exist.',
            feedback: 'Incorrect. Balanced forces mean existing forces cancel out to a vector sum of 0 N.',
          },
          {
            id: 'b',
            label: 'False — forces can act on the puck as long as opposing forces cancel to F_net = 0 N.',
            feedback: 'Correct! Multiple forces can act simultaneously and still be balanced if their net sum is 0 N.',
          },
          {
            id: 'c',
            label: 'True — any two forces on the same object always add up to a larger force.',
            feedback: 'Incorrect. Forces pointing in opposite directions oppose and can cancel each other.',
          },
        ],
        correctChoiceId: 'b',
        modelAnswer: 'False — forces can act on the puck as long as opposing forces cancel to F_net = 0 N.',
        correctExplanation: 'Balanced forces exist whenever individual forces combine to a net force of 0 N.',
        incorrectExplanation: 'Balanced forces do not mean zero forces exist; they mean the vector sum equals 0 N.',
      },
      {
        id: 'l1-q4',
        number: 4,
        type: 'multiple-choice',
        objectiveNumber: 1,
        lessonReferenceId: 'lesson-1',
        prompt: 'A cart already glides at 6 m/s in a straight line when all horizontal forces on it balance (F_net = 0 N). What happens next?',
        options: [
          {
            id: 'a',
            label: 'It slows down immediately and stops.',
            feedback: 'Incorrect. Slowing down requires an unbalanced opposing net force.',
          },
          {
            id: 'b',
            label: 'It speeds up steadily to the right.',
            feedback: 'Incorrect. Speeding up requires a nonzero net force.',
          },
          {
            id: 'c',
            label: 'It continues gliding at 6 m/s in the same straight line.',
            feedback: 'Correct! Zero net force means velocity stays constant.',
          },
        ],
        correctChoiceId: 'c',
        modelAnswer: 'It continues gliding at 6 m/s in the same straight line.',
        correctExplanation: 'With F_net = 0 N, an already-moving object keeps moving at constant velocity.',
        incorrectExplanation: 'Balanced forces (F_net = 0 N) leave velocity unchanged—no speeding up or slowing down.',
      },
    ],
  },
  'lesson-2': {
    title: 'Lesson 2 Mastery Assessment',
    description: 'Score at least 70% (3 of 4) and finish both Lesson 2 activities to unlock Lesson 3.',
    questions: [
      {
        id: 'l2-q1',
        number: 1,
        type: 'multiple-choice',
        objectiveNumber: 2,
        lessonReferenceId: 'lesson-2',
        prompt: 'Which object has the greatest inertia?',
        options: [
          {
            id: 'a',
            label: 'A 0.15 kg baseball traveling at 30 m/s',
            feedback: 'Incorrect. Inertia depends on mass, not speed.',
          },
          {
            id: 'b',
            label: 'A 1,200 kg parked car sitting at rest',
            feedback: 'Correct! Mass measures inertia, so the 1,200 kg car has the greatest inertia even while parked.',
          },
          {
            id: 'c',
            label: 'A 2 kg skateboard rolling down a driveway',
            feedback: 'Incorrect. Compare the masses in kilograms: 1,200 kg is far greater than 2 kg.',
          },
        ],
        correctChoiceId: 'b',
        modelAnswer: 'A 1,200 kg parked car sitting at rest',
        correctExplanation: 'Mass (in kg) is the direct measure of an object’s inertia regardless of whether it is moving or at rest.',
        incorrectExplanation: 'Inertia depends solely on mass, not speed—the object with the largest mass has the most inertia.',
      },
      {
        id: 'l2-q2',
        number: 2,
        type: 'multiple-choice',
        objectiveNumber: 3,
        lessonReferenceId: 'lesson-2',
        prompt: 'A coin rests on an index card placed over a cup. When you flick the card horizontally very fast, the coin drops straight into the cup. Why?',
        options: [
          {
            id: 'a',
            label: 'The coin’s inertia keeps it nearly at rest horizontally while the card slides out from underneath.',
            feedback: 'Correct! With little horizontal force on the coin during the quick flick, its inertia resists horizontal motion and gravity pulls it straight down.',
          },
          {
            id: 'b',
            label: 'An inertia force pulls the coin downward faster than gravity.',
            feedback: 'Incorrect. Inertia is not a force—it is resistance to velocity change.',
          },
          {
            id: 'c',
            label: 'The cup exerts an attractive magnetic force on the coin.',
            feedback: 'Incorrect. Only gravity pulls the coin down once the card moves out of the way.',
          },
        ],
        correctChoiceId: 'a',
        modelAnswer: 'The coin’s inertia keeps it nearly at rest horizontally while the card slides out from underneath.',
        correctExplanation: 'Because no large horizontal force acts on the coin, its inertia leaves it in place horizontally until gravity drops it into the cup.',
        incorrectExplanation: 'The coin resists horizontal acceleration due to inertia, then falls vertically once unsupported.',
      },
      {
        id: 'l2-q3',
        number: 3,
        type: 'true-false-reason',
        objectiveNumber: 2,
        lessonReferenceId: 'lesson-2',
        prompt: 'Evaluate: "When a bus brakes suddenly, an inertia force pushes standing passengers toward the windshield."',
        options: [
          {
            id: 'a',
            label: 'True — inertia acts like an invisible forward push during braking.',
            feedback: 'Incorrect. Inertia is never a force and never appears on a force diagram.',
          },
          {
            id: 'b',
            label: 'False — inertia is not a force; the passenger’s body simply keeps its original forward velocity as the bus slows.',
            feedback: 'Correct! The brakes slow the bus, while the passenger’s upper body continues forward by inertia.',
          },
        ],
        correctChoiceId: 'b',
        modelAnswer: 'False — inertia is not a force; the passenger’s body simply keeps its original forward velocity as the bus slows.',
        correctExplanation: 'No forward force pushes the passenger; instead, the bus slows down beneath them.',
        incorrectExplanation: 'Inertia is a property (resistance to velocity change), not a force pushing the passenger.',
      },
      {
        id: 'l2-q4',
        number: 4,
        type: 'multiple-choice',
        objectiveNumber: 3,
        lessonReferenceId: 'lesson-2',
        prompt: 'A hockey puck glides across frictionless ice at 8 m/s. What net horizontal force is required to keep it moving at 8 m/s?',
        options: [
          {
            id: 'a',
            label: '0 N',
            feedback: 'Correct! By Newton’s First Law, zero net force is needed to maintain constant velocity.',
          },
          {
            id: 'b',
            label: '8 N forward',
            feedback: 'Incorrect. An 8 N net force would continuously accelerate the puck rather than keep velocity constant.',
          },
          {
            id: 'c',
            label: '1 N forward',
            feedback: 'Incorrect. Even a 1 N net force causes ongoing acceleration on frictionless ice.',
          },
        ],
        correctChoiceId: 'a',
        modelAnswer: '0 N',
        correctExplanation: 'Newton’s First Law states that an object in motion keeps moving at constant velocity when F_net = 0 N.',
        incorrectExplanation: 'No net force (0 N) is required to keep an object moving at constant velocity.',
      },
    ],
  },
  'lesson-3': {
    title: 'Lesson 3 Mastery Assessment',
    description: 'Score at least 70% (3 of 4) and finish both Lesson 3 activities to unlock Lesson 4.',
    questions: [
      {
        id: 'l3-q1',
        number: 1,
        type: 'numerical',
        objectiveNumber: 4,
        lessonReferenceId: 'lesson-3',
        prompt: 'What net force is required to accelerate a 3 kg cart at 4 m/s²?',
        helperText: 'Use F_net = m × a and enter a number in newtons (N).',
        correctNumericValue: 12,
        numericTolerance: 0.05,
        numericUnit: 'N',
        modelAnswer: '12 N',
        correctExplanation: 'Correct! F_net = m × a = 3 kg × 4 m/s² = 12 N.',
        incorrectExplanation: 'Apply Newton’s Second Law directly: F_net = m × a = 3 kg × 4 m/s² = 12 N.',
      },
      {
        id: 'l3-q2',
        number: 2,
        type: 'numerical-direction',
        objectiveNumber: 4,
        lessonReferenceId: 'lesson-3',
        prompt: 'A 10 kg crate experiences a net force of 30 N to the left. Find its acceleration magnitude and direction.',
        helperText: 'Calculate a = F_net / m and choose the direction.',
        correctNumericValue: 3,
        numericTolerance: 0.05,
        numericUnit: 'm/s²',
        correctDirection: 'left',
        modelAnswer: '3 m/s² to the left',
        correctExplanation: 'Correct! a = 30 N / 10 kg = 3 m/s², pointing to the left in the same direction as the net force.',
        incorrectExplanation: 'Divide net force by mass (30 / 10 = 3 m/s²), and match the direction of the net force (to the left).',
      },
      {
        id: 'l3-q3',
        number: 3,
        type: 'multiple-choice',
        objectiveNumber: 4,
        lessonReferenceId: 'lesson-3',
        prompt: 'A 5 kg object accelerates at 6 m/s² under a net force of 30 N. If the net force stays at 30 N and mass increases to 15 kg, what is the new acceleration?',
        options: [
          {
            id: 'a',
            label: '2 m/s²',
            feedback: 'Correct! Tripling the mass cuts acceleration to one-third: 30 N / 15 kg = 2 m/s².',
          },
          {
            id: 'b',
            label: '18 m/s²',
            feedback: 'Incorrect. Greater mass reduces acceleration rather than increasing it.',
          },
          {
            id: 'c',
            label: '6 m/s²',
            feedback: 'Incorrect. Acceleration depends inversely on mass when force is constant.',
          },
        ],
        correctChoiceId: 'a',
        modelAnswer: '2 m/s²',
        correctExplanation: 'Using a = F_net / m: 30 N / 15 kg = 2 m/s².',
        incorrectExplanation: 'Divide the constant 30 N force by the new 15 kg mass: 30 / 15 = 2 m/s².',
      },
      {
        id: 'l3-q4',
        number: 4,
        type: 'multiple-choice',
        objectiveNumber: 4,
        lessonReferenceId: 'lesson-3',
        prompt: 'In Newton’s Second Law, how does the direction of acceleration always compare to the direction of the net force?',
        options: [
          {
            id: 'a',
            label: 'Acceleration always points in the same direction as the net force.',
            feedback: 'Correct! Acceleration and net force always share the exact same direction.',
          },
          {
            id: 'b',
            label: 'Acceleration always points opposite to the net force.',
            feedback: 'Incorrect. Only reaction forces on a different object point opposite—acceleration of an object follows its own net force.',
          },
          {
            id: 'c',
            label: 'Acceleration always points perpendicular to the net force.',
            feedback: 'Incorrect. Net force and acceleration are always aligned in the same direction.',
          },
        ],
        correctChoiceId: 'a',
        modelAnswer: 'Acceleration always points in the same direction as the net force.',
        correctExplanation: 'Because F_net = m × a with positive mass m, vector a always points in the same direction as F_net.',
        incorrectExplanation: 'Acceleration always has the exact same direction as the net force acting on the object.',
      },
    ],
  },
  'lesson-4': {
    title: 'Lesson 4 Mastery Assessment',
    description: 'Score at least 70% (3 of 4) and finish both Lesson 4 activities to unlock Lesson 5.',
    questions: [
      {
        id: 'l4-q1',
        number: 1,
        type: 'multiple-choice',
        objectiveNumber: 5,
        lessonReferenceId: 'lesson-4',
        prompt: 'A soccer player kicks a ball with a 50 N force. What force does the ball exert on the player’s foot at that instant?',
        options: [
          {
            id: 'a',
            label: 'A smaller force because the ball has much less mass than the player.',
            feedback: 'Incorrect. Action and reaction forces always have equal magnitude regardless of the objects’ masses.',
          },
          {
            id: 'b',
            label: 'An equal 50 N force in the opposite direction on the player’s foot.',
            feedback: 'Correct! By Newton’s Third Law, the ball pushes back on the foot with 50 N in the opposite direction.',
          },
          {
            id: 'c',
            label: 'Zero force until after the ball flies away.',
            feedback: 'Incorrect. Interaction force pairs act simultaneously during contact.',
          },
        ],
        correctChoiceId: 'b',
        modelAnswer: 'An equal 50 N force in the opposite direction on the player’s foot.',
        correctExplanation: 'Third-Law force pairs always have equal magnitude and opposite direction during the interaction.',
        incorrectExplanation: 'Even though the ball accelerates more due to its smaller mass, the forces between foot and ball are equal (50 N) and opposite.',
      },
      {
        id: 'l4-q2',
        number: 2,
        type: 'multiple-choice',
        objectiveNumber: 5,
        lessonReferenceId: 'lesson-4',
        prompt: 'A rocket pushes exhaust gases downward out of its engines. What is the Newton’s Third Law reaction force?',
        options: [
          {
            id: 'a',
            label: 'Gravity pulling the rocket downward.',
            feedback: 'Incorrect. Gravity is Earth’s pull on the rocket, not the pair to the engine pushing gas.',
          },
          {
            id: 'b',
            label: 'The exhaust gases pushing the rocket upward with equal force.',
            feedback: 'Correct! Rocket pushes gases down; gases push rocket up.',
          },
          {
            id: 'c',
            label: 'The launchpad pushing downward on Earth.',
            feedback: 'Incorrect. Identify the exact two interacting objects: the rocket and the exhaust gases.',
          },
        ],
        correctChoiceId: 'b',
        modelAnswer: 'The exhaust gases pushing the rocket upward with equal force.',
        correctExplanation: 'Swap the two objects and reverse direction: rocket on gas (down) ↔ gas on rocket (up).',
        incorrectExplanation: 'To find the Third-Law pair, reverse the two interacting objects: gases exert an upward force on the rocket.',
      },
      {
        id: 'l4-q3',
        number: 3,
        type: 'short-answer',
        objectiveNumber: 5,
        lessonReferenceId: 'lesson-4',
        prompt: 'Briefly explain why a foot pushing backward on the ground and the ground pushing forward on the foot do NOT cancel out.',
        helperText: 'State which objects the forces act on.',
        requiredConceptKeywords: [
          ['different', 'separate', 'two', 'each other', 'distinct', 'other object'],
          ['object', 'objects', 'body', 'bodies', 'ground', 'foot'],
        ],
        modelAnswer: 'They act on different objects (one force acts on the ground and the other acts on the foot).',
        correctExplanation: 'Correct! Action and reaction forces act on two different objects, so they never cancel.',
        incorrectExplanation: 'Mention that the two forces act on different objects (the ground vs. your foot), so they cannot cancel.',
      },
      {
        id: 'l4-q4',
        number: 4,
        type: 'true-false-reason',
        objectiveNumber: 5,
        lessonReferenceId: 'lesson-4',
        prompt: 'Evaluate: "When a small bug hits the windshield of a heavy moving bus, the bus exerts a larger force on the bug than the bug exerts on the bus."',
        options: [
          {
            id: 'a',
            label: 'True — the bus is much heavier and faster, so its force is larger.',
            feedback: 'Incorrect. The bug experiences greater ACCELERATION because of its tiny mass, not a larger force.',
          },
          {
            id: 'b',
            label: 'False — the bug and the bus exert equal-magnitude forces on each other during the collision.',
            feedback: 'Correct! Newton’s Third Law guarantees equal force magnitudes; the bug’s tiny mass explains why its acceleration is huge.',
          },
        ],
        correctChoiceId: 'b',
        modelAnswer: 'False — the bug and the bus exert equal-magnitude forces on each other during the collision.',
        correctExplanation: 'Equal forces act on vastly different masses: the bug accelerates dramatically while the heavy bus barely changes velocity.',
        incorrectExplanation: 'By Newton’s Third Law, both objects exert equal-magnitude forces on each other regardless of mass difference.',
      },
    ],
  },
  'lesson-5': {
    title: 'Lesson 5 Mastery Assessment',
    description: 'Score at least 70% (3 of 4) and verify the 5-step synthesis activity to unlock the Final Module Assessment.',
    questions: [
      {
        id: 'l5-q1',
        number: 1,
        type: 'numerical',
        objectiveNumber: 6,
        lessonReferenceId: 'lesson-5',
        prompt: 'A 4 kg box is pushed with 22 N to the right while friction pulls with 6 N to the left. What is the horizontal net force?',
        helperText: 'Enter a number in newtons (N).',
        correctNumericValue: 16,
        numericTolerance: 0.05,
        numericUnit: 'N',
        modelAnswer: '16 N',
        correctExplanation: 'Correct! (+22 N) + (-6 N) = +16 N to the right.',
        incorrectExplanation: 'Subtract opposing friction from the applied push: 22 N − 6 N = 16 N.',
      },
      {
        id: 'l5-q2',
        number: 2,
        type: 'numerical-direction',
        objectiveNumber: 6,
        lessonReferenceId: 'lesson-5',
        prompt: 'Using the same 4 kg box with a horizontal net force of 16 N to the right, calculate its horizontal acceleration and direction.',
        helperText: 'Use a = F_net / m.',
        correctNumericValue: 4,
        numericTolerance: 0.05,
        numericUnit: 'm/s²',
        correctDirection: 'right',
        modelAnswer: '4 m/s² to the right',
        correctExplanation: 'Correct! a = 16 N / 4 kg = 4 m/s² to the right.',
        incorrectExplanation: 'Divide net force (16 N) by mass (4 kg) to get 4 m/s² to the right.',
      },
      {
        id: 'l5-q3',
        number: 3,
        type: 'multiple-choice',
        objectiveNumber: 6,
        lessonReferenceId: 'lesson-5',
        prompt: 'As a box slides horizontally across a flat floor, why is its vertical acceleration zero?',
        options: [
          {
            id: 'a',
            label: 'Because downward gravity and the upward normal force from the floor balance each other.',
            feedback: 'Correct! Balanced vertical forces give zero vertical net force, so vertical acceleration is zero.',
          },
          {
            id: 'b',
            label: 'Because gravity stops acting once the box moves sideways.',
            feedback: 'Incorrect. Gravity always pulls downward; the floor’s upward normal force balances it.',
          },
          {
            id: 'c',
            label: 'Because horizontal friction cancels gravity.',
            feedback: 'Incorrect. Horizontal friction acts sideways and does not balance vertical gravity.',
          },
        ],
        correctChoiceId: 'a',
        modelAnswer: 'Because downward gravity and the upward normal force from the floor balance each other.',
        correctExplanation: 'Vertical forces cancel (F_net,vertical = 0 N), isolating acceleration to the unbalanced horizontal axis.',
        incorrectExplanation: 'Gravity pulls down and the floor’s normal force pushes up equally, balancing the vertical axis.',
      },
      {
        id: 'l5-q4',
        number: 4,
        type: 'multiple-choice',
        objectiveNumber: 6,
        lessonReferenceId: 'lesson-5',
        prompt: 'If a student pushes a box with 8 N to the right and friction also pulls with 8 N to the left while the box is already sliding right, what happens?',
        options: [
          {
            id: 'a',
            label: 'The box continues sliding right at constant velocity because F_net = 0 N.',
            feedback: 'Correct! Balanced forces mean zero acceleration, so an already-moving box keeps moving at constant velocity.',
          },
          {
            id: 'b',
            label: 'The box instantly freezes in place.',
            feedback: 'Incorrect. A moving box with balanced forces maintains its velocity; stopping requires an opposing net force.',
          },
          {
            id: 'c',
            label: 'The box accelerates steadily to the right.',
            feedback: 'Incorrect. Equal 8 N opposing forces produce F_net = 0 N and zero acceleration.',
          },
        ],
        correctChoiceId: 'a',
        modelAnswer: 'The box continues sliding right at constant velocity because F_net = 0 N.',
        correctExplanation: 'Connecting Lesson 1 and Lesson 2: 8 N right + 8 N left = 0 N net force, so velocity stays constant.',
        incorrectExplanation: 'When push and friction are equal and opposite, F_net = 0 N, so velocity remains constant.',
      },
    ],
  },
};

