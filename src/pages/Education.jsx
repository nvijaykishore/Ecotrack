import { useState } from 'react';
import * as Icons from 'lucide-react';
import { EDUCATION_SECTIONS } from '../data/education';
import Card from '../components/ui/Card';

export default function Education() {
  const [activeSection, setActiveSection] = useState(EDUCATION_SECTIONS[0].id);

  const section = EDUCATION_SECTIONS.find((s) => s.id === activeSection);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="font-display text-2xl font-bold text-eco-800 dark:text-eco-100">
          Learn
        </h2>
        <p className="text-eco-500 dark:text-eco-400 text-sm mt-1">
          Understanding your carbon impact
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {EDUCATION_SECTIONS.map((s) => {
          const Icon = Icons[s.icon] || Icons.BookOpen;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                activeSection === s.id
                  ? 'bg-eco-600 text-white'
                  : 'bg-white dark:bg-eco-900 text-eco-700 dark:text-eco-300 border border-eco-200 dark:border-eco-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {s.title.split(' ').slice(0, 2).join(' ')}
            </button>
          );
        })}
      </div>

      {section && (
        <Card>
          <div className="flex items-center gap-3 mb-4">
            {(() => {
              const Icon = Icons[section.icon] || Icons.BookOpen;
              return (
                <div className="w-10 h-10 rounded-xl bg-eco-100 dark:bg-eco-800 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-eco-600 dark:text-eco-300" />
                </div>
              );
            })()}
            <h3 className="font-display font-semibold text-lg text-eco-800 dark:text-eco-100">
              {section.title}
            </h3>
          </div>

          <div className="prose prose-eco dark:prose-invert max-w-none">
            <EducationContent content={section.content} />
          </div>

          {section.tips.length > 0 && (
            <div className="mt-6 pt-4 border-t border-eco-100 dark:border-eco-800">
              <h4 className="font-medium text-eco-800 dark:text-eco-100 mb-3 flex items-center gap-2">
                <Icons.Lightbulb className="w-4 h-4 text-earth-500" />
                Quick Tips
              </h4>
              <ul className="space-y-2">
                {section.tips.map((tip, i) => (
                  <li
                    key={i}
                    className="text-sm text-eco-600 dark:text-eco-400 flex items-start gap-2"
                  >
                    <span className="text-eco-500 mt-0.5">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

function EducationContent({ content }) {
  const lines = content.split('\n');

  return (
    <div className="space-y-3 text-sm text-eco-700 dark:text-eco-300 leading-relaxed">
      {lines.map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <p key={i} className="font-semibold text-eco-800 dark:text-eco-100">
              {line.replace(/\*\*/g, '')}
            </p>
          );
        }
        if (line.startsWith('|')) {
          return null;
        }
        if (line.match(/^\d+\./)) {
          return (
            <p key={i} className="pl-4">
              {line}
            </p>
          );
        }
        if (line.startsWith('- ')) {
          return (
            <p key={i} className="pl-4 flex items-start gap-2">
              <span className="text-eco-500">•</span>
              {line.slice(2)}
            </p>
          );
        }
        if (line.trim() === '') return <br key={i} />;
        return <p key={i}>{line}</p>;
      })}
    </div>
  );
}