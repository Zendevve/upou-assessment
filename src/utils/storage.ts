import {
  MODULE_SCREEN_IDS,
  ModuleProgressState,
  ScreenId,
} from '../physics/calculations';

const STORAGE_KEY = 'physics_everyday_life_module_1_v1';

let memoryFallback: ModuleProgressState | null = null;

export function createInitialProgressState(): ModuleProgressState {
  return {
    currentScreen: 'welcome',
    completedScreens: [],
    completedActivities: [],
    assessmentAttempts: 0,
    latestAssessment: null,
  };
}

function isValidScreenId(value: unknown): value is ScreenId {
  return typeof value === 'string' && (MODULE_SCREEN_IDS as readonly string[]).includes(value);
}

function sanitizeProgressState(raw: unknown): ModuleProgressState {
  const fallback = createInitialProgressState();
  if (!raw || typeof raw !== 'object') {
    return fallback;
  }

  const obj = raw as Record<string, unknown>;
  const currentScreen = isValidScreenId(obj.currentScreen) ? obj.currentScreen : 'welcome';
  const completedScreens = Array.isArray(obj.completedScreens)
    ? Array.from(new Set(obj.completedScreens.filter(isValidScreenId)))
    : [];
  const completedActivities = Array.isArray(obj.completedActivities)
    ? Array.from(new Set(obj.completedActivities.filter((a): a is string => typeof a === 'string')))
    : [];
  const assessmentAttempts =
    typeof obj.assessmentAttempts === 'number' && Number.isFinite(obj.assessmentAttempts) && obj.assessmentAttempts >= 0
      ? Math.floor(obj.assessmentAttempts)
      : 0;
  const latestAssessment =
    obj.latestAssessment && typeof obj.latestAssessment === 'object'
      ? (obj.latestAssessment as ModuleProgressState['latestAssessment'])
      : null;

  return {
    currentScreen,
    completedScreens,
    completedActivities,
    assessmentAttempts,
    latestAssessment,
  };
}

export function loadProgressState(): ModuleProgressState {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const serialized = window.localStorage.getItem(STORAGE_KEY);
      if (serialized) {
        return sanitizeProgressState(JSON.parse(serialized));
      }
    }
  } catch {
    // Graceful fallback when localStorage is unavailable or blocked
  }
  return memoryFallback ? sanitizeProgressState(memoryFallback) : createInitialProgressState();
}

export function saveProgressState(state: ModuleProgressState): void {
  const sanitized = sanitizeProgressState(state);
  memoryFallback = sanitized;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    }
  } catch {
    // Graceful fallback when localStorage quota is exceeded or disabled
  }
}

export function resetProgressState(): ModuleProgressState {
  const fresh = createInitialProgressState();
  memoryFallback = fresh;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignore storage errors
  }
  return fresh;
}
