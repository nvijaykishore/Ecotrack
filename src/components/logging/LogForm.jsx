import { useState, useEffect } from 'react';
import { LOG_CATEGORIES } from '../../data/emissionFactors';
import { getTodayString } from '../../utils/calculations';

export default function LogForm({ onSubmit, initialLog, onCancel, submitLabel = 'Save Entry', errors = [] }) {
  const [category, setCategory] = useState('transport');
  const [itemId, setItemId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState(getTodayString());
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialLog) {
      setCategory(initialLog.category);
      setItemId(initialLog.itemId);
      setQuantity(String(initialLog.quantity));
      setDate(initialLog.date);
      setNotes(initialLog.notes || '');
    } else {
      setCategory('transport');
      setItemId('');
      setQuantity('');
      setDate(getTodayString());
      setNotes('');
    }
  }, [initialLog]);

  const selectedCategory = LOG_CATEGORIES.find((c) => c.id === category);
  const selectedItem = selectedCategory?.items.find((i) => i.id === itemId);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setItemId('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!itemId || !quantity || Number(quantity) <= 0) return;

    onSubmit({
      category,
      itemId,
      itemLabel: selectedItem?.label || itemId,
      quantity: Number(quantity),
      unit: selectedItem?.unit || '',
      date,
      notes,
    });

    if (!initialLog) {
      setQuantity('');
      setNotes('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label={initialLog ? 'Edit activity log' : 'New activity log'}>
      {errors.length > 0 && (
        <div
          role="alert"
          aria-live="assertive"
          className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300"
        >
          <ul className="list-disc list-inside space-y-1">
            {errors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <label className="label">Category</label>
        <div className="flex flex-wrap gap-2">
          {LOG_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === cat.id
                  ? 'bg-eco-600 text-white'
                  : 'bg-eco-100 dark:bg-eco-800 text-eco-700 dark:text-eco-300 hover:bg-eco-200 dark:hover:bg-eco-700'
              }`}
              onClick={() => handleCategoryChange(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label" htmlFor="log-activity">Activity</label>
        <select
          id="log-activity"
          className="input-field"
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
          required
          aria-required="true"
        >
          <option value="">Select activity...</option>
          {selectedCategory?.items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label} ({item.factor} kg CO₂/{item.unit})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="log-quantity">
            Quantity {selectedItem ? `(${selectedItem.unit})` : ''}
          </label>
          <input
            id="log-quantity"
            type="number"
            className="input-field"
            min="0.01"
            step="0.01"
            placeholder="e.g. 10"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="log-date">Date</label>
          <input
            id="log-date"
            type="date"
            className="input-field"
            value={date}
            max={getTodayString()}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="log-notes">Notes (optional)</label>
        <input
          id="log-notes"
          type="text"
          className="input-field"
          placeholder="e.g. Office commute, dinner out..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {selectedItem && quantity > 0 && (
        <div className="p-3 rounded-xl bg-eco-100 dark:bg-eco-800 text-sm">
          <span className="text-eco-600 dark:text-eco-400">Estimated emissions: </span>
          <span className="font-semibold text-eco-800 dark:text-eco-100">
            {(selectedItem.factor * Number(quantity)).toFixed(2)} kg CO₂e
          </span>
        </div>
      )}

      <div className="flex gap-3">
        {onCancel && (
          <button type="button" className="btn-secondary flex-1" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn-primary flex-1"
          disabled={!itemId || !quantity}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}