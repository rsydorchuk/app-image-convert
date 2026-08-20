<!--
First tool micro-frontend (see CLAUDE.md "tools are plugins" — extended to the
frontend: each tool is its own deployable app, not a page inside `web`). React +
Vite + TypeScript + MUI, same stack as `web`. No Dockerfile — builds to static
files and deploys the same way `web` does.

Not a standalone login surface: there's no /login page here on purpose. Auth is
centralized on `web` — this app just calls GET /auth/me and trusts the shared
cookie (see CLAUDE.md "auth cookie, not a bearer token"); if that 401s, it points
the user back at web's /login instead of duplicating the form.

Flow: POST /uploads (metadata only: filename, from/to format, tool) -> gets back
a SAS upload_url -> PUTs the file straight to Blob with that URL, bytes never
touching the api (see CLAUDE.md "bytes never pass through the api") -> GET
/jobs/{id} to show status. Nothing ever moves the job past "pending" yet — no
worker exists (see CLAUDE.md "Next step"), so this only proves the upload path
end to end, not conversion.

Local dev: `npm run dev`, fixed at localhost:3001 (see vite.config.ts — the port
is hardcoded in web/src/pages/Apps.tsx's app tile too, keep them in sync).
-->
