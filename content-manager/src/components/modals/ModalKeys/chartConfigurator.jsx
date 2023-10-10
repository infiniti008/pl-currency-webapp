import $s from './style.module.scss';

function ChartConfigurator({ data, methods }) {
  const { chartConfig, useOneChart } = data
  const { handleClickClear, handleClickDraw, set_chartConfig, set_useOneChart } = methods

  function handleSetValue(name, event) {
    const clone_chartConfig = { ...chartConfig }
    clone_chartConfig[name] = event.target.value
    set_chartConfig(clone_chartConfig)
  }

  let useOneChartCheckbox = null
  if (useOneChart !== undefined && useOneChart !== null && typeof set_useOneChart === 'function') {
    useOneChartCheckbox = (
      <div className={$s.input_group}>
        <span className={$s.label}>Use one chart</span>
        <input className={$s.input} type="checkbox" checked={useOneChart} onChange={set_useOneChart.bind(null, !useOneChart)} />
      </div>
    )
  }

  return (
    <div className={$s.chart_configurator}>
      <div className={$s.input_group}>
        <span className={$s.label}>Start Time</span>
        <input className={$s.input} type="time" value={chartConfig.startTime} onChange={handleSetValue.bind(null, 'startTime')} />
      </div>

      <div className={$s.input_group}>
        <span className={$s.label}>Start Date</span>
        <input className={$s.input} type="date" value={chartConfig.startDate} onChange={handleSetValue.bind(null, 'startDate')} />
      </div>

      <div className={$s.input_group}>
        <span className={$s.label}>End Time</span>
        <input className={$s.input} type="time" value={chartConfig.endTime} onChange={handleSetValue.bind(null, 'endTime')} />
      </div>

      <div className={$s.input_group}>
        <span className={$s.label}>End Date</span>
        <input className={$s.input} type="date" value={chartConfig.endDate} onChange={handleSetValue.bind(null, 'endDate')} />
      </div>

      <div className={$s.input_group}>
        <span className={$s.label}>End Date</span>
        <input className={$s.input} type="date" value={chartConfig.endDate} onChange={handleSetValue.bind(null, 'endDate')} />
      </div>

      { useOneChartCheckbox }

      <button className={$s.button} onClick={handleClickClear} >Clear</button>
      <button className={$s.button} onClick={handleClickDraw} >Draw</button>
    </div>
  )
}

export default ChartConfigurator;