# Task & Bug Tracker (MERN)

A small full-stack task tracker built with MongoDB, Express, React (Vite), and Node.js.
Teams can create tasks, set a priority and status, filter/search the list, and move
tasks through `todo → in-progress → done`.

## Project structure

```
task-tracker/
├── backend/
│   ├── config/db.js            Mongoose connection
│   ├── models/Task.js          Task schema
│   ├── controllers/            Route handlers (CRUD + filter/search/sort)
│   ├── routes/taskRoutes.js    /api/tasks routes
│   ├── middleware/             asyncHandler, ApiError, centralized error handler
│   ├── app.js                  Express app (CORS, JSON, routes, error handling)
│   └── server.js               Connects to Mongo, starts the HTTP server
└── frontend/
    └── src/
        ├── api.js              fetch wrapper for the /api/tasks endpoints
        ├── App.jsx             Top-level state: load, create, update, delete
        └── components/
            ├── TaskForm.jsx     Create form with inline validation
            ├── FilterBar.jsx    Status/priority filter, search, sort
            ├── TaskList.jsx     Loading / error / empty states
            └── TaskItem.jsx     Single task row with status select + delete
```

## Getting started

### 1. Backend

```bash
cd backend
cp .env.example .env      # edit MONGODB_URI if needed
npm install
npm run dev                # nodemon, or `npm start` for plain node
```

The API starts on `http://localhost:5000` and expects MongoDB at the URI in `.env`
(a local `mongod` instance or a MongoDB Atlas connection string both work).

### 2. Frontend

```bash
cd frontend
cp .env.example .env      # edit VITE_API_URL if the backend runs elsewhere
npm install
npm run dev
```

The app starts on `http://localhost:5173` (Vite's default) and talks to the API
via `VITE_API_URL`.

## API

Base URL: `/api/tasks`

| Method | Route            | Description                                                        |
|--------|------------------|----------------------------------------------------------------------|
| GET    | `/api/tasks`     | List tasks. Query params: `status`, `priority`, `search`, `sort`, `page`, `limit` |
| GET    | `/api/tasks/:id` | Fetch a single task                                                 |
| POST   | `/api/tasks`     | Create a task (`title` required, 400 on invalid input)              |
| PUT    | `/api/tasks/:id` | Update a task (any subset of fields)                                 |
| DELETE | `/api/tasks/:id` | Delete a task                                                        |

Query params on `GET /api/tasks`:
- `status=todo|in-progress|done`
- `priority=low|medium|high`
- `search=text` — case-insensitive partial match on title
- `sort=-createdAt|createdAt|-priority|priority` (default `-createdAt`, newest first)
- `page`, `limit` — optional pagination; if omitted, all matching tasks are returned

All responses follow `{ success, data }` (or `{ success, error }` on failure).

### Task shape

```js
{
  title: String,        // required, trimmed, max 120 chars
  description: String,  // optional, max 1000 chars
  priority: "low" | "medium" | "high",   // default "medium"
  status: "todo" | "in-progress" | "done", // default "todo"
  createdAt: Date,
}
```

## Design decisions / trade-offs

- **Routes vs. controllers**: split per the brief (`routes/` dispatches to `controllers/`)
  so the request/response wiring stays separate from the actual database logic.
- **Error handling**: a single `errorHandler` middleware normalizes Mongoose
  `ValidationError`/`CastError` and any thrown `ApiError` into consistent
  `{ success: false, error }` JSON with the right status code (400/404/500),
  instead of duplicating try/catch in every controller (`asyncHandler` forwards
  rejected promises to it).
- **Priority sort**: sorted by logical rank (low → medium → high) rather than
  alphabetically, since alphabetical order doesn't match priority order.
- **Optimistic UI updates**: status changes and deletes update the UI immediately
  and roll back if the API call fails, so the app feels responsive without waiting
  on a network round trip for every click.
- **Search debounce**: the search input is debounced (300ms) so typing doesn't
  fire a request per keystroke.
- **No auth**: intentionally omitted per the brief — single shared task list.
- **Stretch goals implemented**: search by title, sort by priority/creation date,
  optional pagination (`page`/`limit`), inline form validation on the frontend.
  Not implemented: "load more" UI (pagination is supported by the API but the
  frontend currently renders the full filtered list — a `Load more` button could
  be wired to `page`/`limit` if the task list grows large).

## Manual testing

With the backend running, some quick sanity checks:

```bash
# Create
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Fix login bug","priority":"high"}'

# List, filtered
curl "http://localhost:5000/api/tasks?status=todo&priority=high"

# Invalid input -> 400
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" -d '{}'

# Missing id -> 404
curl http://localhost:5000/api/tasks/64f000000000000000000000
```
