const pad = (value: number) => (value < 10 ? `0${value}` : `${value}`)

export default function getDate(date: number) {
  const currentDate = new Date(date)
  const day = pad(currentDate.getDate())
  const month = pad(currentDate.getMonth() + 1)
  const year = currentDate.getFullYear()
  const hours = pad(currentDate.getHours())
  const minutes = pad(currentDate.getMinutes())
  return `${day}/${month}/${year} ${hours}:${minutes}`
}
