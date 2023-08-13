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

  const timeItems = rows?.map((row) => {
    const days = row.days?.map(day => <Day store={store} updateStore={updateStore} key={day.index} day={day}/>);

    return <div key={ row.index } className='time-row'>
      <div className='time'>
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
