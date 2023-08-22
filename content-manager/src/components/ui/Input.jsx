function Input({itemKey, value, handleUpdateOption, descriptor, isInline, isRequired}) {

  function handleOnChange(event) {
    handleUpdateOption(event.target.value)
  }

  const classes = 'input-group ' + (isInline ? 'input-group--inline' : '')
  const labelClasses = 'label '

  return (
    <div className={classes}>
      <label className={labelClasses} htmlFor={itemKey}>
        {descriptor?.name}
        {isRequired ? <span className="required">*</span> : ''}
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

export default Input