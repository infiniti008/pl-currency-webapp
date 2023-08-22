import React, { useState } from 'react';

function Keys({itemKey, value, handleUpdateOption, descriptor, options, isInline}) {
  const [keyInput, setKeyInput] = useState('')
  const [isDropdownOpened, setIsDropdownOpened] = useState(false)
  function handleAddKeyInput(event) {
    if (event.target.value) {
      setIsDropdownOpened(true)
    } else {
      setIsDropdownOpened(false)
    }
    setKeyInput(event.target.value)
  }

  const classes = 'input-group ' + (isInline ? 'input-group--inline' : '')

  const filteredOptions = options
    .filter(option => {
      return option.key?.includes(keyInput) || option.name?.includes(keyInput)
    })
    .filter(option => {
      const isOptionAdded = value.some(key => {
        return key === option.key
      })

      return !isOptionAdded
    })
    .map(option => {
      return (
      <span 
        className='keys-add__dropdown-item' 
        key={option.key} 
        onClick={handleAddKey.bind(null, option)}
      >
        {option.currency} - {option.name}
      </span>)
    })

  function removeKey(key) {
    const newKeys = value.filter(valueKey => valueKey !== key)

    handleUpdateOption(newKeys)
  }

  function handleAddKey(option) {
    const newKeys = [...value]
    newKeys.push(option.key)

    handleUpdateOption(newKeys)
  }

  function handleClickOutside(event) {
    if (!event.target.classList.value.includes('keys')) {
      document.removeEventListener('click', handleClickOutside)
      setIsDropdownOpened(false)
    }
  }

  document.removeEventListener('click', handleClickOutside)

  function handleOnClick(event) {
    if (!isDropdownOpened) {
      setIsDropdownOpened(!isDropdownOpened)

      document.addEventListener('click', handleClickOutside)
    }
  }

  const addedKeys = value.map((time, index) => {
    return (
      <div className="keys-wrapper__key" key={time + index}>
        <span className="keys-wrapper__key-value">
          {time}
        </span>
        <span onClick={removeKey.bind(null, time)} className="keys-wrapper__key-delete">-</span>
      </div>
    )
  })

  return (
    <div className={classes}>
      <label className='label' htmlFor={itemKey}>
        {descriptor?.name}
      </label>
      <div className="keys-add">
        <input 
          className="keys-add__input"
          type="text"
          value={keyInput}
          onChange={handleAddKeyInput}
          onClick={handleOnClick}
        />
        {isDropdownOpened && <div className="keys-add__dropdown">
          {filteredOptions}
        </div>}
      </div>
      <div className="keys-wrapper">
        {addedKeys}
      </div>
    </div>
  )
}

export default Keys