import { useContext, useState, useEffect } from 'react';
import CurrentStoreContext from '../contexsts/store';
import ChartElement from './Charts/Chart';
import { getKeyData } from '../api/services';
import { toast } from 'react-toastify';
import { format, addMinutes, parse, formatRelative, subDays } from 'date-fns'
import { formatInTimeZone, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'

const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

function ModalStream({chart, handleRemoveChart}) {
  const {
    currentStore,
    setCurrentStore
  } = useContext(CurrentStoreContext)

  const [selectedCountry, setSelectedCountry] = useState('by')
  const [selectedKey, setSelectedKey] = useState('by-moex-usd-tom')
  const [startTime, setStartTime] = useState('08:30')
  const [endTime, setEndTime] = useState('15:00')
  const [isStarted, setIsStarted] = useState(false)
  const [isDataReady, setIsDataReady] = useState(false)
  const [dataSet, setDataSet] = useState([])
  const [labels, setLabels] = useState([])
  const [title, setTitle] = useState('')
  const [timeZone, setTimeZone] = useState('')

  useEffect(() => {
    switch (selectedCountry) {
      case 'by':
        setTimeZone('Europe/Minsk')
        break;
      case 'pl':
        setTimeZone('Europe/Warsaw')
        break;
      default:
        setTimeZone('Europe/Warsaw')
        break;
    }
  }, [selectedCountry])

  useEffect(() => {
    if (isStarted && selectedCountry && selectedKey && startTime && endTime) {
      fetchData()
    } else if (isStarted) {
      toast.error("Please fill all fields", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    } else {
      setIsDataReady(false)
    }
  }, [isStarted])

  const settings = currentStore?.appSettings || {}
  const keysArr = settings['keys_' + selectedCountry] || []

  const keys = keysArr.map(key => {
    return (
      <option key={key.key} value={key.key}>
        {key.currency} - {key.name}
      </option>
    )
  })

  function onChange(setter, event) {
    setter(event.target.value)
    setIsStarted(false)
    setIsDataReady(false)
  }

  function handleToggleStarted() {
    setIsStarted(!isStarted)
  }

  async function fetchData() {
    try {
      let startTimeStamp = new Date()
      startTimeStamp = new Date(startTimeStamp.setHours(startTime.split(':')[0]))
      startTimeStamp = new Date(startTimeStamp.setMinutes(startTime.split(':')[1]))
      const utcDate = zonedTimeToUtc(startTimeStamp, timeZone);
      const targetDateTime = utcToZonedTime(utcDate, currentTimeZone);

      startTimeStamp = targetDateTime

      startTimeStamp = startTimeStamp.valueOf()
      const request = {
        country: selectedCountry,
        key: selectedKey,
        startTime,
        endTime,
        startTimeStamp
      }
      const data = await getKeyData(request)

      prepareDataToChart(data)
      prepareNameToChart()
      
      setIsDataReady(true)
    } catch(err) {
      console.log(err)
      setIsStarted(false)
    }
  }

  const actionButtonText = isStarted ? 'Stop' : 'Start'

  const config = {
    selectedCountry,
    selectedKey,
    startTime,
    endTime
  }

  function prepareDataToChart(data) {
    const labels = []
    const dataSet = []

    data.forEach(item => {
      let time = new Date(item.timestamp)
      time = formatInTimeZone(time, timeZone, 'HH:mm')
      labels.push(time)
      dataSet.push(item.value)
    })

    const diffMins = data?.[1]?.date?.split(':')?.[1] - data?.[0]?.date?.split(':')?.[1]

    const lastLebelTime = labels[labels.length - 1]
    const lastLebelTimeInt = parseInt(lastLebelTime.split(':').join(''))
    const endTimeInt = parseInt(endTime.split(':').join(''))
    const parsedDate = parse(lastLebelTime, "HH:mm", new Date())

    if (lastLebelTimeInt < endTimeInt) {
      const newDate = addMinutes(parsedDate, diffMins)
      const newTimeString = format(newDate, "HH:mm")
      let newTimeStringInt = parseInt(newTimeString.split(':').join(''))
      labels.push(newTimeString)

      while(newTimeStringInt < endTimeInt) {
        const lastLebelTime = labels[labels.length - 1]
        const parsedDate = parse(lastLebelTime, "HH:mm", new Date())
        const newDate = addMinutes(parsedDate, diffMins)
        const newTimeString = format(newDate, "HH:mm")
        newTimeStringInt = parseInt(newTimeString.split(':').join(''))
        labels.push(newTimeString)
      }
    }

    setDataSet(dataSet)
    setLabels(labels)
  }

  function prepareNameToChart() {
    let name = keysArr.find(item => item.key === selectedKey) || {}
    name = name.currency + ' - ' + name.name
    setTitle(name)
  }

  return (
    <div className='chart'>
      <div className='chart__config'>
        <div className='chart__config-group'>
          <select className='chart__config-select' value={selectedCountry} onChange={onChange.bind(null, setSelectedCountry)}>
            <option value="" disabled>Country</option>
            <option value="pl">PL</option>
            <option value="by">BY</option>
          </select>
        </div>
        <div className='chart__config-group'>
          <select className='chart__config-select' value={selectedKey} onChange={onChange.bind(null, setSelectedKey)}>
            <option value="" disabled>Key</option>
            {keys}
          </select>
        </div>
        <div className='chart__config-group'>
          <label htmlFor="">
            Start Time
          </label>
          <input type="time" value={startTime} onChange={onChange.bind(null, setStartTime)} />
        </div>
        <div className='chart__config-group'>
          <label htmlFor="">
            End Time
          </label>
          <input type="time" value={endTime} onChange={onChange.bind(null, setEndTime)} />
        </div>
        <button onClick={handleToggleStarted}>
          {actionButtonText}
        </button>
        <button onClick={handleRemoveChart}>Remove</button>
      </div>
      <div className='chart__view'>
        {isDataReady && <ChartElement config={config} labels={labels} title={title} dataSet={dataSet} />}
      </div>
    </div>
  )
}

export default ModalStream