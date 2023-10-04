import { useState, useContext, useEffect } from 'react';
import { EventBusContext } from '../../../contexsts/eventBus';

import $s from './style.module.scss';

import CountryFlag from '../../ui/CountryFlag';
import Status from '../../ui/Status';
import ItemDetails from './itemDetails';

function KeyItem({ keyObj, selectedTimeLimit, operations, appSettings }) {
  const diffLimit = 1000 * 60 * selectedTimeLimit
  const currentTimestamp = new Date().valueOf()
  const isNew = keyObj.lastValue?.timestamp > (currentTimestamp - diffLimit)

  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
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

  return (
    <div className={$s.key} key={keyObj.key}>
      <CountryFlag country={keyObj.country} />
      <div className={$s.key_currency}>{keyObj.currency}</div>
      <Status status={isNew} />
      <div className={$s.key_name}>{keyObj.name}</div>
      <div className={$s.key_value}>{keyObj.lastValue?.value.toFixed(4)}</div>
      <div className={$s.key_bank}>{keyObj.bank}</div>
      <div className={$s.key_date}>{keyObj.lastValue?.date}</div>
      <button className={$s.key_button} onClick={handleClickDetails}>Details</button>
      {isDetailsOpen && <ItemDetails keyObj={keyObj} operations={operations} appSettings={appSettings} />}
    </div>
  )
}

export default KeyItem