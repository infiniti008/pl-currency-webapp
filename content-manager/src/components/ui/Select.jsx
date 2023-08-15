function Select({itemKey, value, handleUpdateOption, descriptor, options, isInline}) {
  function handleOnChange(event) {
    handleUpdateOption(event.target.value)
  }

  const classes = 'input-group ' + (isInline ? 'input-group--inline' : '')

  const optionElements = options?.map(option => {
    return (
      <option key={option} value={option}>{option.toUpperCase()}</option>
    )
  })

  return (
    <div className={classes}>
      <label className='label' htmlFor={itemKey}>
        {descriptor?.name}
      </label>
      <select 
        name={itemKey}
        id={itemKey}
        onChange={handleOnChange}
        value={value}
      >
        {optionElements}
      </select>
    </div>
  )
}

export default Select