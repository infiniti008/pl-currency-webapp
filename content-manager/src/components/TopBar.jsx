import { useContext } from 'react';
import CurrentStoreContext from '../contexsts/store';
import storiesModel from '../models/storiesModel';

import IconFlagBelarus from './icons/IconFlagBelarus';
import IconFlagPoland from './icons/IconFlagPoland';
import IconFlagAll from './icons/IconFlagAll';

import '../assets/css/TopBar.scss'

const { model } = storiesModel;

function TopBar() {
  const {
    currentStore,
    setCurrentStore
  } = useContext(CurrentStoreContext);

  let selectedCountry = currentStore?.country;
  const countries = currentStore?.appSettings?.appSettings?.countries

  function onSelectCountry(event) {
    selectedCountry = event.target.value
    const clonedStore = {...currentStore}
    clonedStore.country = selectedCountry
    setCurrentStore(clonedStore)
  }

  function onClickSettings() {
    const clonedStore = {...currentStore}
    clonedStore.isSettingsOpen = !currentStore?.isSettingsOpen
    setCurrentStore(clonedStore)
  }

  function onClickCreate() {
    const clonedStore = {...currentStore}
    clonedStore.subscriptionToOpenInModal = model
    clonedStore.isModalSubscriptionOpen = !currentStore.isModalSubscriptionOpen
    setCurrentStore(clonedStore)
  }

  function onClickSwitchCollapse() {
    const clonedStore = {...currentStore}
    clonedStore.isEmptyRowsCollapsed = !clonedStore.isEmptyRowsCollapsed
    setCurrentStore(clonedStore)
  }

  let countryFlag = ''
  if (currentStore?.country == 'pl') {
    countryFlag = <IconFlagPoland />
  } else if (currentStore?.country == 'by') {
    countryFlag = <IconFlagBelarus />
  } else if (currentStore?.country == 'all') {
    countryFlag = <IconFlagAll />
  }

  const countriesOptions = [<option value="all">ALL</option>]
  
  countries?.forEach(country => {
    countriesOptions.push(<option value={country}>{country.toUpperCase()}</option>)
  })

  return (
    <div className='top-bar'>
      <button>
        Menu
      </button>
      <button onClick={onClickSettings}>
        Render Settings
      </button>
      <button onClick={onClickCreate}>
        Create
      </button>
      <button onClick={onClickSwitchCollapse}>
        Switch Collapsed
      </button>
      <div className='top-bar__country'>
        <select className='top-bar__country-select' value={selectedCountry} onChange={onSelectCountry}>
          <option value="all">ALL</option>
          <option value="pl">PL</option>
          <option value="by">BY</option>
        </select>
        {countryFlag}
      </div>
    </div>
  )
}

export default TopBar
