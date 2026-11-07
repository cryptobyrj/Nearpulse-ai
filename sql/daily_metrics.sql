-- NEARPulse AI: daily transactions and distinct transaction signers
-- Source: bigquery-public-data.crypto_near_mainnet_us.transactions
-- Date range: 2026-08-06 to 2026-11-04 (inclusive)
-- Note: block_date is the partition column, so the date filter limits cost.

SELECT
  block_date,
  COUNT(*) AS transaction_count,
  COUNT(DISTINCT signer_account_id) AS distinct_signers
FROM `bigquery-public-data.crypto_near_mainnet_us.transactions`
WHERE block_date BETWEEN DATE '2026-08-06' AND DATE '2026-11-04'
GROUP BY block_date
ORDER BY block_date