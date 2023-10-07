import ItemChart from './itemChart';
import ChartConfigurator from './chartConfigurator';

import { useState } from 'react';
import { format, addMinutes, parse, sub } from 'date-fns'
import { formatInTimeZone, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'

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


  async function handleClickDraw() {
    console.log('handleClickDraw')
    set_shouldDrawChart(false)
    setTimeout(() => {
      set_shouldDrawChart(true)
    }, 100)
  }

  function handleClickClear() {
    console.log('handleClickClear')
    set_shouldDrawChart(false)
  }


  const data_chartConfigurator = {
    chartConfig
  }

  const methods_chartConfigurator = {
    handleClickClear,
    handleClickDraw,
    set_chartConfig
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
      {shouldDrawChart && items}
    </div>
  )
}

export default MainDropdown;