import $s from './style.module.scss';

import CountrySelector from '../../ui/CountrySelector';

function Header({
  countries,
  selectedCountry,
  setSelectedCountry,
  onClickClose,
  selectedTimeLimit,
  setSelectedTimeLimit,
  sortBy,
  setSortBy,
  currencies,
  selectedCurrency,
  setSelectedCurrency,
  operations,
  selectedOperation,
  setSelectedOperation,
  onClickCreate,
  banks,
  selectedBank,
  setSelectedBank,
  onClickCompare
}) {
  function handleSetTimeLimit(event) {
    setSelectedTimeLimit(event.target.value)
  }

  function handleSetSortBy(event) {
    setSortBy(event.target.value)
  }

  function handleSetCurrency(event) {
    setSelectedCurrency(event.target.value)
  }

  function handleSetOperation(event) {
    setSelectedOperation(event.target.value)
  }

  function handleSelectCountry(event) {
    setSelectedCountry(event.target.value)
  }

  function handleSetBank(event) {
    setSelectedBank(event.target.value)
  }

  const currencyOptions = currencies.map(currency => {
    return <option key={'currency_' + currency} value={currency}>{currency.toUpperCase()}</option>
  })

  const operationOptions = operations.map(operation => {
    return <option key={'operation_' + operation} value={operation}>{operation.toUpperCase()}</option>
  })

  const bankOptions = banks.map(bank => {
    return <option key={'bank_' + bank} value={bank}>{bank.toUpperCase()}</option>
  })

  return (
    <div className={$s.header}>
      <div className={$s.header_item}>
        <span className={$s.item_label}>Country</span>
        <CountrySelector countries={countries} selectedCountry={selectedCountry} onSelectCountry={handleSelectCountry} />
      </div>

      <div className={$s.header_item}>
        <span className={$s.item_label}>Time Limit</span>
        <input className={$s.time_limit} type="number" value={selectedTimeLimit} onChange={handleSetTimeLimit} />
      </div>

      <div className={$s.header_item}>
        <span className={$s.item_label}>Filter by Currency</span>
        <select className={$s.currency} value={selectedCurrency} onChange={handleSetCurrency}>
          <option value="all">ALL</option>
          {currencyOptions}
        </select>
      </div>

      <div className={$s.header_item}>
        <span className={$s.item_label}>Filter by Bank</span>
        <select className={$s.bank} value={selectedBank} onChange={handleSetBank}>
          <option value="all">ALL</option>
          {bankOptions}
        </select>
      </div>

      <div className={$s.header_item}>
        <span className={$s.item_label}>Filter by Operation</span>
        <select className={$s.operation} value={selectedOperation} onChange={handleSetOperation}>
          <option value="all">ALL</option>
          {operationOptions}
        </select>
      </div>

      <div className={$s.header_item}>
        <span className={$s.item_label}>Sort by</span>
        <select className={$s.sort_by} value={sortBy} onChange={handleSetSortBy}>
          <option value="timestamp">Timestamp</option>
          <option value="value">Value</option>
        </select>
      </div>

      <button onClick={onClickCompare} className={$s.btn_close}>Compare</button>

      <button onClick={onClickCreate} className={$s.btn_close}>Create</button>

      <button onClick={onClickClose} className={$s.btn_close}>Close</button>
    </div>
  )
}

export default Header;