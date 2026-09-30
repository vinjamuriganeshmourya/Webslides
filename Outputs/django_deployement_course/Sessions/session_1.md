# Session 1 — Foundations & the First Successful Call

> **TR (Training Resource) — narrative flow.**
> This is a trainer-facing script for Session 1 of the React + Django integration track.
> Read it top to bottom; it alternates between *what to say/teach* and *what to do with the
> class in the code*. Stages covered: rename → client–server foundations → CORS → base URL.

---

## How code is referenced in this doc

Two project roots. Every code reference below is tagged with the root it lives under.

| Tag | Root | Example path |
|-----|------|--------------|
| **[backend]** | the folder containing `manage.py` (the Django project). Its config package is `myproject/`, which we rename to `nxttrendz_backend/` in the first step. | `[backend] nxttrendz_backend/settings.py`, `[backend] products/views.py` |
| **[frontend]** | `nxttrendz/` (inside `Frontend Project/`). | `[frontend] src/components/LoginForm/index.jsx` |

> ⚠️ **Port note (mention early).** `[backend] manage.py` currently defaults `runserver` to
> **port 3000**, which is the *same* port the Vite frontend uses. Throughout this track we
> run the **backend on 8000** and the **frontend on 3000** so they don't collide. Always
> start the backend with an explicit port: `python manage.py runserver 8000`.

---

## Session at a glance

**Abstract.** Students learn how a browser actually talks to a server and why a frontend
calling *its own* backend behaves differently from calling a public API. We tidy the backend
project name first, then get a single request from the React app to reach Django and come
back — wiring the two islands together for the first time.

**By the end of this session a student can:**
- explain a request/response round trip and what an "origin" is;
- describe why a cross-origin call is blocked and how CORS fixes it;
- run the Django backend with CORS enabled for the frontend;
- point the React app at the backend through one environment variable and render real data
  from Django instead of the static API.

**Prerequisites:** the React frontend (`nxttrendz`) and the Django backend both run
independently; Node and Python environments are set up.

---

## Segment 0 — Rename the backend project (do this before anything else)

**Why we do this first.** The backend was scaffolded with Django's default project name
`myproject`. Before we start wiring things together, we give it a real name so imports,
settings, and deployment configuration all read clearly — `nxttrendz_backend`. Doing it now,
while nothing depends on the backend yet, means no integration code has to change later.

Tell students: *"A Django project name appears in four places. Rename the folder, then fix
the three files that point at it, then prove the server still boots."*

**Step 1 — rename the config package folder**

```
[backend]  myproject/   →   nxttrendz_backend/
```

**Step 2 — update `[backend] manage.py`** (the settings module reference)

```python
# before
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
# after
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nxttrendz_backend.settings')
```

**Step 3 — update `[backend] nxttrendz_backend/settings.py`** (two lines)

```python
# before
ROOT_URLCONF = 'myproject.urls'
WSGI_APPLICATION = 'myproject.wsgi.application'
# after
ROOT_URLCONF = 'nxttrendz_backend.urls'
WSGI_APPLICATION = 'nxttrendz_backend.wsgi.application'
```

**Step 4 — update `[backend] nxttrendz_backend/wsgi.py` and `[backend] nxttrendz_backend/asgi.py`**

```python
# both files, same change
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nxttrendz_backend.settings')
```

**Step 5 — prove it still works**

```bash
# from the backend root (the folder with manage.py)
python manage.py runserver 8000
```

The server should boot with no `ModuleNotFoundError: No module named 'myproject'`. If it
errors, one of the four references above still says `myproject`. Have students grep for it:

```bash
grep -rn "myproject" .        # should return nothing after the rename
```

> **Checkpoint 0:** `runserver 8000` boots cleanly and `grep myproject` finds nothing.

---

## Segment 1 — Client–server foundations (teach)

Now step back from the keyboard and set up the mental model, because everything in this
track builds on it.

Explain the **request/response** cycle: the browser (client) sends an HTTP *request* — a
method, a URL, headers, and sometimes a JSON body — and the server sends back an HTTP
*response* — a status code, headers, and usually a JSON body. Walk them through one concrete
example end to end:

> *"When the products page loads, the browser sends `GET /api/products/` to Django. Django
> matches the URL, runs the view, queries the database, serializes the rows to JSON, and
> replies `200 OK` with that JSON. React reads the JSON and renders cards."*

Make three ideas explicit, because they're the ones that bite during integration:

1. **HTTP methods** map to intent — `GET` read, `POST` create, `PUT/PATCH` update, `DELETE`
   remove. Our product and cart routes use all of them.
2. **Status codes** are how the server tells the client what happened — `200/201` success,
   `400` bad input, `401` not logged in, `403` logged in but not allowed, `404` not found.
   Students will read these constantly in Session 4.
3. **Origin = scheme + host + port.** `http://localhost:3000` and `http://localhost:8000`
   are *different origins* even though both are "localhost". Write both on the board — this
   single fact is why the next segment exists.

> **Checkpoint 1:** a student can narrate, unprompted, what happens end to end for
> `GET /api/products/` and can say why `:3000` and `:8000` are different origins.

---

## Segment 2 — CORS: the cross-origin gate (teach + implement)

**Set up the problem live.** With the backend running on 8000 and the frontend on 3000, have
a student add a quick `fetch('http://localhost:8000/api/products/')` in the browser console
on the running frontend. It fails — not with a 404, but with a **CORS error** in the console.

Now explain what just happened:

- Browsers enforce the **same-origin policy**: by default a page on one origin cannot read a
  response from a different origin.
- The frontend (`:3000`) and backend (`:8000`) are different origins, so the browser blocks
  the response *even though the server answered*.
- For some requests the browser first sends a **preflight `OPTIONS`** request asking the
  server "am I allowed?" The server must answer with `Access-Control-Allow-Origin` headers.
- Emphasise: **CORS is enforced by the browser, not the server.** That's why the same request
  works fine in Postman or `curl` — those aren't browsers. The static API students used
  before (`apis.ccbp.in`) already sent these headers, so they never saw this.

**Implement the fix on the backend.** Django doesn't send CORS headers until we add the
`django-cors-headers` package.

```bash
# backend root
pip install django-cors-headers
```

Then three edits in `[backend] nxttrendz_backend/settings.py`:

```python
# 1) register the app
INSTALLED_APPS = [
    "corsheaders",
    # ...existing apps...
]

# 2) add the middleware AS HIGH AS POSSIBLE (above CommonMiddleware)
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    # ...rest unchanged...
]

# 3) allow the frontend origin
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

Restart the backend (`python manage.py runserver 8000`) and re-run the console `fetch`. It
now returns data. Point out the response headers in the Network tab — `Access-Control-Allow-Origin`
is now present.

> **Checkpoint 2:** a `fetch` from the frontend origin to `http://localhost:8000/api/products/`
> returns JSON instead of a CORS console error.

---

## Segment 3 — Base URL & environment config (teach + implement)

The frontend still has the backend address hardcoded in scattered `fetch` calls (actually
pointing at `apis.ccbp.in`). Teach the principle: **the API's address is configuration, not
code.** It differs between a student's laptop, a teammate's, and production — so it belongs in
one place, an environment variable, read once.

Explain the Vite specifics:

- Variables in a `.env` file that start with `VITE_` are exposed to the app as
  `import.meta.env.VITE_...`.
- Changing that one value re-points every request — from the static API today to Django now,
  and to a deployed URL later — with no code edits.

**Implement on the frontend.**

Create `[frontend] .env`:

```
VITE_API_BASE_URL=http://localhost:8000
```

Add a tiny helper so components never hardcode a host — `[frontend] src/api.js`:

```js
export const BASE_URL = import.meta.env.VITE_API_BASE_URL

// small wrapper so every call goes through one place
export const apiUrl = (path) => `${BASE_URL}${path}`
```

Now convert **one** component as the worked example — the products list at
`[frontend] src/components/AllProductsSection/index.jsx`. Change its request from the static
API to the backend through the helper:

```js
// before
const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}...`
// after
import { apiUrl } from '../../api'
const response = await fetch(apiUrl('/api/products/'))
```

(We only prove the plumbing here — matching the exact response shape and query params is
Session 2's contract work. Rendering a couple of fields is enough to confirm the wire.)

Restart the Vite dev server (env changes require a restart) and load the products page. It
now shows data served by *your* Django backend.

> **Checkpoint 3:** editing `VITE_API_BASE_URL` alone re-points the app; the products page
> renders from Django with no hardcoded host left in that component.

---

## Wrap-up

By the end of Session 1 the two projects are no longer isolated:

- the backend has a proper name (`nxttrendz_backend`) and runs on **8000** with **CORS**
  open to the frontend;
- the frontend reads its backend address from **one env var** and has made its **first real
  call** to Django.

Recap the through-line for students: *origin → why the browser blocked us → CORS on the
server → one base URL on the client → a request that finally lands.*

**What's next (Session 2 preview):** the data came back, but the *shapes don't match yet* —
login returns `{access, refresh}` not `{jwt_token}`, lists arrive under `results` not
`products`, and fields are named differently. Next session we align the **contract** and make
**login** work end to end.

---

## Session 1 checklist (for the trainer)

- [ ] `myproject/` renamed to `nxttrendz_backend/`; all four references updated; `grep myproject` is clean.
- [ ] Backend boots with `python manage.py runserver 8000`.
- [ ] `django-cors-headers` installed; app + middleware added; `CORS_ALLOWED_ORIGINS` set.
- [ ] A cross-origin `fetch` from `:3000` to `:8000` succeeds.
- [ ] `[frontend] .env` has `VITE_API_BASE_URL`; `src/api.js` helper created.
- [ ] Products page renders data from Django via the base-URL helper.
