const KEY = "wc_trial_data";
const OLD_KEY = "wc_trials"; // 兼容旧版本
export const MAX_DAILY_FREE = 2;

type TrialData = {
  count: number;
  date: string; // YYYY-MM-DD
};

function getTodayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function getTrialData(): TrialData {
  try {
    // 1. 尝试读取新格式
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const data = JSON.parse(raw) as TrialData;
      const today = getTodayStr();
      // 如果日期过期，重置
      if (data.date !== today) {
        return { count: 0, date: today };
      }
      return data;
    }

    // 2. 如果没有新格式，尝试读取旧格式并迁移
    const oldRaw = localStorage.getItem(OLD_KEY);
    if (oldRaw) {
      // 旧数据没有日期概念，直接作废或继承？
      // 为了用户体验，我们大度一点，直接重置，让他今天爽一下
      localStorage.removeItem(OLD_KEY);
      return { count: 0, date: getTodayStr() };
    }

    return { count: 0, date: getTodayStr() };
  } catch {
    return { count: 0, date: getTodayStr() };
  }
}

export function getTrialCount(): number {
  return getTrialData().count;
}

export function getRemainingFreeCount(): number {
  const used = getTrialCount();
  return Math.max(0, MAX_DAILY_FREE - used);
}

export function incrementTrialCount(): number {
  const data = getTrialData();
  data.count += 1;
  data.date = getTodayStr(); // 刷新时间
  
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {}
  return data.count;
}
