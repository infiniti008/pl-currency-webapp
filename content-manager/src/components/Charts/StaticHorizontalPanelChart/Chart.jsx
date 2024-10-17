import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(...registerables);

const highlightWeekendsPlugin = {
  id: 'highlightWeekends',
  afterDraw: (chart) => {
    const ctx = chart.ctx;
    const chartArea = chart.chartArea;
    const xAxis = chart.scales['x'];
    const yAxis = chart.scales['y'];
    
    xAxis.ticks.forEach((tick, index) => {
      const label = tick.value;
      const date = new Date(label);
      const dayOfWeek = date.getDay(); // Sunday = 0, Saturday = 6

      if (dayOfWeek === 6 || dayOfWeek === 0) {
        const startX = xAxis.getPixelForTick(index);
        const endX = xAxis.getPixelForTick(index + 1);

        ctx.save();
        ctx.fillStyle = 'rgba(255, 165, 0, 0.1)';
        ctx.fillRect(startX, chartArea.top, endX - startX, chartArea.bottom - chartArea.top);
        ctx.restore();
      }
    });
  }
};

Chart.register(highlightWeekendsPlugin);

function ChartElement({dataSet, labels, colorRGB, datasetMax, datasetMin, selectedKey, selectedPointSize, startDaysAgo}) {
  let lastSettetPointToTooltip = null;
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
    labels: startDaysAgo > 0 ? undefined : labels,
    datasets: [
      {
        data: dataSet,
        borderWidth: 3,
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

  const parseFormat = startDaysAgo > 0 ? 'yyyy-MM-dd HH:mm' : 'HH:mm';
  const displayUnit = startDaysAgo > 0 ? 'day' : 'minute';

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
          parser: parseFormat,
          unit: displayUnit,
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
        enabled: false
      },
      highlightWeekends: startDaysAgo > 0 ? true : false
    }
  };

  return (
    <div className='chart-element chart-element--full'>
      <Line key={'chartLine-' + selectedKey} ref={chartRef} data={data} options={options} />
    </div>
  )
}

export default ChartElement