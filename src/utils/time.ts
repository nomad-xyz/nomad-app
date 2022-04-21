import { BigNumber } from 'ethers'
import { formatDuration } from 'date-fns'
import { isProduction } from '@/config'

/**
 * @param timestamp Given a timestamp, calculate how many hours ago
 * @returns string - x hours ago
 */
export function getHoursAgo(timestamp: number): number {
  const now = Date.now()
  const diff = now - timestamp
  // to seconds to minutes to hours
  const hours = diff / 1000 / 60 / 60
  return Math.floor(hours)
}

/**
 * @param timestamp Given a confirmAt timestamp, calculate how many minutes until
 * @returns number
 */
export function minutesTilConfirmation(timestamp: BigNumber): number {
  const now = BigNumber.from(Date.now()).div(1000)
  const diff = timestamp.sub(now)
  if (diff.lt(0)) return 0
  // to minutes
  const minutes = diff.div(60)
  return Math.floor(minutes.toNumber())
}

export function getTimestampFromConfirmAt(confirmAt: BigNumber): number {
  let confirmationTime
  // confirmation time is 3 hours on mainnet and 1-3 minutes on testnet
  if (isProduction) {
    confirmationTime = BigNumber.from('10800000')
  } else {
    confirmationTime = BigNumber.from('60000')
  }
  // confirmAt is in seconds, we need milliseconds
  const timestamp = confirmAt.mul(BigNumber.from('1000'))
  // subtract confirmation time
  return timestamp.sub(confirmationTime).toNumber()
}

/**
 * @param timestamp Given a timestamp, calculate how many hours ago
 * @returns string - x hours ago
 */
export function parseTimestamp(timestamp: number): Record<string, string> {
  const d = new Date(timestamp)
  const month = d.getMonth()
  const date = d.getDate()
  const year = d.getFullYear()
  let hours = d.getHours()
  const minutes = d.getMinutes()
  let time = 'AM'
  if (hours > 12) {
    time = 'PM'
    hours -= 12
  } else if (hours === 0) {
    hours = 12
  }

  const m = minutes < 10 ? `0${minutes}` : minutes

  return {
    date: `${getMonth(month)} ${date}, ${year}`,
    time: `${hours}:${m} ${time}`,
  }
}

export function getMonth(month: number): string {
  switch (month) {
    case 0:
      return 'Jan'
    case 1:
      return 'Feb'
    case 2:
      return 'Mar'
    case 3:
      return 'Apr'
    case 4:
      return 'May'
    case 5:
      return 'June'
    case 6:
      return 'July'
    case 7:
      return 'Aug'
    case 8:
      return 'Sept'
    case 9:
      return 'Oct'
    case 10:
      return 'Nov'
    case 11:
      return 'Dec'
    default:
      return ''
  }
}

export function fromMinToHoursAndMin(numberMin: number): string {
  const hours = Math.floor(numberMin / 60)
  const minutes = numberMin % 60
  return formatDuration({ hours, minutes })
}
