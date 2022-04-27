const fetch = require('node-fetch');
const Database = require("@replit/database");
const db = new Database();
const express = require('express');

const re = /var data = \{.*?\};/ms;

const UPDATE_MS = 5 * 60 * 1000;
const UPDATES_PER_DAY = 24 * 60 * 60 * 1000 / UPDATE_MS;
const MAX_DAYS = 7;
const MAX_UPDATES = UPDATES_PER_DAY * MAX_DAYS;

async function getOccupancy() {
  const response = await fetch('https://portal.rockgympro.com/portal/public/314b60a77a6eada788f8cd7046931fc5/occupancy');
  const body = await response.text();
  const match = body.match(re);
  if (match) {
    const data = Function(`${match} return data;`)();
    return {
      time: Date.now(),
      POP: data.POP.count,
      UPW: data.UPW.count,
      FRE: data.FRE.count,
    };
  }
}

const updateInterval = setInterval(async () => {
  const occupancy = await getOccupancy();
  let stats = await db.get('stats');
  if (!stats) {
    stats = [];
  }
  stats.push(occupancy); 
  if (stats.length > MAX_UPDATES) {
    stats = stats.slice(stats.length - MAX_UPDATES)
  }
  await db.set('stats', stats);
}, UPDATE_MS);

const app = express();
app.use(express.static('public'));
app.get('/stats', async (req, res) => {
  const stats = await db.get('stats');
  return res.json(stats);
});
app.listen(3000, () => {
  console.log('listening');
});