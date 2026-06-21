import { useState } from 'react';
import { Trash2, Plus, Pencil, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import Card from '../components/ui/Card';
import LogForm from '../components/logging/LogForm';
import { getTodayString } from '../utils/calculations';

const CATEGORY_COLORS = {
  electricity: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  transport: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  food: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  home: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  shopping: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
};

export default function Log() {
  const logs = useStore((s) => s.logs);
  const addLog = useStore((s) => s.addLog);
  const updateLog = useStore((s) => s.updateLog);
  const deleteLog = useStore((s) => s.deleteLog);
  const [editingLog, setEditingLog] = useState(null);
  const [showNewForm, setShowNewForm] = useState(true);

  const today = getTodayString();
  const todayLogs = logs.filter((l) => l.date === today).reverse();
  const recentLogs = logs.slice(-10).reverse();

  const handleCreate = (logData) => {
    addLog(logData);
    setShowNewForm(false);
    setTimeout(() => setShowNewForm(true), 100);
  };

  const handleUpdate = (logData) => {
    if (editingLog) {
      updateLog(editingLog.id, logData);
      setEditingLog(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-eco-800 dark:text-eco-100">
            Activity Log
          </h2>
          <p className="text-eco-500 dark:text-eco-400 text-sm mt-1">
            Record your daily carbon activities
          </p>
        </div>
        {!editingLog && (
          <button
            className="btn-primary flex items-center gap-1.5 text-sm"
            onClick={() => setShowNewForm(true)}
          >
            <Plus className="w-4 h-4" />
            New
          </button>
        )}
      </div>

      {editingLog ? (
        <Card
          title="Edit Entry"
          action={
            <button
              onClick={() => setEditingLog(null)}
              className="p-1.5 rounded-lg hover:bg-eco-100 dark:hover:bg-eco-800 text-eco-500"
            >
              <X className="w-4 h-4" />
            </button>
          }
        >
          <LogForm
            initialLog={editingLog}
            onSubmit={handleUpdate}
            onCancel={() => setEditingLog(null)}
            submitLabel="Update Entry"
          />
        </Card>
      ) : (
        showNewForm && (
          <Card title="Log Activity">
            <LogForm onSubmit={handleCreate} />
          </Card>
        )
      )}

      {todayLogs.length > 0 && !editingLog && (
        <Card title="Today's Logs" subtitle={`${todayLogs.length} entries`}>
          <LogList
            logs={todayLogs}
            onDelete={deleteLog}
            onEdit={setEditingLog}
          />
        </Card>
      )}

      {!editingLog && (
        <Card title="Recent History" subtitle="Last 10 entries">
          {recentLogs.length > 0 ? (
            <LogList
              logs={recentLogs}
              onDelete={deleteLog}
              onEdit={setEditingLog}
            />
          ) : (
            <p className="text-eco-400 text-sm text-center py-6">
              No activities logged yet. Add your first entry above!
            </p>
          )}
        </Card>
      )}
    </div>
  );
}

function LogList({ logs, onDelete, onEdit }) {
  return (
    <div className="space-y-2">
      {logs.map((log) => (
        <div
          key={log.id}
          className="flex items-center justify-between p-3 rounded-xl bg-eco-50 dark:bg-eco-800/50"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  CATEGORY_COLORS[log.category] || 'bg-eco-100 text-eco-700'
                }`}
              >
                {log.category}
              </span>
              <span className="text-xs text-eco-400">{log.date}</span>
            </div>
            <p className="text-sm font-medium text-eco-800 dark:text-eco-100 truncate">
              {log.itemLabel}
            </p>
            <p className="text-xs text-eco-500">
              {log.quantity} {log.unit}
              {log.notes && ` · ${log.notes}`}
            </p>
          </div>
          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-sm font-semibold text-eco-700 dark:text-eco-200 whitespace-nowrap mr-1">
              {log.emissions} kg
            </span>
            <button
              onClick={() => onEdit(log)}
              className="p-2 rounded-lg hover:bg-eco-200 dark:hover:bg-eco-700 text-eco-600 dark:text-eco-300 transition-colors"
              aria-label="Edit log"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(log.id)}
              className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors"
              aria-label="Delete log"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}