function Checkbox({itemKey, value, handleUpdateOption, descriptor}) {

  function handleOnChange(event) {
    handleUpdateOption(event.target.checked)
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
        checked={descriptor?.inputType === 'checkbox' && value}
        onChange={handleOnChange}
      />
    </div>
  )
}

export default Checkbox