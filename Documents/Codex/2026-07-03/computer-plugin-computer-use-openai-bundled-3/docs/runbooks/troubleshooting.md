# Troubleshooting Guide

## API will not start

Probable causes:

- missing required environment variables
- invalid `PORT`

Resolution:

- run `node ./scripts/check-env.mjs`
- compare `.env` with `.env.example`

## Health check fails in Docker

Probable causes:

- API process did not bind to port `3000`
- container crashed during startup

Resolution:

- inspect container logs
- verify `PORT=3000`

## n8n restarts repeatedly

Probable causes:

- invalid `N8N_ENCRYPTION_KEY`
- missing volume permissions

Resolution:

- set a durable encryption key
- recreate the container after fixing the key

## Optional provider requests fail

Probable causes:

- invalid or expired provider token
- provider-side rate limit
- plugin was configured without its required credentials

Resolution:

- rotate credentials
- confirm whether the provider is optional or part of the free core
- keep plugin-specific failures isolated from the free core workflow
