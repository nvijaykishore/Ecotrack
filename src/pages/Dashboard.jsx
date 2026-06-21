import { useStore } from '../store/useStore';
import EcoAssistantCard from '../components/assistant/EcoAssistantCard';
import FootprintCard from '../components/dashboard/FootprintCard';
import GoalProgressRings from '../components/dashboard/GoalProgressRings';
import GamificationCard from '../components/gamification/GamificationCard';
import TrendChart from '../components/dashboard/TrendChart';
import TipsCard from '../components/dashboard/TipsCard';
import StreakBadges from '../components/dashboard/StreakBadges';
import CategoryBreakdown from '../components/dashboard/CategoryBreakdown';
import { getMonthlyTotal, getMonthString } from '../utils/calculations';

export default function Dashboard() {
  const logs = useStore((s) => s.logs);
  const history = useStore((s) => s.history);
  const quizResults = useStore((s) => s.quizResults);
  const goals = useStore((s) => s.goals);
  const getTodayFootprint = useStore((s) => s.getTodayFootprint);
  const profile = useStore((s) => s.profile);

  const todayFootprint = getTodayFootprint();
  const monthlyTotal = getMonthlyTotal(logs, getMonthString());
  const baseline = quizResults?.dailyTotal ?? 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="font-display text-2xl font-bold text-eco-800 dark:text-eco-100">
          Dashboard
        </h2>
        <p className="text-eco-500 dark:text-eco-400 text-sm mt-1">
          Your carbon footprint overview
        </p>
      </div>

      <EcoAssistantCard />

      <FootprintCard
        todayFootprint={todayFootprint}
        monthlyTotal={monthlyTotal}
        baseline={baseline}
        goals={goals}
      />

      <GoalProgressRings
        todayFootprint={todayFootprint}
        monthlyTotal={monthlyTotal}
        goals={goals}
      />

      <GamificationCard />

      <TrendChart history={history} logs={logs} />

      <CategoryBreakdown logs={logs} />

      <TipsCard profile={profile} logs={logs} breakdown={quizResults?.breakdown} />

      <StreakBadges />
    </div>
  );
}