import { DateTime } from 'luxon'

export const formatTime = (time: string, timezone: string) => {
  return DateTime.fromFormat(time, 'HH:mm:ss')
    .setZone(timezone)
    .toFormat('h:mm a')
}

export const formatDate = (date: string, timezone: string) => {
  return DateTime.fromISO(date)
    .setZone(timezone)
    .toFormat('EEEE, MMMM d, yyyy')
}

export const getAvailableSlots = (startTime: string) => {
  return [startTime]
}

export const convertToUTC = (date: string, time: string, timezone: string) => {
  const localDateTime = DateTime.fromFormat(
    `${date} ${time}`,
    'yyyy-MM-dd HH:mm:ss',
    { zone: timezone }
  )
  return localDateTime.toUTC().toISO()
}

export const convertFromUTC = (utcDateTime: string, timezone: string) => {
  return DateTime.fromISO(utcDateTime)
    .setZone(timezone)
    .toFormat('yyyy-MM-dd HH:mm:ss')
} 