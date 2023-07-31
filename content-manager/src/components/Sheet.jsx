import { useState } from 'react'
import '../assets/css/Sheet.css'
import { getRows } from '../api/services'

const initialRows = getRows();
console.log(initialRows)

function Sheet() {
  const [rows, setRows] = useState(initialRows);

  const timeItems = rows.map((row) => {

    const days = row.days.map(day => {
      return <div className='day' key={ day.index }>
        { day.dayName }
      </div>
    });


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
