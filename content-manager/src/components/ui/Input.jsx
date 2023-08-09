import { useState } from 'react';

import renderSettingsModel from '../../models/renderSettingsModel';
import '../../assets/css/Input.scss'


const { descriptor } = renderSettingsModel;

function Input({itemKey, value, handleUpdateOption}) {
  const descriptorItem = descriptor[itemKey]

  function handleOnChange(event) {
    if (descriptorItem?.inputType === 'checkbox') {
      handleUpdateOption(event.target.checked)
    } else if (descriptorItem?.inputType === 'text') {
      handleUpdateOption(event.target.value)
    }
  }

  return (
    <div className="input-group">
      <label className='label' htmlFor={itemKey}>
        {descriptorItem?.name}
      </label>
      <input 
        className='input' 
        type={descriptorItem?.inputType} 
        name={itemKey} 
        id={itemKey} 
        value={descriptorItem?.inputType === 'text' && value}
        checked={descriptorItem?.inputType === 'checkbox' && value}
        onChange={handleOnChange}
      />
    </div>
  )
}

export default Input