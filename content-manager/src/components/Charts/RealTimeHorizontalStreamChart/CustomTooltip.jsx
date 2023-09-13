import '../../../assets/css/Tooltipe.scss'

function CustomTooltip({config, currencyKey, dataSet, labels, firstPoint, lastPoint, prevLastPoint, colorRGB, datasetMax, datasetMin, selectedKey, selectedPointSize, currentSettedPoint}) {

  let currentIndex = dataSet.indexOf(currentSettedPoint)
  const currentPoint = currentSettedPoint
  const beforeCurrent = dataSet?.[currentIndex - 1] || dataSet?.[0]
  const currentDiff = (currentPoint?.y - beforeCurrent?.y).toFixed(4)
  const currentDiffDirection = currentDiff >= 0 ? 'up' : 'down'
  const currentDiffText = currentDiff >= 0 ? `+${currentDiff}` : currentDiff
  const currentDiffTitle = currentDiff >= 0 ? '⬆' : '⬇'

  const startEndDiff = (lastPoint?.y - firstPoint?.y).toFixed(4)
  const startEndDiffDirection = startEndDiff >= 0 ? 'up' : 'down'
  const startEndDiffText = startEndDiff >= 0 ? `+${startEndDiff}` : startEndDiff
  const startEndDiffTitle = startEndDiff >= 0 ? '⬆' : '⬇'

  return (
    <div className="tooltip-wrapper">
      <div className="tooltip tooltip__real-time--horizontal">
        <div className='tooltip__item'>
          <span className='tooltip__item--top tooltip__item--label'>
            {firstPoint.x}
          </span>
          <span className='tooltip__item--bottom tooltip__item--currency'>
            {firstPoint.y?.toFixed(4)}
          </span>
        </div>

        <div className={'tooltip__item tooltip__item--start-end-diff ' + 'tooltip__item--' + startEndDiffDirection}>
          <span className='tooltip__item--top tooltip__item--label'>
            {startEndDiffTitle}
          </span>
          <span className='tooltip__item--bottom tooltip__item--currency'>
            {startEndDiffText}
          </span>
        </div>

        <div className='tooltip__item'>
          <span className='tooltip__item--top tooltip__item--time'>
            {lastPoint.x}
          </span>
          <span className='tooltip__item--bottom tooltip__item--currency'>
            {lastPoint.y?.toFixed(4)}
          </span>
        </div>

        <div className='tooltip__item'>
          <span className='tooltip__item--top tooltip__title--label' style={{color: currencyKey.bankColor}}>
            {currencyKey.name}
          </span>
          <span className='tooltip__item--bottom tooltip__title--value' style={{color: `rgb(${colorRGB})`}}>
            {currencyKey.currency} / {currencyKey.currencyBase}
          </span>
        </div>

        <div className='tooltip__item'>
          {/* <span className='tooltip__item--top tooltip__item--label'>
            Min
          </span>
          <span className='tooltip__item--bottom tooltip__item--currency'>
            {min}
          </span> */}
        </div>

        <div className={'tooltip__item tooltip__item--current-diff ' + 'tooltip__item--' + currentDiffDirection}>
          <span className='tooltip__item--top tooltip__item--label'>
            {currentDiffTitle}
          </span>
          <span className='tooltip__item--bottom tooltip__item--currency'>
            {currentDiffText}
          </span>
        </div>

        <div className={'tooltip__item tooltip__item--current ' + 'tooltip__item--' + currentDiffDirection}>
          <span className='tooltip__item--top tooltip__item--label'>
          {currentPoint?.x}
          </span>
          <span className='tooltip__item--bottom tooltip__item--currency'>
            {currentPoint?.y?.toFixed(4)}
          </span>
        </div>
        
      </div>
    </div>
  )
}

export default CustomTooltip