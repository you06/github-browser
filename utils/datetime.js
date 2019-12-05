export const formatDate = function (t) {
  const year = t.getFullYear()
  const month = t.getMonth() + 1
  const date = t.getDate()

  const monthStr = month < 10 ? '0' + month : '' + month
  const dateStr = date < 10 ? '0' + date : '' + date
  return `${year}-${monthStr}-${dateStr}`
}

export const formatTime = function (t) {
  const hour = t.getHours()
  const minute = t.getMinutes()
  const second = t.getSeconds()

  const hourStr = hour < 10 ? '0' + hour : '' + hour
  const minuteStr = minute < 10 ? '0' + minute : '' + minute
  const secondStr = second < 10 ? '0' + second : '' + second
  return `${hourStr}:${minuteStr}:${secondStr}`
}

export const formatDatetime = function (t) {
  return `${formatDate(t)} ${formatTime(t)}`
}

export const getLastDayinWeek = function (n) {
  const now = new Date()
  let res
  if (now.getDay() < n) {
    res = new Date(now.getTime() - (now.getDay() + 7 - n) * 24 * 3600 * 1000)
  } else if (now.getDay() > n) {
    res = new Date(now.getTime() - (now.getDay() - n) * 24 * 3600 * 1000)
  } else if (now.getTime() < roundTo4pm(now).getTime()) {
    res = new Date(now.getTime() - 7 * 24 * 3600 * 1000)
  } else {
    res = now
  }
  return res
}

export const roundTo4pm = function (t) {
  t = new Date(t.getTime())
  t.setHours(16)
  t.setMinutes(0)
  t.setSeconds(0)
  t.setMilliseconds(0)
  return t
}
