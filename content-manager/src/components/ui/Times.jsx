import React, { useState } from 'react';

function Times({itemKey, value, handleUpdateOption, descriptor, isInline, isRequired}) {
  const [selectedTime, setSelectedTime] = useState('09:00')

  function handleOnChange(event) {
    setSelectedTime(event.target.value)
  }

  function addTime() {
    const newTimes = [...value]
    newTimes.push(selectedTime)

    newTimes.sort((a, b) => {
      const valA = parseInt(a.split(':').join(''))
      const valB = parseInt(b.split(':').join(''))
      if (valA > valB) return 1
      else if(valA < valB) return -1
      else return 0
    })

    handleUpdateOption(newTimes)
  }

  function removeTime(time) {
    const newTimes = value.filter(valueTime => valueTime !== time)

    handleUpdateOption(newTimes)
  }

  const addedTimes = value.map((time, index) => {
    return (
      <div className="times-wrapper__time" key={time + index}>
        <span className="times-wrapper__time-value">
          {time}
        </span>
        <span onClick={removeTime.bind(null, time)} className="times-wrapper__time-delete">-</span>
      </div>
    )
  })


  const classes = 'input-group ' + (isInline ? 'input-group--inline' : '')
  const labelClasses = 'label '

  return (
    <div className={classes}>
      <label className={labelClasses} htmlFor={itemKey}>
        {descriptor?.name}
        {isRequired ? <span className="required">*</span> : ''}
      </label>
      <div className='times-wrapper__time-add-new'>
        <input 
          className='input' 
          type='time' 
          name={itemKey} 
          id='add-time-input' 
          value={selectedTime}
          onChange={handleOnChange}
        />
        <span className='times-wrapper__time-add' onClick={addTime}>+</span>
      </div>
      <div className="times-wrapper">
        {addedTimes}
      </div>
    </div>
  )
}

export default Times