function Color({itemKey, value, handleUpdateOption, descriptor, isInline, isRequired}) {
  function handleOnChange(event) {
    handleUpdateOption(event.target.value)
  }

  const name = descriptor?.name.replace('{COLOR}', value) || ''
  const classes = 'input-group ' + (isInline ? 'input-group--inline' : '')

  return (
    <div className={classes}>
      <label style={{ color: value }} className='label' htmlFor={itemKey}>
        {name}
        {isRequired ? <span className="required">*</span> : ''}
      </label>
      <input 
        className='input' 
        type={descriptor?.inputType} 
        name={itemKey} 
        id={itemKey} 
        value={value}
        onChange={handleOnChange}
        style={{ '--after-color': value }}
      />
    </div>
  )
}

export default Color