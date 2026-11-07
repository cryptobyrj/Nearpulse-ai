import dailyMetrics from "../../data/daily_metrics.json";
import functionCalls from "../../data/function_calls_daily.json";
import snapshotMeta from "../../data/snapshot_meta.json";
import type { DailyRow } from "./metrics";

export type FunctionCallRow = {
  date: string;
  functionCallActions: number;
  distinctContracts: number;
  top5Calls: number;
};

export const dailyRows: DailyRow[] = dailyMetrics as DailyRow[];
export const functionCallRows: FunctionCallRow[] = functionCalls as FunctionCallRow[];
export const meta = snapshotMeta;