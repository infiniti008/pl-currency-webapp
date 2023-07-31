export function getRows() {
  const rows = []
  const startTime = 480
  const rowsInterval = 5
  const endTime = 1325

  for(let time = startTime; time < endTime; time = time + rowsInterval) {
    let hours = parseInt(time / 60)
    let minutes = time - (hours * 60)

    const timeString = addZero(hours) + ':' + addZero(minutes)

    rows.push({
      index: 'row-' + timeString,
      time: timeString,
      days: [
        {
          index: 'row-' + timeString + '-' + '00',
          dayName: 'mon'
        },
        {
          index: 'row-' + timeString + '-' + '01',
          dayName: 'tue'
        },
        {
          index: 'row-' + timeString + '-' + '02',
          dayName: 'wen'
        },
        {
          index: 'row-' + timeString + '-' + '03',
          dayName: 'thu'
        },
        {
          index: 'row-' + timeString + '-' + '04',
          dayName: 'fri'
        },
        {
          index: 'row-' + timeString + '-' + '05',
          dayName: 'sut'
        },
        {
          index: 'row-' + timeString + '-' + '06',
          dayName: 'sun'
        }
      ]
    });
  }
  return rows;
}

function addZero(number) {
  if (number < 10) {
    return '0' + number; 
  }

  return number.toString();
}