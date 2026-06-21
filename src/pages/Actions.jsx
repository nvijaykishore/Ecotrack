import { useState } from 'react';
import { Check, Filter, Zap } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useStore } from '../store/useStore';
import { ACTIONS, CHALLENGES } from '../data/actions';
import Card from '../components/ui/Card';
import ChallengeCard from '../components/actions/ChallengeCard';
import { getLevelInfo } from '../utils/gamification';

const CATEGORIES = ['all', 'electricity', 'transport', 'food', 'home', 'shopping'];
const DIFFICULTY_COLORS = {
  easy: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300',
  medium: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300',
  hard: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300',
};

export default function Actions() {
  const completedActions = useStore((s) => s.completedActions);
  const gamification = useStore((s) => s.gamification);
  const toggleAction = useStore((s) => s.toggleAction);
  const getCompletedActionsImpact = useStore((s) => s.getCompletedActionsImpact);

  const [filter, setFilter] = useState('all');
  const levelInfo = getLevelInfo(gamification.xp);

  const filteredActions = filter === 'all'
    ? ACTIONS
    : ACTIONS.filter((a) => a.category === filter);

  const completedCount = Object.values(completedActions).filter(Boolean).length;
  const totalImpact = getCompletedActionsImpact();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="font-display text-2xl font-bold text-eco-800 dark:text-eco-100">
          Eco Actions
        </h2>
        <p className="text-eco-500 dark:text-eco-400 text-sm mt-1">
          Small changes, big impact · +25 XP per action
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="card text-center py-4">
          <p className="text-2xl font-bold text-eco-700 dark:text-eco-200">{completedCount}</p>
          <p className="text-xs text-eco-500">Actions Done</p>
        </div>
        <div className="card text-center py-4">
          <p className="text-2xl font-bold text-eco-700 dark:text-eco-200">{totalImpact}</p>
          <p className="text-xs text-eco-500">kg saved/mo</p>
        </div>
        <div className="card text-center py-4">
          <p className="text-2xl font-bold text-eco-700 dark:text-eco-200 flex items-center justify-center gap-1">
            <Zap className="w-4 h-4 text-earth-500" />
            {gamification.xp}
          </p>
          <p className="text-xs text-eco-500">Lv.{levelInfo.level} {levelInfo.title}</p>
        </div>
      </div>

      <Card title="Challenges" subtitle="Check in daily · +50 XP per day · +200 XP on completion">
        <div className="space-y-3">
          {CHALLENGES.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-eco-800 dark:text-eco-100">
            Action Library
          </h3>
          <Filter className="w-4 h-4 text-eco-400" />
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                filter === cat
                  ? 'bg-eco-600 text-white'
                  : 'bg-eco-100 dark:bg-eco-800 text-eco-600 dark:text-eco-300'
              }`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredActions.map((action) => (
            <ActionCard
              key={action.id}
              action={action}
              done={!!completedActions[action.id]}
              onToggle={() => toggleAction(action.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ActionCard({ action, done, onToggle }) {
  const Icon = Icons[action.icon] || Icons.Leaf;

  return (
    <button
      onClick={onToggle}
      className={`w-full card flex items-start gap-4 text-left transition-all hover:shadow-md ${
        done ? 'ring-2 ring-eco-500 ring-opacity-50' : ''
      }`}
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
          done
            ? 'bg-eco-600 text-white'
            : 'bg-eco-100 dark:bg-eco-800 text-eco-600 dark:text-eco-300'
        }`}
      >
        {done ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className={`font-medium ${done ? 'line-through text-eco-400' : 'text-eco-800 dark:text-eco-100'}`}>
            {action.title}
          </p>
          <span className={`text-xs px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[action.difficulty]}`}>
            {action.difficulty}
          </span>
        </div>
        <p className="text-sm text-eco-500 dark:text-eco-400">{action.description}</p>
        <p className="text-xs font-semibold text-eco-600 mt-1.5">
          Saves ~{action.impact} kg CO₂/month
        </p>
      </div>
    </button>
  );
}