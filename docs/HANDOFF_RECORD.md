# Study Planner handoff

Group 10 | 13 November 2026

The review branch adds a preview before students send activity details to OpenRouter. The server verifies that the model and provider route are free. The updated plan gives students specific study tasks, groups sessions by day, and flags deadlines that have already passed.

## Automated checks

33 backend tests and 18 web tests passed. Web lint and the production build passed. The backend tests cover authorization, personal activity access, completion, and persistence after reopening the database.

## Live OpenRouter check

On 12 November, the first test used up its output budget on reasoning. Disabling optional reasoning let `nvidia/nemotron-3.5-lightning:free` return a plan. The OpenRouter activity log showed a completed request at $0.00. Later checks returned three different tasks for one overdue activity and covered ten selected activities across three days within the daily time limit.

## Android account check

On 13 November, Hifa saved **Private review practice** on the web as Budi Santoso. After refreshing Study Planner on Android, Budi could see it as **Personal**. Budi marked **Review authentication flow** complete, and the activity list showed the updated status.

After switching to Demo Student B on the same phone, the two shared class activities appeared. **Review authentication flow** showed **Not completed** for the second student, and Budi’s personal activity was absent. The screenshots from the web, Android, and OpenRouter were saved locally with the review.
