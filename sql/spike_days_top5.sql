-- NEARPulse AI: top 5 receiver accounts by function-call actions on three spike days
-- Source: bigquery-public-data.crypto_near_mainnet_us.receipt_actions
-- Days: 2026-10-10, 2026-10-11, 2026-10-15
-- share_pct = account's calls / all function-call actions that day

WITH per_contract AS (
  SELECT
    block_date,
    receipt_receiver_account_id AS contract_account,
    COUNT(*) AS calls
  FROM `bigquery-public-data.crypto_near_mainnet_us.receipt_actions`
  WHERE block_date IN (DATE '2026-10-10', DATE '2026-10-11', DATE '2026-10-15')
    AND action_kind = 'FUNCTION_CALL'
  GROUP BY block_date, contract_account
),
ranked AS (
  SELECT
    *,
    ROW_NUMBER() OVER (PARTITION BY block_date ORDER BY calls DESC) AS rn,
    SUM(calls) OVER (PARTITION BY block_date) AS day_total
  FROM per_contract
)
SELECT
  block_date,
  rn AS rank,
  contract_account,
  calls,
  day_total,
  ROUND(100 * calls / day_total, 1) AS share_pct
FROM ranked
WHERE rn <= 5
ORDER BY block_date, rn