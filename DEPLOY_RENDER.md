Render Deployment Guide for Gen-AI-Hackathon-Prototype

This file explains how to deploy the project to Render, what environment variables to set, and how to upload only the safe files to GitHub (excluding `.env*` and `node_modules`).

1) What the Render manifest does
- `render.yaml` defines a single web service that runs `npm install && npm run build` during build and `npm start` to run the server.
- The service uses `/health` as a health check endpoint. Make sure your server responds to GET /health with 200.

2) Required environment variables (set these in Render Dashboard -> Service -> Environment)
- SERVICE_ACCOUNT_PROJECT_ID
- SERVICE_ACCOUNT_PRIVATE_KEY (preserve newlines; if you copy/paste from a .env file, replace literal `\n` with newlines or set as a secret value)
- SERVICE_ACCOUNT_CLIENT_EMAIL
- VITE_GEMINI_API_KEY (if used)
- VITE_FIREBASE_API_KEY (if used)
- Any other API keys or DB connection strings used by the app

3) How to upload safely to GitHub
- Ensure `.gitignore` contains `node_modules/`, `.env`, `.env.*`, and `Firebase - Auth/backend/*.json` (already present in this repo).
- If you prefer to create a ZIP for manual upload that excludes `node_modules` and `.env*`, use the PowerShell command below.

PowerShell ZIP (runs on Windows PowerShell):

Compress-Archive -Path (Get-ChildItem -Path . -Recurse -File | Where-Object { $_.FullName -notmatch "\\.env($|\.)" -and $_.FullName -notmatch "\\node_modules\\" -and $_.FullName -notmatch "Firebase - Auth\\backend\\.*\\.json$" } | ForEach-Object { $_.FullName }) -DestinationPath genai-prototype-upload.zip

4) How to set up secrets on Render
- In the Render Dashboard > Environment > Environment Variables, add each SERVICE_ACCOUNT_* value and any API keys. Use the "Secret" toggle for private values.
- For SERVICE_ACCOUNT_PRIVATE_KEY: when copying a private key that contains real newlines, Render's UI accepts the raw key with newlines. If you only have an escaped `\n` string in your .env, replace `\n` with actual newlines before pasting.

5) Build & Start
- Render already runs `npm install && npm run build` during build (from `render.yaml`).
- `npm start` runs `node dist/index.js` in production.

6) Keep the service awake (if on a paid plan)
- The `free` plan may sleep; if you need always-on, choose a paid plan in the Render Dashboard.

7) Troubleshooting
- If the server fails to start on Render, check the build logs for missing environment variables. Common failure modes:
  - Missing SERVICE_ACCOUNT_PRIVATE_KEY -> Firebase admin initialization will fail.
  - Build errors due to native modules -> ensure optional dependencies like `bufferutil` are optional or prebuilt.

8) Rotating secrets
- If the service account or any keys were ever exposed in the repo history, rotate them in your provider (Firebase / Gemini) and update Render env vars.

If you'd like, I can also create a small shell script to help prepare the safe upload ZIP or stage only the files to push to a new GitHub repository.
