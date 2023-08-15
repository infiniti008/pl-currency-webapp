function Time({itemKey, value, handleUpdateOption, descriptor, isInline}) {
  function handleOnChange(event) {
    handleUpdateOption(event.target.value)
  }

  const classes = 'input-group ' + (isInline ? 'input-group--inline' : '')

  return (
    <div className={classes}>
      <label className='label' htmlFor={itemKey}>
        {descriptor?.name}
      </label>
      <input 
        className='input' 
        type={descriptor?.inputType} 
        name={itemKey} 
        id={itemKey} 
        value={value}
        onChange={handleOnChange}
      />
    </div>
  )
}

export default Time