import { useEffect, useState } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { MobileHeader } from './components/Layout/MobileHeader';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { Lesson1Forces } from './components/screens/Lesson1Forces';
import { Lesson2FirstLaw } from './components/screens/Lesson2FirstLaw';
import { Lesson3SecondLaw } from './components/screens/Lesson3SecondLaw';
import { Lesson4ThirdLaw } from './components/screens/Lesson4ThirdLaw';
import { Lesson5Synthesis } from './components/screens/Lesson5Synthesis';
import { AssessmentScreen } from './components/screens/AssessmentScreen';
import {
  AssessmentResultSummary,
  ModuleProgressState,
  ScreenId,
} from './physics/calculations';
import {
  loadProgressState,
  resetProgressState,
  saveProgressState,
} from './utils/storage';

export default function App() {
  const [progress, setProgress] = useState<ModuleProgressState>(() => {
    const loaded = loadProgressState();
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1' && loaded.currentScreen === 'welcome') {
        return { ...loaded, currentScreen: 'lesson-1' };
      }
    }
    return loaded;
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    saveProgressState(progress);
  }, [progress]);

  const navigateTo = (screenId: ScreenId) => {
    setProgress((prev) => ({
      ...prev,
      currentScreen: screenId,
    }));
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const markScreenCompleted = (screenId: ScreenId) => {
    setProgress((prev) => {
      if (prev.completedScreens.includes(screenId)) {
        return prev;
      }
      return {
        ...prev,
        completedScreens: [...prev.completedScreens, screenId],
      };
    });
  };

  const markActivityUsed = (activityId: string) => {
    setProgress((prev) => {
      if (prev.completedActivities.includes(activityId)) {
        return prev;
      }
      return {
        ...prev,
        completedActivities: [...prev.completedActivities, activityId],
      };
    });
  };

  const handleStartLearning = () => {
    setProgress((prev) => ({
      ...prev,
      currentScreen: 'lesson-1',
      completedScreens: prev.completedScreens.includes('welcome')
        ? prev.completedScreens
        : [...prev.completedScreens, 'welcome'],
    }));
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleSubmitAssessment = (result: AssessmentResultSummary) => {
    setProgress((prev) => ({
      ...prev,
      assessmentAttempts: prev.assessmentAttempts + 1,
      latestAssessment: result,
      completedScreens: prev.completedScreens.includes('assessment')
        ? prev.completedScreens
        : [...prev.completedScreens, 'assessment'],
    }));
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleResetProgress = () => {
    const fresh = resetProgressState();
    setProgress(fresh);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const isCompleted = (id: ScreenId) => progress.completedScreens.includes(id);

  return (
    <div className="min-h-screen bg-white text-[#172033] flex flex-col lg:flex-row">
      {/* Skip link for keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-[#2563EB] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to lesson content
      </a>

      <Sidebar
        currentScreen={progress.currentScreen}
        completedScreens={progress.completedScreens}
        onNavigate={navigateTo}
        onResetProgress={handleResetProgress}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <MobileHeader
          currentScreen={progress.currentScreen}
          completedScreens={progress.completedScreens}
          onOpenMenu={() => setIsMobileMenuOpen(true)}
        />

        <main
          id="main-content"
          className="flex-1 w-full max-w-[880px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-10"
        >
          {progress.currentScreen === 'welcome' && (
            <WelcomeScreen
              completedScreens={progress.completedScreens}
              onStartLearning={handleStartLearning}
              onNavigate={navigateTo}
            />
          )}

          {progress.currentScreen === 'lesson-1' && (
            <Lesson1Forces
              isCompleted={isCompleted('lesson-1')}
              onNavigate={navigateTo}
              onCompleteLesson={() => markScreenCompleted('lesson-1')}
              onActivityUsed={markActivityUsed}
            />
          )}

          {progress.currentScreen === 'lesson-2' && (
            <Lesson2FirstLaw
              isCompleted={isCompleted('lesson-2')}
              onNavigate={navigateTo}
              onCompleteLesson={() => markScreenCompleted('lesson-2')}
              onActivityUsed={markActivityUsed}
            />
          )}

          {progress.currentScreen === 'lesson-3' && (
            <Lesson3SecondLaw
              isCompleted={isCompleted('lesson-3')}
              onNavigate={navigateTo}
              onCompleteLesson={() => markScreenCompleted('lesson-3')}
              onActivityUsed={markActivityUsed}
            />
          )}

          {progress.currentScreen === 'lesson-4' && (
            <Lesson4ThirdLaw
              isCompleted={isCompleted('lesson-4')}
              onNavigate={navigateTo}
              onCompleteLesson={() => markScreenCompleted('lesson-4')}
              onActivityUsed={markActivityUsed}
            />
          )}

          {progress.currentScreen === 'lesson-5' && (
            <Lesson5Synthesis
              isCompleted={isCompleted('lesson-5')}
              onNavigate={navigateTo}
              onCompleteLesson={() => markScreenCompleted('lesson-5')}
              onActivityUsed={markActivityUsed}
            />
          )}

          {progress.currentScreen === 'assessment' && (
            <AssessmentScreen
              completedScreens={progress.completedScreens}
              assessmentAttempts={progress.assessmentAttempts}
              latestAssessment={progress.latestAssessment}
              onSubmitAssessment={handleSubmitAssessment}
              onNavigate={navigateTo}
            />
          )}
        </main>
      </div>
    </div>
  );
}
