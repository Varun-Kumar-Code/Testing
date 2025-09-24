How to keep the Render service awake

Render web services on free plans may be suspended after inactivity. To reduce chance of sleeping:

- Use a paid plan with "always on" guarantees.
- Expose a /health endpoint (already present). Configure Render health check to hit /health every minute.
- Use Render cron jobs or an external uptime monitor (UptimeRobot, Cronitor) to periodically ping /health.

GitHub Actions keep-awake workflow

- This repo includes a GitHub Actions workflow at `.github/workflows/keep-awake.yml` which periodically pings a URL you provide to keep the service active.
- The workflow reads the URL from the repository secret named `KEEP_AWAKE_URL` and issues a GET request on a 15-minute schedule.
- To set it up:
	1. In your GitHub repository, go to Settings -> Secrets -> Actions -> New repository secret.
	2. Name the secret `KEEP_AWAKE_URL` and set the value to the public URL of your Render service (for example `https://genai-prototype-web.onrender.com/health`).
	3. Commit and push the repository; the action will run on the schedule and you can also trigger it manually from the Actions tab.

Notes and cautions

- Avoid storing sensitive tokens in the `KEEP_AWAKE_URL`; it should be the public health endpoint only.
- GitHub Actions has execution limits for free accounts; adjust the schedule if you hit rate limits (the current cron runs every 15 minutes).
- If you prefer not to use GitHub Actions, use an external uptime monitor (UptimeRobot, Cronitor) or Render's own cron/health-check features.

Security notes

- Store secrets (API keys, private keys) in Render environment variables (Dashboard -> Environment).
- Do NOT commit .env or service-account JSON files to the repo. Use the deployed platform's secrets store.
