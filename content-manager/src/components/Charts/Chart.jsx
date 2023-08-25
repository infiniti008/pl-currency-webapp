import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';


Chart.register(...registerables);

function ChartElement({config, title, labels, dataSet}) {

  const labelLastValuePlugin = {
    afterDraw: function (chart) {
      const ctx = chart.ctx;
      const dataset = chart.data.datasets[0];
      const x = chart.getDatasetMeta(0).data[dataset.data.length - 1]._model.x;
      const y = chart.getDatasetMeta(0).data[dataset.data.length - 1]._model.y;
      const value = dataset.data[dataset.data.length - 1];
  
      ctx.fillStyle = '#000'; // or the desired color
      ctx.fillText(value, x + 10, y); // adjust the x value for positioning
    },
  };

  const data = {
    labels: labels,
    datasets: [
      {
        label: title,
        data: dataSet,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,

      }
    ],
  };

  const options = {
    maintainAspectRatio: false,
    // plugins: [labelLastValuePlugin],
    scales: {
      y: {
        beginAtZero: false,
      },
    }
  };

  return (
    <div className='chart-element'>
      <Line data={data} options={options} />
    </div>
  )
}

export default ChartElement