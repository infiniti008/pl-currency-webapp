import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(...registerables);

function KeyChart({ dataSets }) {
  const chartRef = useRef(null);
  const [gradient, setGradient] = useState(null);

  // useEffect(() => {
  //   if (chartRef.current) {
  //     const ctx = chartRef.current.ctx;
  //     const gradient = ctx.createLinearGradient(0, 0, 0, 160);
  //     gradient.addColorStop(0, `rgba(${colorRGB}, 0.7)`);
  //     gradient.addColorStop(1, `rgba(${colorRGB}, 0)`);
  //     setGradient(gradient);
  //   }
  // }, [chartRef]);

  const datasetModel = {
    data: [],
    borderWidth: 2,
    tension: 0.2,
    // stepped: true,
    pointRadius: 0,
    borderColor: `red`,
    // backgroundColor: gradient,
    showTooltip: true,
    fill: true,
    label: 'title'
  }

  const dataSet = dataSets.map(dataSet => {
    const clonedDataSet = { ...datasetModel }
    clonedDataSet.data = dataSet.data
    clonedDataSet.borderColor = dataSet.borderColor //`rgba(${colorRGB}, 1)`
    clonedDataSet.label = dataSet.label
    return clonedDataSet
  })

  const data = {
    datasets: dataSet
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
            minute: 'HH:mm',
            hour: 'MM.dd-HH:mm',
          }
        }
      }
    },
    plugins: {
      title: {
        display: false
      },
      legend: {
        display: true,
        labels: {
          font: {
            size: 14,
            weight: 'bold'
          }
        }
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