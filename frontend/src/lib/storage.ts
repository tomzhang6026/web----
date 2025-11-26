const KEY = "wc_trials";

export function getTrialCount(): number {
  try {
    const v = localStorage.getItem(KEY);
    return v ? parseInt(v, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

export function incrementTrialCount(): number {
  const next = getTrialCount() + 1;
  try {
    localStorage.setItem(KEY, String(next));
  } catch {}
  return next;
}


