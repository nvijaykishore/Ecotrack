const MAX_QUANTITY = {
  electricity: 500,
  transport: 2000,
  food: 50,
  home: 100,
  shopping: 100,
};

const MAX_NOTES_LENGTH = 200;

export function sanitizeNotes(notes = '') {
  return String(notes)
    .trim()
    .slice(0, MAX_NOTES_LENGTH)
    .replace(/<[^>]*>/g, '');
}

/**
 * Validates log input before persistence.
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateLogInput({ category, itemId, quantity, date, notes }) {
  const errors = [];

  if (!category) errors.push('Category is required.');
  if (!itemId) errors.push('Activity is required.');

  const qty = Number(quantity);
  if (!quantity || Number.isNaN(qty) || qty <= 0) {
    errors.push('Quantity must be a positive number.');
  } else if (qty > (MAX_QUANTITY[category] ?? 1000)) {
    errors.push(`Quantity seems unrealistic (max ${MAX_QUANTITY[category] ?? 1000} for ${category}).`);
  }

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.push('Invalid date format.');
  } else {
    const today = new Date().toISOString().split('T')[0];
    if (date > today) errors.push('Date cannot be in the future.');
  }

  if (notes && sanitizeNotes(notes).length === 0 && notes.trim().length > 0) {
    errors.push('Notes contain invalid characters.');
  }

  return { valid: errors.length === 0, errors };
}