import React from 'react';
import { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables, Tooltip } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { format } from 'date-fns'

Chart.register(...registerables);

function ChartElement({config, title, dataSet, labels, lastPoint, prevLastPoint, colorRGB, datasetMax, datasetMin, selectedKey}) {
  let lastSettetPointToTooltip = null;
  const chartRef = useRef(null);

  const updateTitle = {
    id: "updateTitle",
    afterDatasetDraw(chart, args, options) {
        const lastPointIndex = chart.getDatasetMeta(0).data.length - 1;

        if (lastPointIndex >= 0) {
          const tooltip = chart.tooltip;
          if (lastSettetPointToTooltip !== lastPointIndex) {
            tooltip.setActiveElements([
              {
                datasetIndex: 0,
                index: lastPointIndex,
              },
            ],
            {});

            chart.update();
            lastSettetPointToTooltip = lastPointIndex
          }
      }
    }
  };

  Tooltip.positioners.myCustomPositioner = function(elements, eventPosition) {
    return {
        x: this.chart.chartArea.right,
        y: 0
    };
  };

  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: dataSet,
        borderWidth: 3,
        tension: 0.2,
        // stepped: true,
        pointRadius: 1,
        borderColor: `rgba(${colorRGB}, 1)`,
        backgroundColor: `rgba(${colorRGB}, 0.2)`,
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
    plugins: {
      title: {
        display: true,
        text: (ctx) => {
          const lastValue = lastPoint?.y?.toFixed(4)
          const arrow = lastPoint.y >= prevLastPoint.y ? '⬆' : '⬇'
          const diff = (lastPoint?.y - prevLastPoint?.y)
          const isGreateThanZero = diff >= 0 ? '+' : ''
          return `${arrow}  LAST: ${lastValue}  ${isGreateThanZero}${diff.toFixed(4)}`
        },
        color: (ctx) => {
          if (lastPoint.y >= prevLastPoint.y) {
            return 'green'
          }
          return 'red'
        },
        position: 'top',
        font: {
          size: 22
        },
        padding: {
          top: 0,
          bottom: 0
        }
      },
      tooltip: {
        // enabled: false,
        // mode: 'index',
        position: 'myCustomPositioner',
        // position: 'average',
        intersect: false,
        displayColors: false,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        titleAlign: 'center',
        bodyAlign: 'center',
        bodyFont: {
          size: 18
        },
        padding: {
          left: 36,
          right: 36,
          top: 6,
          bottom: 6
        },
        titleColor: '#ff8484',
        bodyColor: '#84dcff',
        callbacks: {
          label: function(context) {
            const obj = context.parsed
            let label = obj?.y
            return label?.toFixed(4);
          },
          title: function(context) {
            const item = context[0]

            let label = format(new Date(item?.parsed.x), 'dd MMM yyyy, HH:mm')
            return label;
          },
        },
        caretSize: 0
      }
    }
  };

  return (
    <div className='chart-element'>
      <Line key={'chartLine-' + selectedKey} ref={chartRef} data={data} options={options} plugins={[updateTitle]} />
    </div>
  )
}

export default ChartElement