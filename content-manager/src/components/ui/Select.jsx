function Select({itemKey, value, handleUpdateOption, descriptor, options, isInline, isRequired, isDidabled}) {
  function handleOnChange(event) {
    handleUpdateOption(event.target.value)
  }

  const classes = 'input-group ' + (isInline ? 'input-group--inline' : '')
  const labelClasses = 'label '

  const optionElements = options?.map(option => {
    return (
      <option key={option} value={option}>{option}</option>
    )
  })

  return (
    <div className={classes}>
      <label className={labelClasses} htmlFor={itemKey}>
        {descriptor?.name}
        {isRequired ? <span className="required">*</span> : ''}
      </label>
      <select 
        name={itemKey}
        id={itemKey}
        onChange={handleOnChange}
        value={value}
        disabled={isDidabled}
      >
        <option value='' disabled>Select Item</option>
        {optionElements}
      </select>
    </div>
  )
}

export default Select