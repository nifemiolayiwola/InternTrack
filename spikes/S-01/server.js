// Minimal Express server with one dashboard endpoint.
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const pool = new Pool(); // connection settings come from PG* env vars
const app = express();

app.get('/api/dashboard/:userId', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT
       COUNT(*)::int                                          AS total,
       COUNT(*) FILTER (WHERE status = 'Applied')::int        AS applied,
       COUNT(*) FILTER (WHERE status = 'Interviewing')::int   AS interviewing,
       COUNT(*) FILTER (WHERE status = 'Offered')::int        AS offered,
       COUNT(*) FILTER (WHERE status = 'Rejected')::int       AS rejected
     FROM applications
     WHERE user_id = $1`,
    [req.params.userId]
  );
  const r = rows[0];
  res.json({
    total: r.total,
    byStatus: {
      Applied: r.applied,
      Interviewing: r.interviewing,
      Offered: r.offered,
      Rejected: r.rejected,
    },
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Spike server on http://localhost:${port}`));
