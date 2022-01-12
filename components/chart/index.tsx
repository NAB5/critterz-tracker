import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

const PlaytimeChart = ({ timePerEpoch }: { timePerEpoch: number[] }) => {
  const labels = new Array(timePerEpoch.length).fill(0);

  labels.forEach((_, index) => {
    labels[index] = "Day " + (index + 1);
  });

  const temp = Array.from(timePerEpoch).reverse();

  const options = {
    // fill: true,
    // backgroundColor: "#01150A",
    borderColor: "#FFFF",
    borderWidth: 1,
    drawTicks: false,
    tickColor: "rgba(0,0,0,0)",
    pointRadius: 5,
    pointBorderColor: "#FFFF",
    pointBackgroundColor: "#01150A",
    tension: 0.4,
    plugins: {
      legend: {
        display: false,
      },
    },
    layout: {
      padding: 20,
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "past 14 days.",
          font: {
            family: "Fira Code",
          },
        },
        grid: {
          color: "#01150A",
        },
        ticks: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: "time played (minutes).",
          font: {
            family: "Fira Code",
          },
        },
        grid: {
          color: "#01150A",
        },
        ticks: {
          display: false,
        },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "playtime(min)",
        data: temp,
      },
    ],
  };

  return <Line data={data} height={150} options={options} />;
};

export default PlaytimeChart;
