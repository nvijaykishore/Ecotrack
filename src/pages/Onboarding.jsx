import { useState } from 'react';
import { Leaf, ChevronRight, ChevronLeft } from 'lucide-react';
import { useStore } from '../store/useStore';
import { QUIZ_QUESTIONS, calculateQuizFootprint } from '../data/quizQuestions';
import QuizResults from '../components/onboarding/QuizResults';

export default function Onboarding() {
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const [step, setStep] = useState('welcome');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [profile, setProfile] = useState({ name: '', location: 'mumbai' });

  const currentQuestion = QUIZ_QUESTIONS[questionIndex];
  const previewResults = step === 'results' ? calculateQuizFootprint(answers) : null;

  const handleAnswer = (option) => {
    const newAnswers = { ...answers, [currentQuestion.id]: option };
    setAnswers(newAnswers);

    if (questionIndex < QUIZ_QUESTIONS.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setStep('results');
    }
  };

  const handleComplete = () => {
    completeOnboarding(answers, profile);
  };

  if (step === 'welcome') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-eco-50 to-eco-100 dark:from-eco-950 dark:to-eco-900">
        <div className="max-w-md w-full text-center animate-slide-up">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-eco-600 flex items-center justify-center shadow-lg">
            <Leaf className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-eco-800 dark:text-eco-100 mb-3">
            Welcome to EcoTrack
          </h1>
          <p className="text-eco-600 dark:text-eco-400 mb-8 leading-relaxed">
            Discover your carbon footprint with a quick quiz tailored for India.
            Track, reduce, and build sustainable habits — all offline.
          </p>

          <div className="mb-6 text-left">
            <label className="label">Your name (optional)</label>
            <input
              type="text"
              className="input-field"
              placeholder="Enter your name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>

          <button
            className="btn-primary w-full flex items-center justify-center gap-2"
            onClick={() => setStep('quiz')}
          >
            Start Carbon Quiz
            <ChevronRight className="w-4 h-4" />
          </button>

          <p className="text-xs text-eco-400 mt-4">10 questions · ~3 minutes · Mumbai defaults</p>
        </div>
      </div>
    );
  }

  if (step === 'results' && previewResults) {
    return (
      <QuizResults
        results={previewResults}
        profile={profile}
        onComplete={handleComplete}
        onBack={() => {
          setStep('quiz');
          setQuestionIndex(QUIZ_QUESTIONS.length - 1);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-4 py-8 bg-gradient-to-b from-eco-50 to-eco-100 dark:from-eco-950 dark:to-eco-900">
      <div className="max-w-lg mx-auto w-full flex-1 flex flex-col">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-eco-500">
              Question {questionIndex + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <span className="text-sm text-eco-400">
              {Math.round(((questionIndex + 1) / QUIZ_QUESTIONS.length) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-eco-200 dark:bg-eco-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-eco-600 rounded-full transition-all duration-500"
              style={{ width: `${((questionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex-1 animate-slide-up">
          <h2 className="font-display text-2xl font-bold text-eco-800 dark:text-eco-100 mb-6">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                className="w-full text-left p-4 rounded-2xl border-2 border-eco-200 dark:border-eco-700 bg-white dark:bg-eco-900 hover:border-eco-500 dark:hover:border-eco-500 hover:bg-eco-50 dark:hover:bg-eco-800 transition-all"
                onClick={() => handleAnswer(option)}
              >
                <div className="flex items-center gap-3">
                  {option.icon && <span className="text-2xl">{option.icon}</span>}
                  <span className="font-medium text-eco-800 dark:text-eco-100">
                    {option.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {questionIndex > 0 && (
          <button
            className="btn-secondary mt-6 flex items-center justify-center gap-2"
            onClick={() => setQuestionIndex(questionIndex - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
        )}
      </div>
    </div>
  );
}