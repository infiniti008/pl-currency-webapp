function Select({itemKey, value, handleUpdateOption, descriptor}) {
  function handleOnChange(event) {
    handleUpdateOption(event.target.value)
  }

  const options = descriptor?.options?.map(option => {
    return (
      <option key={option.name} value={option.value}>{option.name}</option>
    )
  })

  return (
    <div className="input-group">
      <label className='label' htmlFor={itemKey}>
        {descriptor?.name}
      </label>
      <select 
        name={itemKey}
        id={itemKey}
        onChange={handleOnChange}
        value={value}
      >
        {options}
      </select>
    </div>
  )
}

export default Select