import { useContext } from 'react';
import CurrentStoreContext from '../contexsts/store';
import storiesModel from '../models/storiesModel';
import videoModel from '../models/videoModel';

import IconFlagBelarus from './icons/IconFlagBelarus';
import IconFlagPoland from './icons/IconFlagPoland';
import IconStories from './icons/Stories';
import IconTelegram from './icons/Telegram';
import IconVideo from './icons/Video';

import '../assets/css/TopBar.scss'

const { model } = videoModel;

function TopBar() {
  const {
    currentStore,
    setCurrentStore
  } = useContext(CurrentStoreContext);

  const selectedCountry = currentStore?.country;
  const selectedPlatform = currentStore?.platform;
  const countries = currentStore?.appSettings?.appSettings?.countries

  function onSelectCountry(selectedCountry) {
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
    clonedStore.subscriptionToOpenInModal = {...model}
    clonedStore.isModalSubscriptionOpen = !currentStore.isModalSubscriptionOpen
    setCurrentStore(clonedStore)
  }

  function onClickSwitchCollapse() {
    const clonedStore = {...currentStore}
    clonedStore.isEmptyRowsCollapsed = !clonedStore.isEmptyRowsCollapsed
    setCurrentStore(clonedStore)
  }

  function onClickOpenStream() {
    const clonedStore = {...currentStore}
    clonedStore.isModalChartsOpened = !clonedStore.isModalChartsOpened
    setCurrentStore(clonedStore)
  }

  function onClickOpenKeys() {
    const clonedStore = {...currentStore}
    clonedStore.isModalKeysOpened = !clonedStore.isModalKeysOpened
    setCurrentStore(clonedStore)
  }

  function onClickFilterSubscription(platform) {
    const clonedStore = {...currentStore}
    clonedStore.platform = platform
    setCurrentStore(clonedStore)
  }

  function getCountryFlag(country) {
    if (country == 'pl') {
      return <IconFlagPoland />
    } else if (country == 'by') {
      return <IconFlagBelarus />
    } else if (country == 'all') {
      return 'ALL'
    }
  }

  function getIconWrapperClasses(country, itemToCompare) {
    const classes = ['icon-wrapper']
    if (country == itemToCompare) {
      classes.push('selected')
    }

    return classes.join(' ')
  }

  const countriesOptions = [
    <div className={ getIconWrapperClasses('all', selectedCountry) } onClick={ onSelectCountry.bind(null, 'all') } key='all'>
      { getCountryFlag('all') }
    </div>
  ]
  
  countries?.forEach(country => {
    countriesOptions.push(
      <div className={ getIconWrapperClasses(country, selectedCountry) } onClick={ onSelectCountry.bind(null, country) } key={ country }>
        { getCountryFlag(country) }
      </div>
    )
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
      <button onClick={onClickOpenKeys}>
        Show Keys
      </button>
      <button onClick={onClickOpenStream}>
        Open Stream Window
      </button>
      <div className="frame">
        <div className={ getIconWrapperClasses('subscriptions-telegram', selectedPlatform) } onClick={onClickFilterSubscription.bind(null, 'subscriptions-telegram')}>
          <IconTelegram />
        </div>
        <div className={ getIconWrapperClasses('subscriptions-stories', selectedPlatform) } onClick={onClickFilterSubscription.bind(null, 'subscriptions-stories')}>
          <IconStories />
        </div>
        <div className={ getIconWrapperClasses('subscriptions-video', selectedPlatform) } onClick={onClickFilterSubscription.bind(null, 'subscriptions-video')}>
          <IconVideo />
        </div>
        <div className={ getIconWrapperClasses('all', selectedPlatform) } onClick={onClickFilterSubscription.bind(null, 'all')}>
          ALL
        </div>
      </div>
      <div className="frame">
        { countriesOptions }
      </div>
    </div>
  )
}

export default TopBar
