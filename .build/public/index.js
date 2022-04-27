fetch("/stats").then((r) => r.json()).then(render);
const COLORS = {
  POP: "rgba(255, 99, 132, 0.4)",
  UPW: "rgba(54, 162, 235, 0.4)",
  FRE: "rgba(255, 206, 86, 0.4)"
};
const NAMES = {
  POP: "Poplar",
  UPW: "Upper Walls",
  FRE: "Fremont"
};
function render(stats) {
  stats = stats.reduce((acc, v) => {
    const keys = Object.keys(v);
    const time = v["time"];
    for (const key of keys) {
      if (key === "time")
        continue;
      if (!acc[key]) {
        acc[key] = {
          label: NAMES[key],
          borderColor: COLORS[key],
          backgroundColor: COLORS[key],
          pointRadius: 0.2,
          tension: 0.1,
          fill: false,
          data: []
        };
      }
      acc[key].data.push({
        x: time,
        y: v[key]
      });
    }
    return acc;
  }, {});
  const chartConfig = {
    type: "line",
    data: {
      datasets: Object.values(stats)
    },
    options: {
      scales: {
        x: {
          type: "time"
        }
      },
      plugins: {
        title: {
          display: true,
          text: "Occupancy at Seattle Bouldering Project Locations"
        },
        subtitle: {
          display: true,
          text: "Rolling 7 day view with data updated every 5 minutes"
        }
      },
      interaction: {
        mode: "index",
        intersect: false
      }
    }
  };
  new Chart(document.getElementById("chart"), chartConfig);
}
//# sourceMappingURL=index.js.map
