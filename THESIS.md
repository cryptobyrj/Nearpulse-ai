# THESIS: Is NEAR mainnet usage broadening?

Analysis date: 2026-11-06. Data: two historical snapshots covering 2026-08-06 to 2026-11-04. This is not live data.

## Research hypothesis

NEAR mainnet usage is broadening when transaction counts, distinct transaction signers, and contract function-call activity are considered together.

This is a hypothesis to investigate, not a conclusion that must be proven.

## Result

Mixed. On this evidence the hypothesis is neither confirmed nor rejected.

## Evidence supporting the hypothesis

- Latest 7 days (2026-10-29 to 2026-11-04) against the previous 7 days (2026-10-22 to 2026-10-28): average daily distinct signers rose 7.1% (51,827 to 55,529) and average daily transactions rose 3.4% (577,201 to 596,965). This rise depends on the last two days of the window (see limitations).
- Distinct receiver contracts with at least one function-call action were between 832 and 921 per day from 2026-08-06 to 2026-08-13, and between 1,137 and 1,523 per day from 2026-10-16 to 2026-10-31. The reason for the rise is not verified.

## Evidence against the hypothesis

- Latest 30 days (2026-10-06 to 2026-11-04) against the previous 30 days (2026-09-06 to 2026-10-05): average daily transactions fell 17.7% (832,538 to 684,948) and average daily distinct signers fell 13.4% (71,203 to 61,647).
- The latest 7-day averages are below the 91-day medians: signers 55,529 against a median of 70,014, transactions 596,965 against a median of 691,420.
- On 2026-10-10, 2026-10-11 and 2026-10-15, function-call actions were 7,455,968, 12,700,267 and 11,615,182 against a median of 1,482,979 per day. The top 5 receiver accounts held 69.5%, 87.4% and 91.4% of actions on those days (snapshot median share: 47.2%), and distinct receiver contracts did not rise (1,477, 1,524, 1,476).
- On those three days one receiver account took the largest share of function-call actions: `cooldogsclub.near` held 30.5% (2026-10-10) and 67.3% (2026-10-11), and `embr.playember_reserve.near` held 85.2% (2026-10-15). What these accounts are, and why they received so many calls, was not investigated.
- Distinct signers were unusually high on several days in early October (for example 176,719 on 2026-10-03 and 177,196 on 2026-10-04) against a median of 70,014. The cause is not verified.

## Limitations

- Historical snapshots, not live data. Transactions and signers snapshot taken 2026-11-05; function calls snapshot taken 2026-11-06.
- Only 91 days are covered.
- The latest 7-day window includes 2026-11-03 and 2026-11-04, when distinct signers jumped (48,060 on 11-02, 72,343 on 11-03, 79,164 on 11-04). The other 5 days of that window averaged 47,440 signers per day, below the 51,827 of the previous 7 days. The cause of the jump is not verified, so the +7.1% change should be read with caution.
- Without 2026-11-03 and 2026-11-04, the other 5 days of the latest 7-day window averaged 574,975 transactions per day, against 577,201 in the previous 7 days. The +3.4% change in transactions therefore also depends on those two days.
- Distinct signers is not unique users and not all active accounts.
- Function-call actions count actions, not transactions. One transaction can create several actions, so the two counts are not directly comparable.
- The causes of the October signer elevation and of the 10, 11 and 15 October function-call spikes were not investigated.
- Window comparisons depend on the chosen dates, and the 30-day windows contain the unexplained high days.
- The final day (2026-11-04) is the last complete day at snapshot time; the day in progress was excluded.
- No statement is made about token price.

## What future evidence would change the conclusion

- Evidence that the October signer elevation and the October function-call spikes came from a small number of automated accounts or one application would weaken the broadening reading for those periods.
- A longer history in which signers, transactions and distinct receiver contracts rise together over several months would strengthen the hypothesis.
- Top-5 receiver share staying near the snapshot median while total actions grow would support broadening. Repeated spikes dominated by a few receivers would weaken it.
- Measuring how many signers are new or returning, which these snapshots cannot do, would test participation directly.

## Reproduce

SQL files are in `sql/`, data snapshots in `data/`. The Data Explorer page of the app shows each query with its source table and definition. See `README.md` for steps.