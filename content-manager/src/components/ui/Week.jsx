function Week({itemKey, value, handleUpdateOption, descriptor, isInline}) {
  function handleOnChange(index, event) {
    weekArray[index] = event.target.checked ? '*' : '_'
    handleUpdateOption(weekArray.join(''))
  }

  const days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']

  const classes = 'input-group ' + (isInline ? 'input-group--inline' : '')
  const weekArray = value.split('')

  const daysOfWeek = weekArray.map((day, index) => {
    return (
      <span key={'day-' + index}>
        <label className='label' htmlFor={itemKey + '-' + index}>
          <input 
            className='input' 
            type='checkbox'
            name={itemKey} 
            id={itemKey + '-' + index} 
            checked={day === '*'}
            onChange={handleOnChange.bind(null, index)}
          />
          {days[index]}
        </label>
      </span>
    )
  })

  return (
    <div className={classes}>
      <span className="label">
        {descriptor?.name}
      </span>
      <div className='input-group__wrapper'>
        {daysOfWeek}
      </div>
    </div>
  )
}

export default Week