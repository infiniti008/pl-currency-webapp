import React, { useState } from 'react';
import { toast } from 'react-toastify';
import '../../assets/css/Toasts.scss'
import renderSettingsModel from '../../models/renderSettingsModel';
const { descriptor } = renderSettingsModel

const initModel = Object.keys(descriptor).reduce((acc, key) => {
  const descriptorItem = descriptor[key]
  if (descriptorItem?.editable && descriptorItem.inputType === 'checkbox') {
    const item = {
      key,
      name: descriptorItem.name,
      value: false
    }
    acc.push(item)
  }
  return acc
}, [])


function PromptToast({ onConfirm, onCancel, subscription }) {
  const [renderSettings, setRenderSettings] = useState(initModel)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [time, setTime] = useState(new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }))

  function handleOnChangeCheckbox(key, event) {
    const clonedSettings = [...renderSettings]
    
    const foundItem = clonedSettings.find(item => item.key === key)
    foundItem.value = event.target.checked

    setRenderSettings(clonedSettings)
  }

  const items = renderSettings.map((item) => {
    return (
      <label className='label label--inline' key={item.key}>
        {item.name}
        <input type="checkbox" checked={item.value} onChange={handleOnChangeCheckbox.bind(null, item.key)} />
      </label>
    )
  })

  const output = {
    renderSettings: renderSettings.reduce((acc, item) => {
      acc[item.key] = item.value
      return acc
    }, {}),
    date,
    time,
  }

  return (
    <div className='toast-promt post-now'>
      {items}
      <input type="time" value={time} onChange={(event => setTime(event.target.value))} />
      <input type="date" value={date} onChange={(event => setDate(event.target.value))} />
      <button onClick={onConfirm?.bind(null, output)}>Confirm</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}

function displayPostNowPrompt(subscription) {
  return new Promise((resolve) => {

    function onConfirm (data) {
      toast.dismiss()
      resolve(data)
    };
  
    function onCancel () {
      toast.dismiss()
      resolve(null);
    };

    toast(<PromptToast onConfirm={onConfirm} onCancel={onCancel} subscription={subscription} />, {
      position: "top-center",
      autoClose: false,
      closeOnClick: false
    });
  })
}

export default displayPostNowPrompt