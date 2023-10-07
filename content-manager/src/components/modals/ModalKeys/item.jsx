import { useState, useContext, useEffect } from 'react';
import { EventBusContext } from '../../../contexsts/eventBus';

import $s from './style.module.scss';

import CountryFlag from '../../ui/CountryFlag';
import Status from '../../ui/Status';
import ItemDetails from './itemDetails';
import ItemChart from './itemChart';

function KeyItem({ keyObj, selectedTimeLimit, operations, appSettings, selectedKeys, handleToggleSelectKey }) {
  const diffLimit = 1000 * 60 * selectedTimeLimit
  const currentTimestamp = new Date().valueOf()
  const isNew = keyObj.lastValue?.timestamp > (currentTimestamp - diffLimit)

  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isChartOpen, setIsChartOpen] = useState(false)
  const { on, off, emit } = useContext(EventBusContext);

  useEffect(() => {
    const handleMessage = (key) => {
      if (keyObj.key !== key) {
        setIsDetailsOpen(false)
      }
    };

    on('COLLAPSE_ALL_KEY_DETAILS', handleMessage);

    return () => {
      off('COLLAPSE_ALL_KEY_DETAILS', handleMessage);
    };
  }, [on, off]);

  function handleClickDetails() {
    if (!isDetailsOpen) {
      emit('COLLAPSE_ALL_KEY_DETAILS', keyObj.key);
    }
    setIsDetailsOpen(!isDetailsOpen)
  }

  function handleClickChart() {
    if (!isChartOpen) {
      emit('COLLAPSE_ALL_KEY_CHARTS', keyObj.key);
    }
    setIsChartOpen(!isChartOpen)
  }

  function handleClickSelect(event) {
    handleToggleSelectKey(keyObj.key, event.target.checked)
  }

  const isActive = isDetailsOpen || isChartOpen
  const isSelected = selectedKeys.includes(keyObj.key)

  const classes = {
    key: [
      $s.key,
      isActive ? $s.key_active : ''
    ].join(' '),
    btn_chart: [
      $s.key_button,
      isChartOpen ? $s.key_active : ''
    ].join(' '),
    btn_details: [
      $s.key_button,
      isDetailsOpen ? $s.key_active : ''
    ].join(' ')
  }

  return (
    <div className={classes.key} key={keyObj.key}>
      <input type='checkbox' className={$s.key_checkbox} checked={isSelected} onChange={handleClickSelect} />
      <CountryFlag country={keyObj.country} />
      <div className={$s.key_currency}>{keyObj.currency}</div>
      <Status status={isNew} />
      <div className={$s.key_name}>{keyObj.name}</div>
      <div className={$s.key_value}>{keyObj.lastValue?.value.toFixed(4)}</div>
      <div className={$s.key_bank}>{keyObj.bank}</div>
      <div className={$s.key_date}>{keyObj.lastValue?.date}</div>
      <button className={classes.btn_chart} onClick={handleClickChart}>Chart</button>
      <button className={classes.btn_details} onClick={handleClickDetails}>Details</button>
      {isDetailsOpen && <ItemDetails keyObj={keyObj} operations={operations} appSettings={appSettings} />}
      {isChartOpen && <ItemChart keyObj={keyObj} operations={operations} appSettings={appSettings} />}
    </div>
  )
}

export default KeyItem