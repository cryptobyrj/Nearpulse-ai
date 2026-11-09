const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 8;
const DAILY_MAX = 400;

const hits = new Map<string, number[]>();
let dayKey = "";
let dayCount = 0;

export function allowAiCall(ip: string): boolean {
  const now = Date.now();
  const today = new Date(now).toISOString().slice(0, 10);
  if (today !== dayKey) {
    dayKey = today;
    dayCount = 0;
  }
  if (dayCount >= DAILY_MAX) return false;

  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  dayCount += 1;

  if (hits.size > 5000) hits.clear();
  return true;
}