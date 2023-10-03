import CountryFlag from '../CountryFlag';
import $s from './style.module.scss';

function CountrySelector({countries, selectedCountry, onSelectCountry}) {
  const countriesOptions = [<option key={'all'} value="all">ALL</option>]

  countries?.forEach(country => {
    countriesOptions.push(<option key={'country_' + country} value={country}>{country.toUpperCase()}</option>)
  })

  return (
    <div className={$s.wrapper}>
      <select className={$s.select} value={selectedCountry} onChange={onSelectCountry}>
        {countriesOptions}
      </select>
      <CountryFlag country={selectedCountry} />
    </div>
  )
}

export default CountrySelector;