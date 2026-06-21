export const STORAGE_QUOTA_EVENT = 'ecotrack-storage-quota-exceeded';

export const safeLocalStorage = {
  getItem(name) {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem(name, value) {
    try {
      localStorage.setItem(name, value);
    } catch (error) {
      if (error?.name === 'QuotaExceededError') {
        window.dispatchEvent(new CustomEvent(STORAGE_QUOTA_EVENT, {
          detail: { message: 'Storage full. Export your data, then delete old logs.' },
        }));
      }
      throw error;
    }
  },
  removeItem(name) {
    try {
      localStorage.removeItem(name);
    } catch {
      /* ignore */
    }
  },
};