import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import ChartDataLabels from 'chartjs-plugin-datalabels';


Chart.register(...registerables);
// Chart.register(ChartDataLabels);

function ChartElement({config, title, dataSet, labels}) {

  const plugin = {
    // id: "tooltips",
    afterDatasetDraw(chart, args, options) {
      const data = chart.data.datasets[0].data
      const lastValue = data.findLast(item => item.y ? true : false)?.y || ''
      const titleText = chart.config.options.plugins.title.text
      
      if (titleText !== lastValue) {        
        chart.config.options.plugins.title.text = lastValue
        chart.update({
          duration: 0,
          lazy: true,
          easing: 'easeOutBounce'
        })
      }
    }
  };

  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: dataSet,
        borderWidth: 2,
        tension: 0.2,
        // stepped: true,
        pointRadius: 0,
        // backgroundColor: 'red',
        showTooltip: true
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
          parser: 'HH:mm',
          unit: 'minute',
          displayFormats: {
            minute: 'HH:mm'  // Example: 'Jan 1'
          }
        }
      }
    },
    animations: {
      tension: {
        duration: 300,
        easing: 'linear',
        from: 0.2,
        to: 0.02
      }
    },
    plugins: {
      title: {
        display: true,
        text: '',
        position: 'top',
        font: {
          size: 22
        },
        padding: {
          top: 0,
          bottom: 0
        }
      }
    }
  };

  return (
    <div className='chart-element'>
      <Line data={data} options={options} plugins={[plugin]} />
    </div>
  )
}

export default ChartElement