function TextArea({itemKey, value, handleUpdateOption, descriptor, isInline, isRequired}) {
  const joinValue = value?.join(descriptor.arraySplitSeparator)

  function handleOnChange(event) {
    const arraySplitSeparator = descriptor.arraySplitSeparator
    const newValue = event.target.value.split(arraySplitSeparator)
    handleUpdateOption(newValue)
  }

  const classes = 'input-group ' + (isInline ? 'input-group--inline' : '')
  const labelClasses = 'label '

  return (
    <div className={classes}>
      <label className={labelClasses} htmlFor={itemKey}>
        {descriptor?.name}
        {isRequired ? <span className="required">*</span> : ''}
      </label>
      <textarea 
        className='text-area' 
        type={descriptor?.inputType} 
        name={itemKey} 
        id={itemKey} 
        value={joinValue}
        onChange={handleOnChange}
      />
    </div>
  )
}

export default TextArea