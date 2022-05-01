const fetch = require('node-fetch');
const express = require('express');
const { init, seed, getSources, addTick, getTicks } = require('./db');

const re = /var data = \{.*?\};/ms;

const UPDATE_MS = 5 * 60 * 1000;

async function getOccupancy(uuid, short) {
  const response = await fetch(`https://portal.rockgympro.com/portal/public/${uuid}/occupancy`);
  const body = await response.text();
  const match = body.match(re);
  if (match) {
    const data = Function(`${match} return data;`)();
    if (data[short] === undefined) {
      console.error('Failed to find short in response: ', uuid, short, body);
      return null;
    }
    return data[short].count;
  }

  console.error('Failed to find occupancy in response: ', uuid, short, body);
  return null;
}

async function refreshSources() {
  const sources = await getSources();
  for (const source of sources) {
    const { uuid, short } = source.data;
    const occupancy = await getOccupancy(uuid, short);
    if (occupancy !== null) {
      await addTick(source, occupancy);
    }
  }
}

async function main() {
  if (process.env.NODE_ENV !== 'production') {
    await init(true); // force
    await seed();
  } else {
    await init(false);
  }

  setInterval(refreshSources, UPDATE_MS);
  // setInterval doesn't trigger fn initially so we call it here
  refreshSources();

  const app = express();

  app.use(express.static('public'));
  app.get('/stats', async (_, res) => {
    const gyms = await getTicks();
    return res.json(gyms);
  });

  app.listen(process.env.PORT || 8080, () => {
    console.log('listening');
  });
}

main().catch(console.error);