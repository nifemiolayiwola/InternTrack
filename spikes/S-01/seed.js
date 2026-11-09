// Seeds 1 dummy user + 200 applications with random statuses.
require('dotenv').config();
const { Client } = require('pg');

const STATUSES = ['Applied', 'Interviewing', 'Offered', 'Rejected'];
const COUNT = 200;

(async () => {
  const db = new Client(); // connection settings come from PG* env vars
  await db.connect();

  const { rows } = await db.query(
    'INSERT INTO users (email) VALUES ($1) RETURNING id',
    [`spike-user-${Date.now()}@example.com`]
  );
  const userId = rows[0].id;

  // One multi-row INSERT: ($1,$2),($3,$4),...
  const values = [];
  const placeholders = [];
  for (let i = 0; i < COUNT; i++) {
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    values.push(userId, status);
    placeholders.push(`($${i * 2 + 1}, $${i * 2 + 2})`);
  }
  await db.query(
    `INSERT INTO applications (user_id, status) VALUES ${placeholders.join(',')}`,
    values
  );

  console.log(`Seeded user ${userId} with ${COUNT} applications.`);
  await db.end();
})();
