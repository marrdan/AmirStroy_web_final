// Safe wrappers around localStorage: the site must work when storage is empty, blocked or damaged.

function readJSON(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    if (saved === null) {
      return fallback;
    }
    return JSON.parse(saved);
  } catch (error) {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
}

function removeKey(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    // nothing to remove
  }
}

// Always returns an array, even if the saved value was damaged
function readList(key) {
  const value = readJSON(key, []);
  return Array.isArray(value) ? value : [];
}
