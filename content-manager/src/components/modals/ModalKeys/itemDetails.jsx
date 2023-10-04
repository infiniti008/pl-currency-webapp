import { useContext, useState } from 'react';
import { toast } from 'react-toastify';

import $s from './style.module.scss';
import keyModel from '../../../models/keyModel';
import Inputs from '../../ui/Inputs';
import { saveKey, createKey } from '../../../api/services';

const { descriptor, model } = keyModel;
let cachedKey = model

function ItemDetails({ keyObj, operations, appSettings }) {
  const defaultValue = keyObj
  cachedKey = defaultValue

  const [editableKey, setEditableKey] = useState(defaultValue)
  const isNewKey = editableKey._id == false

  function handleUpdateOption(key, value) {
    const clonedEditableKey = {...editableKey}
    clonedEditableKey[key] = value
    setEditableKey(clonedEditableKey)
  }

  function handleReset() {
    setEditableKey(cachedKey)
  }

  function handleSave() {
    const newKey = {...cachedKey}

    Object.assign(newKey, editableKey)
    for (const key in newKey) {
      if (descriptor[key]?.valueType === 'number' && newKey[key]) {
        newKey[key] = parseFloat(newKey[key])
      } else if (descriptor[key]?.valueType === 'string' && newKey[key]) {
        newKey[key] = newKey[key].trim()
      }
    }

    delete newKey.lastValue

    if (isModelValid(newKey)) {
      performSaveKey(newKey)
      toast.success("Model IS VALID!", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    } else {
      toast.error("Model is NOT VALID!", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  }

  async function performSaveKey(key) {
    const { country } = key
    try {
      let response = {status: false}
      if (isNewKey) {
        console.log('create', key)
        response = await createKey(key, country)
      } else {
        response = await saveKey(key, country)
      }

      if (response.status) {
        toast.success("KEY has been saved", {
          position: toast.POSITION.BOTTOM_RIGHT
        });
        
        cachedKey = key
      } else {
        toast.error("KEY has NOT been saved", {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      }

      console.log(response)
    } catch(err) {
      console.log(err)
      toast.error("Unable to save KEY", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  }

  function isModelValid(model) {
    for(let key in model) {
      if (descriptor[key]?.isRequired) {
        if (descriptor[key].valueType.includes('[]') && !model[key].length) {
          return false
        } else if (!model[key]) {
          return false
        }
      }
    }
    
    return true
  }
  
  const optionsObj = {
    operations: operations,
    countries: appSettings.countries || [],
  }

  const confirmButtonText = isNewKey ? 'Create' : 'Save'

  return (
    <div className={$s.details}>
      <Inputs descriptorModel={descriptor} handleUpdateOption={handleUpdateOption} object={editableKey} model={model} optionsObj={optionsObj} />
      <div className={$s.controls}>
        <button className={$s.button} onClick={handleReset}>Reset</button>
        <button className={$s.button} onClick={handleSave}>{confirmButtonText}</button>
      </div>
    </div>
  )
}

export default ItemDetails;