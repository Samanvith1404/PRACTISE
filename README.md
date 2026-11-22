# CampusPortal

A small, dependency-free starter project with a responsive sign-in page and a
Node.js HTTP server.

## Run locally

Use Node.js 18 or newer. From this directory, configure demo credentials and
start the server:

```powershell
$env:CAMPUS_PORTAL_USERNAME = "student"
$env:CAMPUS_PORTAL_PASSWORD = "change-this-password"
node .\backend\server.js
```

Open <http://localhost:3000>. Set `PORT` to use a different port.

The sign-in endpoint compares credentials configured in environment variables.
It is a local starter only: it does not create sessions, connect to the database,
or provide production authentication. Do not use real campus credentials.

## Project layout

- `frontend/` contains the sign-in page, browser logic, and styles.
- `backend/` contains the HTTP server and demo credential check.
- `database/schema.sql` is a starter student-table schema, not wired to the server.
- `docs/requirements.txt` lists runtime requirements.

## API

`POST /api/login` accepts a JSON body with `username` and `password`. It returns
`200` when configured credentials match, `401` when they do not, and `503` when
credentials have not been configured.
