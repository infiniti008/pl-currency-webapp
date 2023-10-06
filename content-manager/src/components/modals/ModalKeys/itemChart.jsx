import { useState } from 'react';
import $s from './style.module.scss';
import { format, addMinutes, parse, sub } from 'date-fns'
import { formatInTimeZone, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'
import { getKeyData } from '../../../api/services';
import KeyChart from './chart.jsx';

const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

function ItemChart({ keyObj, operations, appSettings }) {
  const nowDate = new Date()
  const initialEndTime = format(nowDate, 'HH:mm')
  const initialStartTime = format(sub(nowDate, { hours: 3 }), 'HH:mm');
  const initialStartDate = format(nowDate, 'yyyy-MM-dd');
  const initialEndDate = format(nowDate, 'yyyy-MM-dd');

  const [startTime, set_startTime] = useState(initialStartTime)
  const [startDate, set_startDate] = useState(initialStartDate)
  const [endTime, set_endTime] = useState(initialEndTime)
  const [endDate, set_endDate] = useState(initialEndDate)
  const [dataSet, set_dataSet] = useState([])

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
    console.log('handleClickDraw')
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
  }

  function prepareDataToChart(data) {
    const timeZone = getTimeZone(keyObj.country)
    const newDataSet = []

    data.forEach(item => {
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

  return (
    <div className={$s.chart}>
      {<div className={$s.chart_body}>
        <KeyChart
          key={keyObj.key}
          dataSet={dataSet}
          selectedKey={keyObj.key}
          colorRGB={colorRGB}
        />
      </div>}
      <div className={$s.chart_header}>
        <div className={$s.input_group}>
          <span className={$s.label}>Start Time</span>
          <input className={$s.input} type="time" value={startTime} onChange={e => set_startTime(e.target.value)} />
        </div>

        <div className={$s.input_group}>
          <span className={$s.label}>Start Date</span>
          <input className={$s.input} type="date" value={startDate} onChange={e => set_startDate(e.target.value)} />
        </div>

        <div className={$s.input_group}>
          <span className={$s.label}>End Time</span>
          <input className={$s.input} type="time" value={endTime} onChange={e => set_endTime(e.target.value)} />
        </div>

        <div className={$s.input_group}>
          <span className={$s.label}>End Date</span>
          <input className={$s.input} type="date" value={endDate} onChange={e => set_endDate(e.target.value)} />
        </div>

        <button className={$s.button} onClick={handleClickClear} >Clear</button>
        <button className={$s.button} onClick={handleClickDraw} >Draw</button>
      </div>
    </div>
  )
}

export default ItemChart;