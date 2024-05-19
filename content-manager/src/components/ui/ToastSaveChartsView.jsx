import React, { useState } from 'react';
import { toast } from 'react-toastify';
import '../../assets/css/Toasts.scss'

function PromptToast({ onConfirm, onCancel, loadedChartsView }) {
  const [isAllHidden, setIsAllHidden] = useState(loadedChartsView.isAllHidden)
  const [isAutoRun, setAutoRun] = useState(loadedChartsView.isAutoRun)
  const [isStaticImage, setStaticImage] = useState(loadedChartsView.isStaticImage)
  const [chartsViewName, setChartsViewName] = useState(loadedChartsView.chartsViewName)

  function handleOnChangeCheckbox(setter, event) {
    setter(event.target.checked)
  }

  function handleOnChangeText(setter, event) {
    setter(event.target.value)
  }

  return (
    <div className='toast-promt save-chart-views'>
      <label className='label label--inline'>
        Is All Hidden
        <input type="checkbox" checked={isAllHidden} onChange={handleOnChangeCheckbox.bind(null, setIsAllHidden)} />
      </label>
      <label className='label label--inline'>
        Auto Run?
        <input type="checkbox" checked={isAutoRun} onChange={handleOnChangeCheckbox.bind(null, setAutoRun)} />
      </label>
      <label className='label label--inline'>
        Static Image?
        <input type="checkbox" checked={isStaticImage} onChange={handleOnChangeCheckbox.bind(null, setStaticImage)} />
      </label>
      <label className='label'>
        Name (Without Spaces)
        <input type="text" value={chartsViewName} onChange={handleOnChangeText.bind(null, setChartsViewName)} />
      </label>
      <button onClick={onConfirm?.bind(null, { isAllHidden, chartsViewName, isAutoRun, isStaticImage })}>Confirm</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}

function displaySaveChartViewsPrompt(loadedChartsView) {
  return new Promise((resolve) => {

    function onConfirm (data) {
      toast.dismiss()
      resolve(data)
    };
  
    function onCancel () {
      toast.dismiss()
      resolve(null);
    };

    toast(<PromptToast onConfirm={onConfirm} onCancel={onCancel} loadedChartsView={loadedChartsView} />, {
      position: "top-center",
      autoClose: false,
      closeOnClick: false
    });
  })
}

export default displaySaveChartViewsPrompt