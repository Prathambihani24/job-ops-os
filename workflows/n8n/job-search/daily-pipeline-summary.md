# Daily Pipeline Summary Workflow

## Trigger

- Cron trigger at 7:30 PM local time

## Nodes

1. Query opportunities from Supabase
2. Group by stage and owner
3. Generate AI summary with Ollama
4. Post digest to Slack
5. Write run log to `activity_timeline`

## Error handling

- Retry AI and Slack nodes up to 2 times
- Send a fallback Slack message if AI summarization fails
- Persist node failure payloads for debugging

## Why this matters

This workflow demonstrates that GTM engineering is about operational leverage. Instead of manually reviewing the pipeline every night, the system turns raw data into an actionable summary.
