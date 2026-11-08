// Sends 100 sequential GETs to the dashboard endpoint and reports p95 / max latency.
// Usage: node test.js [userId]   (requires Node 18+ for global fetch)
require('dotenv').config();
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const USER_ID = process.argv[2] || '1';
const REQUESTS = 100;
const THRESHOLD_MS = 2000;

(async () => {
  const url = `${BASE_URL}/api/dashboard/${USER_ID}`;
  const latencies = [];

  const runStart = performance.now();
  for (let i = 0; i < REQUESTS; i++) {
    const t0 = performance.now();
    const res = await fetch(url);
    await res.json(); // include body download/parse in the measured time
    latencies.push(performance.now() - t0);
  }
  const totalMs = performance.now() - runStart;

  const sorted = [...latencies].sort((a, b) => a - b);
  const p95 = sorted[Math.ceil(0.95 * sorted.length) - 1]; // nearest-rank method
  const max = sorted[sorted.length - 1];
  const avg = latencies.reduce((s, x) => s + x, 0) / latencies.length;

  const summary = [
    `Spike S-01 response time test - ${new Date().toISOString()}`,
    `Endpoint:   GET ${url}`,
    `Requests:   ${REQUESTS} (sequential)`,
    `Total time: ${totalMs.toFixed(2)} ms`,
    `Average:    ${avg.toFixed(2)} ms`,
    `p95:        ${p95.toFixed(2)} ms`,
    `Max:        ${max.toFixed(2)} ms`,
    `Result:     ${max < THRESHOLD_MS ? 'PASS' : 'FAIL'} (every request < ${THRESHOLD_MS} ms)`,
  ].join('\n');

  console.log(summary);
  fs.writeFileSync('results.txt', summary + '\n');
  console.log('\nSaved to results.txt');
})();
