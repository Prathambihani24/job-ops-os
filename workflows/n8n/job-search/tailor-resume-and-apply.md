# Tailor Resume and Apply Workflow

## Goal

Turn a job posting into a tailored resume draft, an outreach draft for the point of contact, and a tracked job application record.

## Trigger

- Manual trigger from the dashboard
- Form submission with a job URL or pasted job description
- Future: webhook from lead providers or job boards

## Inputs

- master resume profile
- job title
- company name
- job description
- contact name, role, and email if available

## Nodes

1. Normalize the job posting
2. Load the master resume profile
3. Tailor the resume
4. Draft outreach
5. Save the application record to Supabase
6. Send the email when credentials are connected
7. Notify Slack with the outcome
8. Refresh the dashboard summary

## Error handling

- If tailoring fails, save the raw job posting and show a draft-only status
- If email sending fails, keep the application as `sent` only after successful delivery
- If Supabase is unavailable, keep the result in a local fallback and retry later

## Outcome tracking

The workflow must write:

- application status
- applied timestamp
- reply status
- interview status
- offer status
- follow-up task

## Why this matters

This is the heart of the GTM OS. It turns a job opportunity into a repeatable system: understand the role, tailor the resume, reach out to the right person, and keep the pipeline visible in the dashboard.
