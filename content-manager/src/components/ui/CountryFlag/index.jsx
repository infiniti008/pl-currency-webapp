import IconFlagBelarus from '../../icons/IconFlagBelarus';
import IconFlagPoland from '../../icons/IconFlagPoland';
import IconFlagAll from '../../icons/IconFlagAll';

function CountryFlag({country}) {
  let countryFlag = ''
  if (country == 'pl') {
    countryFlag = <IconFlagPoland />
  } else if (country == 'by') {
    countryFlag = <IconFlagBelarus />
  } else if (country == 'all') {
    countryFlag = <IconFlagAll />
  }

  return countryFlag
}

export default CountryFlag;