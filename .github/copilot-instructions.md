# Copilot / AI Agent Instructions for Flask-portfolio

This repository is a small single-service Flask portfolio site. The notes below highlight the concrete, discoverable patterns and commands an AI coding agent should know to be productive here.

- **Big picture:** A single Flask app exposes four primary page routes and a contact form. UI is static templates in `templates/` and assets in `static/`. There is no database or external API besides SMTP and optional New Relic monitoring.

- **Key files/entry points:**
  - `app.py` — primary Flask app (development entrypoint). Routes: `/`, `/about`, `/portfolio`, `/contact`, `/submit`.
  - `wsgi.py` — exposes the `app` object for WSGI servers (use `gunicorn wsgi:app`).
  - `templates/` — Jinja templates used by routes. `navbar.html` is currently returned for `/`.
  - `static/` — CSS and JS assets.
  - `Dockerfile` — present but currently inconsistent with repository (see notes).
  - `newrelic.ini` — New Relic agent config placeholder (license key expected via ENV).

- **How to run locally (developer):**
  - Quick start (development):
    - `python3 app.py` — app listens on `0.0.0.0:8000` per `app.run`.
  - Using Flask CLI (alternate):
    - `export FLASK_APP=app.py` and `flask run --host=0.0.0.0 --port=8000`
  - WSGI in production (recommended for deployments):
    - `gunicorn wsgi:app -b 0.0.0.0:8000`

- **Docker notes:**
  - The `Dockerfile` currently runs `/usr/app/main.py` which does not exist in this repo. Building the image as-is will not start the app. Two options for agents:
    1. Edit `Dockerfile` to use `CMD ["python3","/usr/app/app.py"]` (or run Gunicorn), then `docker build -t flask-portfolio .` and `docker run -p 8000:8000 flask-portfolio`.
    2. Skip Docker for quick local work and use `python3 app.py`.

- **Secrets & configuration:**
  - `app.py` contains hard-coded SMTP credentials and emails. Treat these as secrets:
    - DO NOT commit or leak real credentials. Prefer `os.environ` for `SENDER_EMAIL`, `SENDER_PASSWORD`, `RECIPIENT_EMAIL`.
  - `newrelic.ini` is a template; the license key should be provided via `NEW_RELIC_LICENSE_KEY` env var.

- **Patterns & conventions specific to this repo:**
  - Simple function-based Flask routes rendering templates directly (no Blueprints).
  - Contact form posts to `/submit` and uses `smtplib` to send email synchronously — long-running sending may block the request.
  - CORS is enabled via `flask_cors.CORS(app)` for the whole app.
  - SSL/TLS usage is present only as commented code in `app.py` (certificate paths). No active cert management.

- **Common issues to watch for (based on current code):**
  - `wsgi.py` imports `app` but the `if __name__ == "__main__": app.run` conditional uses `app.run` (missing parentheses) — for WSGI you don't need the guard, but this file is usable as `wsgi:app` for Gunicorn.
  - `test.py` appears to be a placeholder and is not a runnable test suite.
  - `Dockerfile` port (443) and CMD don't match `app.py` (port 8000). Watch for these inconsistencies when making changes.

- **Suggested agent-first tasks (low-friction, high-value):**
  - Replace hard-coded SMTP credentials in `app.py` with environment variables and document required env vars in `README.md`.
  - Fix `Dockerfile` CMD and exposed port or document how to build/run a Docker image.
  - Add a small health-check endpoint (`/health`) returning 200 for container readiness checks.
  - Add a short `Makefile` or `scripts/` entries for common dev commands (`run`, `docker-build`, `docker-run`, `gunicorn`).

- **Where to look when editing or debugging:**
  - UI routing & templates: `templates/*.html` — changes here affect all pages.
  - Email sending logic: `app.py:submit()` — validate form keys and move credentials to env vars.
  - Monitoring config: `newrelic.ini` — expects env for license key and app name.

If anything here is unclear or you want me to expand examples (eg. a safe env-var refactor for `app.py`, a fixed `Dockerfile`, or a `Makefile`), tell me which change to make next.
