import { useState, useEffect } from 'react'
import '../assets/css/Sheet.scss'
import { getRows, getSubscriptions } from '../api/services'
import Day from './Day'

const initialRows = getRows();

function Sheet({store, updateStore}) {
  const [rows, setRows] = useState(initialRows);

  useEffect(() => {
    async function fetchData() {
      try {
        const rows = await getSubscriptions();
        console.log('rows', rows);
        setRows(rows)
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }

    fetchData();
  }, []);

  const timeItems = rows.map((row) => {
    const days = row.days.map(day => <Day store={store} updateStore={updateStore} key={day.index} day={day}/>);

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
