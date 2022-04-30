fetch('/stats')
  .then(r => r.json())
  .then(render);

const COLORS = {
  Poplar: 'rgba(255, 99, 132, 0.4)',
  "Upper Walls": 'rgba(54, 162, 235, 0.4)',
  Fremont: 'rgba(255, 206, 86, 0.4)',
};

function render(stats) {
  stats = stats.map(gym => {
    return {
      label: gym.name,
      borderColor: COLORS[gym.name],
      backgroundColor: COLORS[gym.name],
      pointRadius: 0.2,
      tension: 0.1,
      fill: false,
      data: gym.Ticks.map(t => ({
        x: t.time,
        y: t.count,
      })),
    }
  });
 
  const chartConfig = {
    type: 'line',
    data: {
      datasets: stats,
    },
    options: {
      scales: {
        x: {
          type: 'time',
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Occupancy at Seattle Bouldering Project Locations',
        },
        subtitle: {
          display: true,
          text: 'Rolling 7 day view with data updated every 5 minutes',
        }
      },
      interaction: {
        mode: 'index',
        intersect: false,
      },
    },
  }

  new Chart(document.getElementById('chart'), chartConfig);
}