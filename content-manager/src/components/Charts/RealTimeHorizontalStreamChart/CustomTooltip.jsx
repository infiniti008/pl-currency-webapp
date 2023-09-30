import $s from './Tooltipe.module.scss'

const thinChars = ['.', ',', ';', ':']

function CustomTooltip({ currencyKey, dataSet, firstPoint, lastPoint, colorRGB, currentSettedPoint, selectedKey}) {
  const chartHeight = (document.getElementById(selectedKey)?.getClientRects()?.[0]?.height || 0) + 20

  let currentIndex = dataSet.indexOf(currentSettedPoint)
  const currentPoint = currentSettedPoint
  const beforeCurrent = dataSet?.[currentIndex - 1] || dataSet?.[0]

  const currentDiff = (currentPoint?.y - beforeCurrent?.y)
  const currentDiffDirection = currentDiff > 0 ? 'up' : currentDiff < 0 ? 'down' : 'plate'
  const currentDiffTitle = currentDiff > 0 ? '⬆' : currentDiff < 0 ? '⬇' : ' '

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
        <div className={[$s['tooltip__items'], $s['tooltip__items--left']].join(' ')}>
              <span 
                className={[$s['tooltip__item--time'], $s['tooltip__item--start-time']].join(' ')}
                dangerouslySetInnerHTML={{ __html: getTimeHTML(firstPoint.x) }}
              />

              <span 
                className={$s['tooltip__item--start-value']}
                dangerouslySetInnerHTML={{ __html: getCurrencyHTML(firstPoint.y, false) }}
              />
            </div>

            <div className={[$s['tooltip__items'], $s['tooltip__items--center']].join(' ')}>
              <span className={[$s['tooltip__item--arrow'], $s['tooltip__item--' + startEndDiffDirection]].join(' ')}>
                <em>
                  {startEndDiffTitle}
                </em>
              </span>

              <span 
                className={[$s['tooltip__item--start-end-diff'], $s['tooltip__item--' + startEndDiffDirection]].join(' ')}
                dangerouslySetInnerHTML={{ __html: getCurrencyHTML(startEndDiff, true) }}
              />
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

        <div className={$s['tooltip__group--center']}>
          <span className={$s['tooltip__title--label']} style={{color: currencyKey.bankColor}}>
            {currencyKey.name}
          </span>
          <span className={$s['tooltip__title--value']} style={{color: `rgb(${colorRGB})`}}>
            {currencyKey.currency} / {currencyKey.currencyBase}
          </span>
        </div>

        <div className={$s['tooltip__group--right']} style={{height: chartHeight}}>
          <span 
            className={[$s['tooltip__item--time'], $s['tooltip__item--current-time']].join(' ')}
            dangerouslySetInnerHTML={{ __html: getTimeHTML(currentPoint.x) }}
          />

          <span 
            className={[$s['tooltip__item--current-diff-text'], $s['tooltip__item--' + currentDiffDirection]].join(' ')}
            dangerouslySetInnerHTML={{ __html: getCurrencyHTML(currentDiff, true) }}
          />

          <div className={$s['tooltip__item--current-value-group']}>
            <span className={[$s['tooltip__item--arrow'], $s['tooltip__item--' + currentDiffDirection]].join(' ')}>
              <em>
                {currentDiffTitle}
              </em>
            </span>
            <span 
              className={[$s['tooltip__item--current-value'], $s['tooltip__item--' + currentDiffDirection]].join(' ')}
              dangerouslySetInnerHTML={{ __html: getCurrencyHTML(currentPoint.y, false) }}
            />
          </div>
          
        </div>
        
      </div>
    </div>
  )
}

export default CustomTooltip