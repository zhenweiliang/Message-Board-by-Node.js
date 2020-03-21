exports.currentDate = () => {
  const today= new Date()
  const year=today.getFullYear()
  const month=today.getMonth()
  const date=today.getDate()
  return `${date}/${month}/${year}`

}
