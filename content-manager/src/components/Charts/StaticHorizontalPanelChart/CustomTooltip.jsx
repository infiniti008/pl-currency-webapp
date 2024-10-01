import $s from './Tooltipe.module.scss'

const thinChars = ['.', ',', ';', ':']

function CustomTooltip({ currencyKey, firstPoint, lastPoint, colorRGB}) {  
  const startEndDiff = (lastPoint?.y - firstPoint?.y)
  const startEndDiffDirection = startEndDiff >= 0 ? 'up' : startEndDiff < 0 ? 'down' : 'plate'
  const startEndDiffTitle = startEndDiff >= 0 ? '⬆' : startEndDiff < 0 ? '⬇' : ' '

  function getCurrencyHTML(value, addDirection) {
    if (typeof value === 'number') {
      const valueToFixed = value?.toFixed(4) || ''
      let valueWithDirection = valueToFixed

      if (addDirection) {
        valueWithDirection = value > 0 ? `+${valueToFixed}` : value < 0 ? valueToFixed : ` ${valueToFixed}`
      }

      const splittedValue = valueWithDirection.split('')
      const firstPart = splittedValue.slice(0, -2).map(char => thinChars.includes(char) ? `<tc>${char}</tc>` : `<wc>${char}</wc>`)
      const lastpart = splittedValue.slice(-2).map(char => thinChars.includes(char) ? `<tc>${char}</tc>` : `<wc>${char}</wc>`)

      const valueWithEm = `<em>${firstPart.join('')}</em>${lastpart.join('')}`
      const newValue = valueWithEm
      
      return newValue
    }

    return ''
  }

  function getTimeHTML(time) {
    if (typeof time == 'string') {
      const newTime = time.split('').map(char => thinChars.includes(char) ? `<tc>${char}</tc>` : `<wc>${char}</wc>`)

      return newTime.join('')
    }

    return ''
  }

  return (
    <div className={$s['tooltip-wrapper']}>
      <div className={$s['tooltip__real-time--horizontal']}>
        <div className={$s['tooltip__group--left']}>
          <div className={$s['tooltip__group--center']}>
            <span className={$s['tooltip__title--label']} style={{color: currencyKey.bankColor}}>
              {currencyKey.name}
            </span>
            <span className={$s['tooltip__title--value']} style={{color: `rgb(${colorRGB})`}}>
              {currencyKey.currency} / {currencyKey.currencyBase}
            </span>
          </div>

          <div className={[$s['tooltip__items'], $s['tooltip__items--right']].join(' ')}>
            <span 
              className={$s['tooltip__item--end-value']}
              dangerouslySetInnerHTML={{ __html: getCurrencyHTML(lastPoint.y, false) }}
            />

            <span 
              className={[$s['tooltip__item--time'], $s['tooltip__item--end-time']].join(' ')}
              dangerouslySetInnerHTML={{ __html: getTimeHTML(lastPoint.x) }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomTooltip