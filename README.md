# NEARPulse AI

The intelligence layer for the NEAR ecosystem.

NEARPulse AI is an evidence-first analytics and research app built for NEAR Hackathon 2026 (Investment Thesis track). It investigates one hypothesis with real NEAR mainnet data: is usage broadening when transactions, distinct transaction signers and contract function-call activity are considered together?

The data is a historical snapshot, not live data. No token price predictions are made.

## Features

- **Network Pulse**: daily transactions, distinct signers, function-call actions, 7-day and 30-day comparisons, charts.
- **Ask NEAR AI**: questions answered only from the verified snapshot. Uses an OpenAI-compatible model (NEAR AI Cloud) when configured, and built-in explanations otherwise. Each answer shows which mode produced it.
- **Research Reports**: evidence for and against, limitations, sources. Download as Markdown.
- **Data Explorer**: the SQL, source table, definition and snapshot date for every metric.

## Data and reproducibility

Source: NEAR public dataset in Google BigQuery, `bigquery-public-data.crypto_near_mainnet_us` ([docs](https://docs.near.org/data-infrastructure/big-query)).

| Snapshot | SQL | Data |
| --- | --- | --- |
| Transactions and distinct signers | `sql/daily_metrics.sql` | `data/daily_metrics.csv` |
| Function-call actions and receiver contracts | `sql/function_calls_daily.sql` | `data/function_calls_daily.csv` |

Both cover 2026-08-06 to 2026-11-04 (91 days). Snapshot details are in `data/snapshot_meta.json` and `data/function_calls_meta.json`.

To reproduce: open the BigQuery console (the free sandbox is enough), paste a SQL file, check the "This query will process" estimate, run it, and compare with the matching CSV.

Metric definitions:

- Transactions: rows in `transactions` per `block_date`.
- Distinct signers: distinct `signer_account_id` per day. Not unique users, not all active accounts.
- Function-call actions: rows in `receipt_actions` with `action_kind = 'FUNCTION_CALL'` per day. Not a transaction count.
- Distinct receiver contracts: distinct `receipt_receiver_account_id` with at least one function-call action that day.

## Run it locally

Requires Node.js (LTS or newer).

```
npm install
npm run dev
```

Open http://localhost:3000.

## Tests and data checks

```
npx vitest run
npx tsc --noEmit
node scripts/check-data.js
node scripts/verify-cards.js
```

`scripts/` also holds the CSV-to-JSON converters used to prepare the snapshots.

## Optional: enable the AI model

Without any setup, Ask NEAR AI uses its built-in explanations. To use NEAR AI Cloud:

1. Create an account at https://cloud.near.ai, add credits and generate an API key.
2. Copy `.env.example` to `.env.local` and fill in `NEARAI_API_KEY` and `NEARAI_MODEL` (pick a model ID from https://cloud-api.near.ai/v1/model/list).
3. Restart `npm run dev`.

Keys stay on the server and are never sent to the browser. `.env.local` is git-ignored. Never commit it.

## Project structure

```
sql/        SQL queries
data/       snapshots (CSV, JSON) and metadata
scripts/    data checks and converters
src/app/    pages and API routes (/api/ask, /api/report)
src/lib/    metrics, report, Ask logic, tests
```

## Limitations

See `THESIS.md` and the Research Reports page. In short: 91 days only, distinct signers is not unique users, several spikes have unverified causes, and the data is a snapshot.


## Live demo and how to try it

Live app: https://nearpulse-ai.vercel.app

1. Open Network Pulse. You should see four cards: last 7 days, transactions 596,965 (+3.4%) and distinct signers 55,529 (+7.1%); last 30 days, transactions 684,948 (-17.7%) and distinct signers 61,647 (-13.4%).
2. Open Data Explorer. Copy a SQL query into the BigQuery console, run it, and compare with the CSV files in `data/`.
3. Open Ask NEAR AI and ask: `Which day had the highest signers?` The answer should be 2026-10-04 with 177,196 distinct signers, and it should say the cause is not verified.
4. Ask in Hinglish: `4 Oct ko signers itne kyun the?` The answer should come in Hinglish.
5. Open Research Reports and download the Markdown file.
6. Locally, run `npx vitest run`. You should see 7 tests passed.

## How Ask NEAR AI works

The live app sends each question to an OpenAI-compatible model on NEAR AI Cloud, together with a list of verified metrics from the snapshots. After the model answers, the app checks that every number in the answer appears in that list. If a number does not match, the model answer is dropped and a built-in explanation is shown instead. Price questions never reach the model. A simple rate limit also falls back to the built-in mode. Each answer shows which mode produced it.

## Built with

Next.js, React, TypeScript, Tailwind CSS, Recharts, Vitest. The data comes from the public NEAR dataset in Google BigQuery. The AI model runs through NEAR AI Cloud.

## AI assistance disclosure

This project was built by one person with an AI coding assistant (Claude by Anthropic). The assistant helped write the code, SQL and documentation. The BigQuery queries were run by the author, who checked the results against the CSV files and the tests.

## License

MIT, see `LICENSE`.