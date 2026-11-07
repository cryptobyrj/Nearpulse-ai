-- NEARPulse AI: daily function-call actions, distinct receiver contracts, top-5 concentration
-- Source: bigquery-public-data.crypto_near_mainnet_us.receipt_actions
-- Date range: 2026-08-06 to 2026-11-04 (inclusive)
-- Note: one row per action, so one transaction can produce several function-call actions.
-- "distinct_contracts" = receiver accounts with at least one FUNCTION_CALL action that day.

WITH per_contract AS (
  SELECT
    block_date,
    receipt_receiver_account_id AS contract_account,
    COUNT(*) AS calls
  FROM `bigquery-public-data.crypto_near_mainnet_us.receipt_actions`
  WHERE block_date BETWEEN DATE '2026-08-06' AND DATE '2026-11-04'
    AND action_kind = 'FUNCTION_CALL'
  GROUP BY block_date, contract_account
),
ranked AS (
  SELECT
    *,
    ROW_NUMBER() OVER (PARTITION BY block_date ORDER BY calls DESC) AS rn
  FROM per_contract
)
SELECT
  block_date,
  SUM(calls) AS function_call_actions,
  COUNT(*) AS distinct_contracts,
  SUM(IF(rn <= 5, calls, 0)) AS top5_calls
FROM ranked
GROUP BY block_date
ORDER BY block_date