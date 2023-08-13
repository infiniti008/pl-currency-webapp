function Input({itemKey, value, handleUpdateOption, descriptor}) {

  function handleOnChange(event) {
    handleUpdateOption(event.target.value)
  }

  return (
    <div className="input-group">
      <label className='label' htmlFor={itemKey}>
        {descriptor?.name}
      </label>
      <input 
        className='input' 
        type={descriptor?.inputType} 
        name={itemKey} 
        id={itemKey} 
        value={descriptor?.inputType === 'text' && value}
        onChange={handleOnChange}
      />
    </div>
  )
}

export default Input