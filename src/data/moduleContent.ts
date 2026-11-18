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
