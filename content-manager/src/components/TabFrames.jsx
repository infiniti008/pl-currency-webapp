import { useContext, useState } from 'react';
import CurrentStoreContext from '../contexsts/store';

import 'react-toastify/dist/ReactToastify.css';

import videoFrameModel from '../models/videoFrameModel';

import IconPlus from './icons/Plus';
import IconVideoFrame from './icons/VideoFrame';
import Inputs from './ui/Inputs';

const { descriptor, model } = videoFrameModel;

function TabFrames() {
  const {
    currentStore,
    setCurrentStore
  } = useContext(CurrentStoreContext);

  const [selectedFrame, setSelectedFrame] = useState(null)
  const subscription = currentStore.subscriptionToOpenInModal

  function handleSelectFrame(index) {
    setSelectedFrame(index)
  }

  function handleMoveLeft(index) {
    const clonedSubscription = { ...subscription }
    const frame = clonedSubscription.frames[index]
    const previousFrame = clonedSubscription.frames[index - 1]
    if (previousFrame) {
      clonedSubscription.frames[index] = previousFrame
      clonedSubscription.frames[index - 1] = frame
      previousFrame.index = index
      frame.index = index - 1
      setCurrentStore({
        ...currentStore,
        subscriptionToOpenInModal: clonedSubscription
      })
    }
  }

  function handleMoveRight(index) {
    const clonedSubscription = { ...subscription }
    const frame = clonedSubscription.frames[index]
    const nextFrame = clonedSubscription.frames[index + 1]
    if (nextFrame) {
      frame.index = index + 1
      nextFrame.index = index
      clonedSubscription.frames[index] = nextFrame
      clonedSubscription.frames[index + 1] = frame
      setCurrentStore({
        ...currentStore,
        subscriptionToOpenInModal: clonedSubscription
      })
    }
  }

  function handleDeleteFrame(index) {
    const clonedSubscription = { ...subscription }
    clonedSubscription.frames.splice(index, 1)
    setCurrentStore({
      ...currentStore,
      subscriptionToOpenInModal: clonedSubscription
    })
  }

  const frames = () => {
    return subscription.frames.sort((a, b) => a.index - b.index).map((frame, index) => {
      const frameClasses = [
        'frame',
        selectedFrame === index ? 'active' : ''
      ].join(' ')
      return (
        <div className={ frameClasses } key={index}>
          <IconVideoFrame onClick={ handleSelectFrame.bind(null, index) }/>
          <div className='frameControls'>
            <div onClick={handleMoveLeft.bind(null, index)}>{'<-'}</div>
            <div onClick={handleDeleteFrame.bind(null, index)}>-</div>
            <div onClick={handleMoveRight.bind(null, index)}>{'->'}</div>
          </div>
        </div>
      )
    })
  }

  function handleAddFrame() {
    const clonedSubscription = { ...subscription }
    const newModel = { ...videoFrameModel.model }
    newModel.index = subscription.frames.length
    clonedSubscription.frames.push(newModel)
    setCurrentStore({
      ...currentStore,
      subscriptionToOpenInModal: clonedSubscription
    })
  }

  function handleUpdateOption(key, value) {
    const clonedSubscription = {...subscription}
    const frame = clonedSubscription.frames[selectedFrame]
    frame[key] = value
    setCurrentStore({
      ...currentStore,
      subscriptionToOpenInModal: clonedSubscription
    })
  }

  const optionsObj = currentStore?.appSettings?.appSettings || {}
  optionsObj.templates = currentStore?.renderSettings.templates

  return (
    <div className='tab tab-frames'>
      <div className='tab-content'>
        { selectedFrame !== null && <Inputs descriptorModel={descriptor} handleUpdateOption={handleUpdateOption} object={subscription.frames[selectedFrame]} model={model} optionsObj={optionsObj} /> }        
      </div>
      <div className="tab-footer">
        <IconPlus onClick={handleAddFrame}/>
        { frames() }
      </div>
      
    </div>
  )
}

export default TabFrames
