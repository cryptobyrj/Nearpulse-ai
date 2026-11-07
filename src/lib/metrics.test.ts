import { describe, expect, it } from "vitest";
import { compareWindows, transactionsPerSigner, type DailyRow } from "./metrics";

function makeRows(values: number[]): DailyRow[] {
  return values.map((v, i) => ({
    date: `2026-01-${String(i + 1).padStart(2, "0")}`,
    transactionCount: v,
    distinctSigners: v / 10,
  }));
}

describe("compareWindows", () => {
  it("computes the % change between two 7-day windows", () => {
    const rows = makeRows([...Array(7).fill(100), ...Array(7).fill(150)]);
    const c = compareWindows(rows, "transactionCount", 7);
    expect(c).not.toBeNull();
    expect(c!.previousAvg).toBe(100);
    expect(c!.currentAvg).toBe(150);
    expect(c!.changePct).toBeCloseTo(50);
  });

  it("shows a negative change when activity falls", () => {
    const rows = makeRows([...Array(7).fill(200), ...Array(7).fill(100)]);
    expect(compareWindows(rows, "transactionCount", 7)!.changePct).toBeCloseTo(-50);
  });

  it("returns the correct date ranges", () => {
    const rows = makeRows(Array(14).fill(100));
    const c = compareWindows(rows, "transactionCount", 7)!;
    expect(c.previousRange).toBe("2026-01-01 to 2026-01-07");
    expect(c.currentRange).toBe("2026-01-08 to 2026-01-14");
  });

  it("returns null when there is not enough data", () => {
    const rows = makeRows(Array(13).fill(100));
    expect(compareWindows(rows, "transactionCount", 7)).toBeNull();
  });

  it("returns null changePct when the previous average is zero", () => {
    const rows = makeRows([...Array(7).fill(0), ...Array(7).fill(100)]);
    expect(compareWindows(rows, "transactionCount", 7)!.changePct).toBeNull();
  });
});

describe("transactionsPerSigner", () => {
  it("divides transactions by signers", () => {
    expect(
      transactionsPerSigner({ date: "2026-01-01", transactionCount: 900, distinctSigners: 300 })
    ).toBe(3);
  });

  it("returns 0 when there are no signers", () => {
    expect(
      transactionsPerSigner({ date: "2026-01-01", transactionCount: 900, distinctSigners: 0 })
    ).toBe(0);
  });
});