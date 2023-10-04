import { useContext, useState, useEffect } from 'react';
import CurrentStoreContext from '../../../contexsts/store';
import { EventBusContext } from '../../../contexsts/eventBus';
import { ToastContainer, toast } from 'react-toastify';

import $s from './style.module.scss';
import { getLastValues } from '../../../api/services';
import keyModel from '../../../models/keyModel';

import Header from './header';
import KeyItem from './item';

const INITIAL_COUNTRY = 'all'
const INITIAL_TIME_LIMIT = 10
const INITIAL_SORT_BY = 'timestamp'
const INITIAL_CURRENCY = 'all'
const INITIAL_OPERATION = 'all'
const INITIAL_BANK = 'all'
const { model } = keyModel;

let currenciesSet = new Set()
let operationsSet = new Set()
let banksSet = new Set()

function ModalKeys() {
  const { emit } = useContext(EventBusContext)
  const {
    currentStore,
    setCurrentStore
  } = useContext(CurrentStoreContext)

  const countries = currentStore?.appSettings?.appSettings?.countries
  const initialKeys = [...currentStore?.keys]

  const [selectedCountry, setSelectedCountry] = useState(INITIAL_COUNTRY)
  const [keys, setKeys] = useState(initialKeys)
  const [selectedTimeLimit, setSelectedTimeLimit] = useState(INITIAL_TIME_LIMIT)
  const [sortBy, setSortBy] = useState(INITIAL_SORT_BY)
  const [selectedCurrency, setSelectedCurrency] = useState(INITIAL_CURRENCY)
  const [selectedOperation, setSelectedOperation] = useState(INITIAL_OPERATION)
  const [selectedBank, setSelectedBank] = useState(INITIAL_BANK)

  async function fetchLastValues() {
    countries?.forEach(async (country) => {
      try {
        const lastKeyValuesByCountry = await getLastValues(country)
        const clonedKeys = [...keys]

        lastKeyValuesByCountry.data.forEach(keyObj => {
          const lastValue = {
            value: keyObj.value,
            timestamp: keyObj.timestamp,
            date: keyObj.date
          }

          currenciesSet.add(keyObj.currency)
          operationsSet.add(keyObj.operation)
          banksSet.add(keyObj.bank)

          const currentKey = clonedKeys.find(keyItem => keyItem.key == keyObj.key)
          if (currentKey) {
            currentKey.lastValue = lastValue
          }
        })

        setKeys(clonedKeys)
      } catch (err) {
        console.log(err)
      }
    })
  }

  useEffect(() => {
    window.scrollTo({ top: 0 });
    document.body.style.overflow = 'hidden'

    fetchLastValues()
  }, [])


  function onClickClose() {
    const clonedStore = {...currentStore}
    clonedStore.isModalKeysOpened = !currentStore?.isModalKeysOpened

    setCurrentStore(clonedStore)

    document.body.style.overflow = ''
    document.body.style.marginRight = 'unset'
    emit('FETCH_ALL_SUBSCRIPTIONS', true)
  }

  function onClickCreate() {
    const clonedKeys = [...keys]
    const newKey = {...model}
    clonedKeys.unshift(newKey)
    setKeys(clonedKeys)
  }

  function sortKeys(items) {
    let sortedKeys = [...items]
    if (sortBy == 'timestamp') {
      sortedKeys = sortedKeys?.sort((a, b) => {
        if (a.lastValue?.timestamp > b.lastValue?.timestamp) {
          return 1
        } else if (a.lastValue?.timestamp < b.lastValue?.timestamp) {
          return -1
        } else {
          return 0
        }
      })
    }
    if (sortBy == 'value') {
      sortedKeys = sortedKeys?.sort((a, b) => {
        if (a.lastValue?.value > b.lastValue?.value) {
          return 1
        } else if (a.lastValue?.value < b.lastValue?.value) {
          return -1
        } else {
          return 0
        }
      })
    }

    return sortedKeys
  }

  function filterKeys(items) {
    let filteredKeys = [...items]
    if (selectedCurrency != 'all') {
      filteredKeys = filteredKeys?.filter(key => key.currency == selectedCurrency)
    }

    if (selectedOperation != 'all') {
      filteredKeys = filteredKeys?.filter(key => key.operation == selectedOperation)
    }

    if (selectedBank != 'all') {
      filteredKeys = filteredKeys?.filter(key => key.bank == selectedBank)
    }

    filteredKeys = filteredKeys.filter(key => (selectedCountry != 'all' && key.country == selectedCountry) || selectedCountry == 'all')

    return filteredKeys
  }

  const currencies = Array.from(currenciesSet)
  const operations = Array.from(operationsSet)
  const banks = Array.from(banksSet)
  
  const sortedKeys = sortKeys(keys)
  const filteredKeys = filterKeys(sortedKeys)

  const keyElements = filteredKeys.map(key => {
    return (
      <KeyItem key={key.key} keyObj={key} selectedTimeLimit={selectedTimeLimit} operations={operations} appSettings={currentStore?.appSettings?.appSettings || {}} />
    )
  })  

  return (
    <div className={$s.modal}>
      <Header
        countries={countries}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        onClickClose={onClickClose}
        selectedTimeLimit={selectedTimeLimit}
        setSelectedTimeLimit={setSelectedTimeLimit}
        sortBy={sortBy}
        setSortBy={setSortBy}
        currencies={currencies}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
        selectedOperation={selectedOperation}
        setSelectedOperation={setSelectedOperation}
        operations={operations}
        onClickCreate={onClickCreate}
        banks={banks}
        selectedBank={selectedBank}
        setSelectedBank={setSelectedBank}
      />
      <div className={$s.body}>
        {keyElements}
      </div>
      <ToastContainer />
    </div>
  )
}

export default ModalKeys