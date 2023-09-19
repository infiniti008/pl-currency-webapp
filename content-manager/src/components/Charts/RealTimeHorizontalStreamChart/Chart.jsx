import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(...registerables);

function ChartElement({dataSet, labels, colorRGB, datasetMax, datasetMin, selectedKey, selectedPointSize}) {
  let lastSettetPointToTooltip = null;
  const chartRef = useRef(null);
  const [gradient, setGradient] = useState(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.ctx;
      const gradient = ctx.createLinearGradient(0, 0, 0, 230);
      gradient.addColorStop(0, `rgba(${colorRGB}, 0.7)`);
      gradient.addColorStop(1, `rgba(${colorRGB}, 0)`);
      setGradient(gradient);
    }
  }, [chartRef]);

  const data = {
    labels,
    datasets: [
      {
        data: dataSet,
        borderWidth: 3,
        tension: 0.2,
        // stepped: true,
        pointRadius: parseInt(selectedPointSize),
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
        suggestedMin: datasetMin,
        suggestedMax: datasetMax, 
      },
      x: {
        type: 'time',
        time: {
          parser: 'HH:mm',
          unit: 'minute',
          displayFormats: {
            minute: 'HH:mm'
          }
        }
      }
    },
    layout: {
      padding: {
        top: 66,
        right: 296
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
        enabled: false
      }
    }
  };

  return (
    <div className='chart-element'>
      <Line key={'chartLine-' + selectedKey} ref={chartRef} data={data} options={options} />
    </div>
  )
}

export default ChartElement