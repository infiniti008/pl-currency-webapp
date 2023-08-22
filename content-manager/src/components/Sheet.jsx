import { useState, useEffect, useContext } from 'react'
import CurrentStoreContext from '../contexsts/store';
import '../assets/css/Sheet.scss'
import { getRows, getSubscriptions } from '../api/services'
import Day from './Day'
import { EventBusContext } from './../contexsts/eventBus';

const initialRows = getRows();

function Sheet({store, updateStore}) {
  const { on, off } = useContext(EventBusContext);
  const {
    currentStore,
    setCurrentStore
  } = useContext(CurrentStoreContext)

  const [rows, setRows] = useState(initialRows);

  async function fetchData() {
    try {
      const rows = await getSubscriptions();
      setRows(rows)
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  useEffect(() => {
    fetchData()
  }, []);

  useEffect(() => {
    const handleMessage = (message) => {
      if (message === true) {
        fetchData();
      }
    };

    on('FETCH_ALL_SUBSCRIPTIONS', handleMessage);

    return () => {
      off('FETCH_ALL_SUBSCRIPTIONS', handleMessage);
    };
  }, [on, off]);

  function checkSameTimeRange(time) {
    const now = new Date().toLocaleTimeString()
    const minutes = now.split(':')[1]
    const hours = now.split(':')[0]
    const splitedTime = time.split(':')
    const isHourPass = hours === splitedTime[0]
    const isMinutesPass = parseInt(minutes) >= parseInt(splitedTime[1]) && parseInt(minutes) < parseInt(splitedTime[1]) + 5
    const isSameTimeRange = isHourPass && isMinutesPass

    return isSameTimeRange
  }

  function checkSameDay(day) {
    const now = new Date()
    let dayOfWeek = now.getDay() - 1;
    if (dayOfWeek === -1) {
      dayOfWeek = 6;
    }
    const isSameDay = dayOfWeek === day.dayIndex

    return isSameDay
  }

  const timeItems = rows?.map((row, rowIndex) => {
    const days = row.days?.map(day => {
      return <Day store={store} updateStore={updateStore} key={day.index} day={day} isSameDay={checkSameDay(day)}/>
    });

    const isRowEmpty = row.days.every(day => day.subscriptions.length === 0)
    const isPrevRowEmpty = rows[rowIndex - 1]?.days.every(day => day.subscriptions.length === 0) || false
    const isNextRowEmpty = rows[rowIndex + 1]?.days.every(day => day.subscriptions.length === 0) || false
    const isSameTimeRange = checkSameTimeRange(row.time)
    const isRowCanBeHidden = currentStore.isEmptyRowsCollapsed && isRowEmpty && isPrevRowEmpty && isNextRowEmpty && !isSameTimeRange
    

    const isHiddenRowClass = isRowCanBeHidden ? 'time-row--hidden' : ''
    const isEmptyRowClass = isRowEmpty ? 'time-row--empty' : ''
    const isSameTimeRowClass = isSameTimeRange ? 'time-row--current' : ''
    const isSameTimeClass = isSameTimeRange ? 'time--current' : ''

    const rowClasses = `time-row ${isSameTimeRowClass} ${isEmptyRowClass} ${isHiddenRowClass}`
    const timeClasses = `time ${isSameTimeClass}`

    return <div key={ row.index } className={rowClasses}>
      <div className={timeClasses}>
        { row.time }
      </div>
      { days }
    </div>
  });

  
  return (
    <div className='sheet'>
      {timeItems}
    </div>
  )
}

export default Sheet
