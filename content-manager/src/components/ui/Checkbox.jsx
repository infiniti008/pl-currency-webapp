function Checkbox({itemKey, value, handleUpdateOption, descriptor, isInline, isRequired}) {

  function handleOnChange(event) {
    handleUpdateOption(event.target.checked)
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
        checked={descriptor?.inputType === 'checkbox' && value}
        onChange={handleOnChange}
      />
    </div>
  )
}

export default Checkbox