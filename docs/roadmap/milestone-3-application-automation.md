# Milestone 3: Application Automation

## What this milestone adds

- a resume tailoring service that aligns your master resume to each job description
- an application launch endpoint that creates outreach drafts and application records
- live dashboard data sourced from Supabase when credentials are present
- tracked outcomes so applications can move from `draft` to `sent`, `reply_received`, `interviewing`, and `offer`

## What it means for the workflow

The system now has the backbone for true automation:

1. take a job description
2. tailor the resume
3. identify the point of contact
4. draft the outreach
5. save the application record
6. surface the result on the dashboard

## What still depends on external setup

- email credentials for actually sending the outreach
- a job source or lead source with real postings
- a recurring n8n trigger for hands-free operation

## Interview framing

This milestone shows that the project is not just a dashboard. It is a workflow engine for job search and future GTM motions.
