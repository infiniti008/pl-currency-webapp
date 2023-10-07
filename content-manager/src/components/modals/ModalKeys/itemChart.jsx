import { useState } from 'react';
import $s from './style.module.scss';
import { format, addMinutes, parse, sub } from 'date-fns'
import { formatInTimeZone, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'
import { getKeyData } from '../../../api/services';
import KeyChart from './chart.jsx';
import ChartConfigurator from './chartConfigurator';

const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

function ItemChart({ keyObj, isAutoDraw, initialStateProp = {}, shouldHideHeader = false }) {
  const nowDate = new Date()
  const initialConfigState = {
    startTime: format(sub(nowDate, { hours: 3 }), 'HH:mm'),
    startDate: format(nowDate, 'yyyy-MM-dd'),
    endTime: format(nowDate, 'HH:mm'),
    endDate: format(nowDate, 'yyyy-MM-dd'),
  }

  if (Object.keys(initialStateProp).length > 0) {
    Object.keys(initialStateProp).forEach(key => {
      initialConfigState[key] = initialStateProp[key]
    })
  }

  const [chartConfig, set_chartConfig] = useState(initialConfigState)
  const [dataSet, set_dataSet] = useState([])
  const [isChartDrew, set_isChartDrew] = useState(false)

  function getTimeZone(country) {
    if (country === 'by') {
      const tz = 'Europe/Minsk'
      return tz
    }
  
    const tz = 'Europe/Warsaw'
      return tz
  }

  async function fetchChartData(startTimeStamp, endTimeStamp) {
    const request = {
      country: keyObj.country,
      key: keyObj.key,
      startTimeStamp,
      endTimeStamp
    }

    const data = await getKeyData(request)
    return prepareDataToChart(data)
  }

  async function handleClickDraw() {
    const { startTime, startDate, endTime, endDate } = chartConfig
    const timeZone = getTimeZone(keyObj.country)

    const start = parse(`${startDate} ${startTime}`, 'yyyy-MM-dd HH:mm', new Date())
    const end = parse(`${endDate} ${endTime}`, 'yyyy-MM-dd HH:mm', new Date())

    let startTimeStamp = zonedTimeToUtc(start, timeZone);
    startTimeStamp = utcToZonedTime(startTimeStamp, currentTimeZone);
    startTimeStamp = startTimeStamp.valueOf()

    let endTimeStamp = zonedTimeToUtc(end, timeZone);
    endTimeStamp = utcToZonedTime(endTimeStamp, currentTimeZone);
    endTimeStamp = endTimeStamp.valueOf()

    const data = await fetchChartData(startTimeStamp, endTimeStamp)

    if (data.length > 0) {
      drawChart(data)
    }
  }

  function handleClickClear() {
    set_dataSet([])
  }

  function drawChart(data) {
    set_dataSet(data)
    set_isChartDrew(true)
  }

  function prepareDataToChart(data) {
    const timeZone = getTimeZone(keyObj.country)
    const newDataSet = []

    data.forEach(item => {
      if (!item.value) return
      let time = new Date(item.timestamp)
      time = formatInTimeZone(time, timeZone, 'yyyy-MM-dd HH:mm')
      newDataSet.push({ x: time, y: item.value })
    })

    return newDataSet
  }

  function parseHexColor(color) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    result = {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };

    return `${result.r}, ${result.g}, ${result.b}`
  }

  const colorRGB = parseHexColor(keyObj.bankColor)

  if (isAutoDraw && !isChartDrew) {
    handleClickDraw()
  }

  const data_chartConfigurator = {
    chartConfig
  }

  const methods_chartConfigurator = {
    handleClickClear,
    handleClickDraw,
    set_chartConfig
  }

  const dataSets = [
    {
      data: dataSet,
      borderColor: `rgba(${colorRGB}, 1)`,
      label: keyObj.name
    }
  ]

  return (
    <div className={$s.chart} key={keyObj.key}>
      {<div className={$s.chart_body}>
        <KeyChart
          dataSets={dataSets}
        />
      </div>}
      {!shouldHideHeader &&
        <div className={$s.chart_header}>
          <ChartConfigurator data={data_chartConfigurator} methods={methods_chartConfigurator} />
        </div>
      }
    </div>
  )
}

export default ItemChart;