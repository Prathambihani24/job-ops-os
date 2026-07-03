# n8n Conventions

This directory is reserved for exported workflows and workflow documentation.

Why it exists:

- workflow JSON should be versioned
- operational notes should sit beside workflow definitions
- reviewers should be able to inspect automation logic without logging into n8n

Recommended future structure:

- `workflows/` for exported workflow JSON
- `credentials/` for redacted credential templates
- `runbooks/` for failure handling notes
