# Spike S-01: Dashboard counts under 2 seconds

**Question:** Can Node.js + Express + PostgreSQL return dashboard progress counts
(total + Applied / Interviewing / Offered / Rejected) for a user with 200
applications in under 2 seconds?

Throwaway prototype — not production code.

## Prerequisites

- Node.js 18+ (the test uses the built-in `fetch`)
- PostgreSQL running locally (or reachable), with `psql` on your PATH

## 1. Configure `.env`

Copy the example and fill in your own credentials (never commit `.env`):

```bash
cp .env.example .env
```

| Variable     | Meaning                              |
|--------------|--------------------------------------|
| `PGHOST`     | Postgres host (e.g. `localhost`)     |
| `PGPORT`     | Postgres port (default `5432`)       |
| `PGDATABASE` | Database name (e.g. `spike_s01`)     |
| `PGUSER`     | Postgres user                        |
| `PGPASSWORD` | Postgres password                    |
| `PORT`       | Express port (default `3000`)        |
| `BASE_URL`   | URL the test hits (default `http://localhost:3000`) |

The `pg` library reads the `PG*` variables automatically, so no credentials appear in code.

## 2. Create the database and tables

```bash
createdb spike_s01
psql -d spike_s01 -f schema.sql
```

(`schema.sql` drops and recreates the tables, so rerunning it gives a clean slate.)

## 3. Install dependencies and seed

```bash
npm install
npm run seed
```

Note the user ID it prints (it is `1` on a fresh schema).

## 4. Start the server

```bash
npm start
```

Sanity check: open `http://localhost:3000/api/dashboard/1`. Expected shape:

```json
{ "total": 200, "byStatus": { "Applied": 52, "Interviewing": 49, "Offered": 47, "Rejected": 52 } }
```

## 5. Run the response time test (in a second terminal)

```bash
npm test
```

or, for a different user ID: `node test.js 2`

The script sends 100 sequential GET requests, then prints total time, average,
**p95**, and **max** latency in ms with a PASS/FAIL against the 2000 ms
requirement. The same summary is written to `results.txt` — attach that file as
the spike's evidence.
