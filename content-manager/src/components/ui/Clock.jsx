import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'

const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

function Clock({ timeZone, setIsAllHidden }) {
  const [time, setTime] = useState('')

  useEffect(() => {
    setTimeout(() => {
      const currentTime = new Date()
      const utcDate = zonedTimeToUtc(currentTime, currentTimeZone);
      const targetTime = utcToZonedTime(utcDate, timeZone);

      const splittedTime = format(targetTime, 'HH:mm:ss').split('').map((char, i) => <span key={'clock-char-' + i} className='clock__time-char'>{char}</span>)
      setTime(splittedTime)
    }, 1000)
  }, [time])

  return (
    <div className="clock" onClick={setIsAllHidden}>
      {format(new Date(), 'd MMM yyyy')}
      <span>  -  </span>
      {time}
    </div>
  )
}

export default Clock