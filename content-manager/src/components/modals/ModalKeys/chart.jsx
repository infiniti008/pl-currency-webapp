import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(...registerables);

function KeyChart({ dataSet, colorRGB }) {
  const chartRef = useRef(null);
  const [gradient, setGradient] = useState(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.ctx;
      const gradient = ctx.createLinearGradient(0, 0, 0, 160);
      gradient.addColorStop(0, `rgba(${colorRGB}, 0.7)`);
      gradient.addColorStop(1, `rgba(${colorRGB}, 0)`);
      setGradient(gradient);
    }
  }, [chartRef]);

  const data = {
    datasets: [
      {
        data: dataSet,
        borderWidth: 2,
        tension: 0.2,
        // stepped: true,
        pointRadius: 0,
        borderColor: `rgba(${colorRGB}, 1)`,
        backgroundColor: gradient,
        showTooltip: true,
        fill: true
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
      },
      x: {
        type: 'time',
        time: {
          parser: 'yyyy-MM-dd HH:mm',
          unit: 'hour',
          displayFormats: {
            minute: 'HH:mm'
          }
        }
      }
    },
    plugins: {
      title: {
        display: false
      },
      legend: {
        display: false
      },
      tooltip: {
        enabled: true
      }
    }
  };

  return (
    <Line ref={chartRef} data={data} options={options} />
  )
}

export default KeyChart