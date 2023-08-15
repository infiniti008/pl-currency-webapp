function Color({itemKey, value, handleUpdateOption, descriptor, isInline}) {
  function handleOnChange(event) {
    handleUpdateOption(event.target.value)
  }

  const name = descriptor?.name.replace('{COLOR}', value) || ''
  const classes = 'input-group ' + (isInline ? 'input-group--inline' : '')

  return (
    <div className={classes}>
      <label className='label' htmlFor={itemKey}>
        {name}
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

export default Color