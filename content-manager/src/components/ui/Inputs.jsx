import { useContext } from 'react';
import CurrentStoreContext from '../../contexsts/store';

import Input from './Input';
import Select from './Select';
import Checkbox from './Checkbox';
import Time from './Time';
import Times from './Times';
import Color from './Color';
import Week from './Week';
import Keys from './Keys';

import '../../assets/css/Inputs.scss'

function Inputs({object, handleUpdateOption, descriptorModel, model}) {

  const {
    currentStore
  } = useContext(CurrentStoreContext);

  const appSettings = currentStore?.appSettings?.appSettings || {}
  const keysArr = currentStore?.appSettings['keys_' + object.country] || []

  const inputs = Object.keys(object).filter(key => descriptorModel[key]?.editable).map(key => {
    const objectPropperty = object[key] ?? model[key]
    const inputType = descriptorModel[key].inputType

    switch (inputType) {
      case 'text':
        return (<Input 
          key={key}
          value={objectPropperty}
          itemKey={key}
          handleUpdateOption={handleUpdateOption.bind(null, key)}
          descriptor={descriptorModel[key]}
          isInline={descriptorModel[key].isInline}
          isRequired={descriptorModel[key].isRequired}
        />)
      case 'checkbox':
        return (<Checkbox 
          key={key}
          value={objectPropperty}
          itemKey={key}
          handleUpdateOption={handleUpdateOption.bind(null, key)}
          descriptor={descriptorModel[key]}
          isInline={descriptorModel[key].isInline}
          isRequired={descriptorModel[key].isRequired}
        />)
      case 'select':
        return (<Select 
          key={key}
          value={objectPropperty}
          itemKey={key}
          handleUpdateOption={handleUpdateOption.bind(null, key)}
          descriptor={descriptorModel[key]}
          options={appSettings[descriptorModel[key].optionsVariable]}
          isInline={descriptorModel[key].isInline}
          isRequired={descriptorModel[key].isRequired}
        />)
      case 'time':
        return (<Time 
          key={key}
          value={objectPropperty}
          itemKey={key}
          handleUpdateOption={handleUpdateOption.bind(null, key)}
          descriptor={descriptorModel[key]}
          isInline={descriptorModel[key].isInline}
          isRequired={descriptorModel[key].isRequired}
        />)
        case 'times':
      return (<Times 
          key={key}
          value={objectPropperty}
          itemKey={key}
          handleUpdateOption={handleUpdateOption.bind(null, key)}
          descriptor={descriptorModel[key]}
          isInline={descriptorModel[key].isInline}
          isRequired={descriptorModel[key].isRequired}
        />)
      case 'color':
        return (<Color 
          key={key}
          value={objectPropperty}
          itemKey={key}
          handleUpdateOption={handleUpdateOption.bind(null, key)}
          descriptor={descriptorModel[key]}
          isInline={descriptorModel[key].isInline}
          isRequired={descriptorModel[key].isRequired}
        />)
      case 'week':
        return (<Week 
          key={key}
          value={objectPropperty}
          itemKey={key}
          handleUpdateOption={handleUpdateOption.bind(null, key)}
          descriptor={descriptorModel[key]}
          isInline={descriptorModel[key].isInline}
          isRequired={descriptorModel[key].isRequired}
        />)
      case 'keys':
        return (<Keys 
          key={key}
          value={objectPropperty}
          itemKey={key}
          handleUpdateOption={handleUpdateOption.bind(null, key)}
          descriptor={descriptorModel[key]}
          options={keysArr}
          isInline={descriptorModel[key].isInline}
          isRequired={descriptorModel[key].isRequired}
        />)
      default:
        return <div>EMPTY</div>
    }
  })

  return inputs
}

export default Inputs