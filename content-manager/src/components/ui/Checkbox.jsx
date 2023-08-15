function Checkbox({itemKey, value, handleUpdateOption, descriptor, isInline}) {

  function handleOnChange(event) {
    handleUpdateOption(event.target.checked)
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
        checked={descriptor?.inputType === 'checkbox' && value}
        onChange={handleOnChange}
      />
    </div>
  )
}

export default Checkbox