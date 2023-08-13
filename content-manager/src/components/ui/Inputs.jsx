import Input from './Input';
import Select from './Select';
import Checkbox from './Checkbox';

import '../../assets/css/Inputs.scss'

function Inputs({object, handleUpdateOption, descriptorModel, model}) {

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
        />)
      case 'checkbox':
        return (<Checkbox 
          key={key}
          value={objectPropperty}
          itemKey={key}
          handleUpdateOption={handleUpdateOption.bind(null, key)}
          descriptor={descriptorModel[key]}
        />)
      case 'select':
        return (<Select 
          key={key}
          value={objectPropperty}
          itemKey={key}
          handleUpdateOption={handleUpdateOption.bind(null, key)}
          descriptor={descriptorModel[key]}
        />)
      default:
        return <div>EMPTY</div>
    }
  })

  return inputs
}

export default Inputs