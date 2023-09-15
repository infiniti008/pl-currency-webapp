import '../../../assets/css/Tooltipe.scss'

const thinChars = ['.', ',', ';', ':']

function CustomTooltip({ currencyKey, dataSet, firstPoint, lastPoint, colorRGB, currentSettedPoint}) {

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
      const valueWithDirection = addDirection && value > 0 ? `+${valueToFixed}` : valueToFixed

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
    <div className="tooltip-wrapper">
      <div className="tooltip tooltip__real-time--horizontal">
        <div className="tooltip__group--left">

            <span 
              className='tooltip__item--time tooltip__item--start-time'
              dangerouslySetInnerHTML={{ __html: getTimeHTML(firstPoint.x) }}
            />

            <span 
              className='tooltip__item--start-value'
              dangerouslySetInnerHTML={{ __html: getCurrencyHTML(firstPoint.y, false) }}
            />

            <span className={'tooltip__item--arrow' + ' tooltip__item--' + startEndDiffDirection}>
              <em>
                {startEndDiffTitle}
              </em>
            </span>

            <span 
              className={'tooltip__item--start-end-diff' + ' tooltip__item--' + startEndDiffDirection}
              dangerouslySetInnerHTML={{ __html: getCurrencyHTML(startEndDiff, true) }}
            />

            <span 
              className='tooltip__item--end-value'
              dangerouslySetInnerHTML={{ __html: getCurrencyHTML(lastPoint.y, false) }}
            />

            <span 
              className='tooltip__item--time tooltip__item--end-time'
              dangerouslySetInnerHTML={{ __html: getTimeHTML(lastPoint.x) }}
            />

        </div>

        <div className="tooltip__group--center">
          <span className='tooltip__title--label' style={{color: currencyKey.bankColor}}>
            {currencyKey.name}
          </span>
          <span className='tooltip__title--value' style={{color: `rgb(${colorRGB})`}}>
            {currencyKey.currency} / {currencyKey.currencyBase}
          </span>
        </div>

        <div className="tooltip__group--right">
          <span 
            className={'tooltip__item--time tooltip__item--current-time'}
            dangerouslySetInnerHTML={{ __html: getTimeHTML(currentPoint.x) }}
          />

          <span className={'tooltip__item--arrow' + ' tooltip__item--' + currentDiffDirection}>
            <em>
              {currentDiffTitle}
            </em>
          </span>

          <span 
            className={'tooltip__item--current-diff-text' + ' tooltip__item--' + currentDiffDirection}
            dangerouslySetInnerHTML={{ __html: getCurrencyHTML(currentDiff, true) }}
          />

          <span 
            className={'tooltip__item--current-value' + ' tooltip__item--' + currentDiffDirection}
            dangerouslySetInnerHTML={{ __html: getCurrencyHTML(currentPoint.y, false) }}
          />
        </div>
        
      </div>
    </div>
  )
}

export default CustomTooltip