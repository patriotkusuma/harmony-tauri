import Chart from "chart.js/auto";

var mode = "light";
var fonts = {
  base: "Open Sans",
};

var colors = {
  gray: {
    100: "#f6f9fc", 200: "#e9ecef", 300: "#dee2e6", 400: "#ced4da",
    500: "#adb5bd", 600: "#8898aa", 700: "#525f7f", 800: "#32325d", 900: "#212529",
  },
  theme: {
    default: "#172b4d", primary: "#5e72e4", secondary: "#f4f5f7",
    info: "#11cdef", success: "#2dce89", danger: "#f5365c", warning: "#fb6340",
  },
  black: "#12263F", white: "#FFFFFF", transparent: "transparent",
};

function chartOptions() {
  Chart.defaults.responsive = true;
  Chart.defaults.maintainAspectRatio = false;
  Chart.defaults.color = mode === "dark" ? colors.gray[700] : colors.gray[600];
  Chart.defaults.font.family = fonts.base;
  Chart.defaults.font.size = 13;
  
  Chart.defaults.plugins.legend.display = false;
  Chart.defaults.plugins.legend.position = "bottom";
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.padding = 16;

  Chart.defaults.elements.point.radius = 0;
  Chart.defaults.elements.point.backgroundColor = colors.theme["primary"];
  
  Chart.defaults.elements.line.tension = 0.4;
  Chart.defaults.elements.line.borderWidth = 4;
  Chart.defaults.elements.line.borderColor = colors.theme["primary"];
  Chart.defaults.elements.line.backgroundColor = colors.transparent;
  Chart.defaults.elements.line.borderCapStyle = "rounded";

  // BS5/Chart.js v4 uses 'bar' instead of 'rectangle'
  Chart.defaults.elements.bar.backgroundColor = colors.theme["warning"];
  Chart.defaults.elements.bar.borderRadius = 4;

  Chart.defaults.elements.arc.backgroundColor = colors.theme["primary"];
  Chart.defaults.elements.arc.borderColor = mode === "dark" ? colors.gray[800] : colors.white;
  Chart.defaults.elements.arc.borderWidth = 4;

  Chart.defaults.plugins.tooltip.enabled = true;
  Chart.defaults.plugins.tooltip.mode = "index";
  Chart.defaults.plugins.tooltip.intersect = false;

  return {}; // Legacy return
}

function parseOptions(parent, options) {
  for (var item in options) {
    if (typeof options[item] !== "object") {
      parent[item] = options[item];
    } else {
      parseOptions(parent[item], options[item]);
    }
  }
}

let chartExample1 = {
  options: {
    scales: {
      y: {
        grid: {
          color: colors.gray[900],
          drawBorder: false,
        },
        ticks: {
          callback: function (value) {
            if (!(value % 10)) {
              return "$" + value + "k";
            }
          },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            let yLabel = context.parsed.y;
            return label + ": $" + yLabel + "k";
          },
        },
      },
    },
  },
  data1: (canvas) => {
    return {
      labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "Performance",
          data: [0, 20, 10, 30, 15, 40, 20, 60, 60],
          fill: false,
        },
      ],
    };
  },
  data2: (canvas) => {
    return {
      labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "Performance",
          data: [0, 20, 5, 25, 10, 30, 15, 40, 40],
          fill: false,
        },
      ],
    };
  },
};

let chartExample2 = {
  options: {
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            if (!(value % 10)) {
              return value;
            }
          },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            let yLabel = context.parsed.y;
            return label + ": " + yLabel;
          },
        },
      },
    },
  },
  data: {
    labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Sales",
        data: [25, 20, 30, 22, 17, 29],
        maxBarThickness: 10,
        borderRadius: 6,
      },
    ],
  },
};

export {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
};
