import { useState, useEffect } from 'react'

function Clock() {
  const [time, setTime] = useState('')

  useEffect(() => {
    setTimeout(() => {
      const currentTime = new Date().toLocaleTimeString('ru-RU')
      const splittedTime = currentTime.split('').map((char, i) => <span key={'clock-char-' + i} className='clock__time-char'>{char}</span>)
      setTime(splittedTime)
    }, 1000)
  }, [time])

  return (
    <div className="clock">
      {new Date().toLocaleDateString('ru-RU')}
      <span>  -  </span>
      {time}
    </div>
  )
}

export default Clock