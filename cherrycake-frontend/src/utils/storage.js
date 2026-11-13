export function getStorageItem(key, defaultValue = null) {
  try {
    const val = localStorage.getItem(key);
    if (val === null) return defaultValue;
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  } catch {
    return defaultValue;
  }
}

export function setStorageItem(key, value) {
  try {
    if (typeof value === 'object' && value !== null) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, String(value));
    }
  } catch (err) {
    console.error('Failed to set localStorage', err);
  }
}

export function removeStorageItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error('Failed to remove localStorage item', err);
  }
}