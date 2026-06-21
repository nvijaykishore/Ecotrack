import { useState, useRef } from 'react';
import {
  Moon, Sun, Download, Upload, Trash2, FileText, User, Target, AlertTriangle, RefreshCw,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import Card from '../components/ui/Card';
import { exportMonthlyReport } from '../utils/pdfExport';

export default function Settings() {
  const theme = useStore((s) => s.theme);
  const profile = useStore((s) => s.profile);
  const goals = useStore((s) => s.goals);
  const setTheme = useStore((s) => s.setTheme);
  const updateProfile = useStore((s) => s.updateProfile);
  const setGoals = useStore((s) => s.setGoals);
  const exportData = useStore((s) => s.exportData);
  const importData = useStore((s) => s.importData);
  const resetAllData = useStore((s) => s.resetAllData);
  const retakeQuiz = useStore((s) => s.retakeQuiz);

  const [importMessage, setImportMessage] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [localProfile, setLocalProfile] = useState(profile);
  const [localGoals, setLocalGoals] = useState(goals);
  const fileInputRef = useRef(null);

  const handleExportJSON = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecotrack-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = importData(event.target.result);
      if (result.success) {
        setImportMessage({ type: 'success', text: 'Data imported successfully! Refresh to see changes.' });
        window.location.reload();
      } else {
        setImportMessage({ type: 'error', text: result.error });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExportPDF = () => {
    const state = useStore.getState();
    exportMonthlyReport(state);
  };

  const handleSaveProfile = () => {
    updateProfile(localProfile);
    setGoals(localGoals);
  };

  const handleReset = () => {
    resetAllData();
    window.location.reload();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="font-display text-2xl font-bold text-eco-800 dark:text-eco-100">
          Settings
        </h2>
        <p className="text-eco-500 dark:text-eco-400 text-sm mt-1">
          Preferences and data management
        </p>
      </div>

      <Card title="Appearance">
        <div className="flex gap-3">
          <button
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors ${
              theme === 'light'
                ? 'bg-eco-600 text-white'
                : 'bg-eco-100 dark:bg-eco-800 text-eco-700 dark:text-eco-300'
            }`}
            onClick={() => setTheme('light')}
          >
            <Sun className="w-4 h-4" />
            Light
          </button>
          <button
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors ${
              theme === 'dark'
                ? 'bg-eco-600 text-white'
                : 'bg-eco-100 dark:bg-eco-800 text-eco-700 dark:text-eco-300'
            }`}
            onClick={() => setTheme('dark')}
          >
            <Moon className="w-4 h-4" />
            Dark
          </button>
        </div>
      </Card>

      <Card title="Carbon Profile" action={<RefreshCw className="w-5 h-5 text-eco-400" />}>
        <p className="text-sm text-eco-500 mb-4">
          Retake the onboarding quiz to refresh your baseline footprint. Your logs, badges, and XP are kept.
        </p>
        <button
          type="button"
          className="btn-outline w-full flex items-center justify-center gap-2"
          onClick={() => retakeQuiz()}
        >
          <RefreshCw className="w-4 h-4" />
          Retake Carbon Quiz
        </button>
      </Card>

      <Card title="Profile" action={<User className="w-5 h-5 text-eco-400" />}>
        <div className="space-y-4">
          <div>
            <label className="label" htmlFor="settings-name">Name</label>
            <input
              id="settings-name"
              type="text"
              className="input-field"
              value={localProfile.name}
              onChange={(e) => setLocalProfile({ ...localProfile, name: e.target.value })}
            />
          </div>
          <div>
            <label className="label" htmlFor="settings-location">Location</label>
            <select
              id="settings-location"
              className="input-field"
              value={localProfile.location}
              onChange={(e) => setLocalProfile({ ...localProfile, location: e.target.value })}
            >
              <option value="mumbai">Mumbai</option>
              <option value="metro">Other Metro City</option>
              <option value="tier2">Tier 2/3 City</option>
              <option value="rural">Rural Area</option>
            </select>
          </div>
          <button className="btn-primary w-full" onClick={handleSaveProfile}>
            Save Profile
          </button>
        </div>
      </Card>

      <Card title="Goals" action={<Target className="w-5 h-5 text-eco-400" />}>
        <div className="space-y-4">
          <div>
            <label className="label" htmlFor="settings-daily-target">Daily Target (kg CO₂e)</label>
            <input
              id="settings-daily-target"
              type="number"
              className="input-field"
              min="1"
              step="0.1"
              value={localGoals.dailyTarget}
              onChange={(e) =>
                setLocalGoals({ ...localGoals, dailyTarget: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <label className="label" htmlFor="settings-monthly-target">Monthly Target (kg CO₂e)</label>
            <input
              id="settings-monthly-target"
              type="number"
              className="input-field"
              min="10"
              step="1"
              value={localGoals.monthlyTarget}
              onChange={(e) =>
                setLocalGoals({ ...localGoals, monthlyTarget: Number(e.target.value) })
              }
            />
          </div>
          <button className="btn-primary w-full" onClick={handleSaveProfile}>
            Save Goals
          </button>
        </div>
      </Card>

      <Card title="Export">
        <div className="space-y-3">
          <button
            className="btn-secondary w-full flex items-center justify-center gap-2"
            onClick={handleExportPDF}
          >
            <FileText className="w-4 h-4" />
            Export Monthly PDF Report
          </button>
          <button
            className="btn-secondary w-full flex items-center justify-center gap-2"
            onClick={handleExportJSON}
          >
            <Download className="w-4 h-4" />
            Export Data (JSON)
          </button>
        </div>
      </Card>

      <Card title="Import Data">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleImportJSON}
        />
        <button
          className="btn-outline w-full flex items-center justify-center gap-2"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-4 h-4" />
          Import JSON Backup
        </button>
        {importMessage && (
          <p
            className={`text-sm mt-3 ${
              importMessage.type === 'success' ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {importMessage.text}
          </p>
        )}
      </Card>

      <Card title="Danger Zone">
        {!showResetConfirm ? (
          <button
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            onClick={() => setShowResetConfirm(true)}
          >
            <Trash2 className="w-4 h-4" />
            Reset All Data
          </button>
        ) : (
          <div className="text-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <p className="text-sm text-eco-700 dark:text-eco-300 mb-4">
              This will permanently delete all your data including logs, badges, and settings.
              This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                className="btn-secondary flex-1"
                onClick={() => setShowResetConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
                onClick={handleReset}
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        )}
      </Card>

      <p className="text-center text-xs text-eco-400 pb-4">
        EcoTrack v1.0 · Frontend-only · Data stored in localStorage
      </p>
    </div>
  );
}