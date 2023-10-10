import ItemChart from './itemChart';
import KeyChart from './chart.jsx';
import ChartConfigurator from './chartConfigurator';

import { useState } from 'react';
import { format, addMinutes, parse, sub } from 'date-fns'
import { getKeyData } from '../../../api/services';
import { formatInTimeZone, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'

const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

function getTimeZone(country) {
  if (country === 'by') {
    const tz = 'Europe/Minsk'
    return tz
  }

  const tz = 'Europe/Warsaw'
    return tz
}

import $s from './style.module.scss';

function MainDropdown({ keys, selectedKeys }) {
  const nowDate = new Date()
  const initialConfigState = {
    startTime: format(sub(nowDate, { hours: 3 }), 'HH:mm'),
    startDate: format(nowDate, 'yyyy-MM-dd'),
    endTime: format(nowDate, 'HH:mm'),
    endDate: format(nowDate, 'yyyy-MM-dd'),
  }

  const [chartConfig, set_chartConfig] = useState(initialConfigState)
  const [shouldDrawChart, set_shouldDrawChart] = useState(false)
  const [useOneChart, set_useOneChart] = useState(false)
  const [dataSets, set_datasets] = useState([])

  async function handleClickDraw() {
    console.log('handleClickDraw')
    set_shouldDrawChart(true)
    set_datasets([])
    if (useOneChart) {
      getChartData()
    }
  }

  async function getChartData() {
    const datas = await Promise.all(selectedKeys.map(async key => {
      const keyObj = keys.find(keyItem => keyItem.key == key)
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
        
      const data = await fetchChartData(startTimeStamp, endTimeStamp, keyObj)
      const colorRGB = parseHexColor(keyObj.bankColor)
      const preparedDataSet = {
        data: data,
        borderColor: `rgba(${colorRGB}, 1)`,
        label: `${keyObj.currency} | ${keyObj.name}`,
        yAxisID: `${keyObj.country}-${keyObj.currency}-${keyObj.currencyBase}`
      }

      return preparedDataSet
    }))

    set_datasets(datas)


  }

  async function fetchChartData(startTimeStamp, endTimeStamp, keyObj) {
    const request = {
      country: keyObj.country,
      key: keyObj.key,
      startTimeStamp,
      endTimeStamp
    }

    const data = await getKeyData(request)
    return prepareDataToChart(data, keyObj)
  }

  function prepareDataToChart(data, keyObj) {
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

  function handleClickClear() {
    console.log('handleClickClear')
    set_shouldDrawChart(false)
    set_datasets([])
  }

  const data_chartConfigurator = {
    chartConfig,
    useOneChart
  }

  const methods_chartConfigurator = {
    handleClickClear,
    handleClickDraw,
    set_chartConfig,
    set_useOneChart
  }

  const items = selectedKeys.map(key => {
    const keyObj = keys.find(keyItem => keyItem.key == key)

    return (
      <ItemChart key={key} keyObj={keyObj} isAutoDraw={true} initialStateProp={chartConfig} shouldHideHeader={true} />
    )
  })

  return (
    <div className={$s.dropdown}>
      <ChartConfigurator data={data_chartConfigurator} methods={methods_chartConfigurator} />
      {(shouldDrawChart && !useOneChart) && items}
      <div className={$s.dropdown__chart}>
        {(shouldDrawChart && useOneChart) && 
        <KeyChart
          key={'compare-chart-' + selectedKeys.join('-')}
          dataSets={dataSets}
          name={'compare-chart-' + selectedKeys.join('-')}
        />}
      </div>
    </div>
  )
}

export default MainDropdown;