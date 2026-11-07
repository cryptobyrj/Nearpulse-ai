export type DailyRow = {
  date: string;
  transactionCount: number;
  distinctSigners: number;
};

export type Comparison = {
  currentAvg: number;
  previousAvg: number;
  changePct: number | null;
  currentRange: string;
  previousRange: string;
};

function average(values: number[]): number {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * Compares the average of the most recent `days` rows with the average of the
 * `days` rows immediately before them. Returns null if there is not enough data.
 */
export function compareWindows(
  rows: DailyRow[],
  field: "transactionCount" | "distinctSigners",
  days: number
): Comparison | null {
  if (rows.length < days * 2) return null;

  const current = rows.slice(-days);
  const previous = rows.slice(-days * 2, -days);

  const currentAvg = average(current.map((r) => r[field]));
  const previousAvg = average(previous.map((r) => r[field]));

  return {
    currentAvg,
    previousAvg,
    changePct:
      previousAvg === 0 ? null : ((currentAvg - previousAvg) / previousAvg) * 100,
    currentRange: `${current[0].date} to ${current[current.length - 1].date}`,
    previousRange: `${previous[0].date} to ${previous[previous.length - 1].date}`,
  };
}

/** Average number of transactions per distinct signer for a single day. */
export function transactionsPerSigner(row: DailyRow): number {
  return row.distinctSigners === 0 ? 0 : row.transactionCount / row.distinctSigners;
}