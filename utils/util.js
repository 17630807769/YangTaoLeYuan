const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function timeFuc(time) {
  let data = time + '';
  return data.substring(4,6)+'-'+data.substring(6,8)+' '+data.substring(8,10)+':'+data.substring(10,12)
}
function timeFuc1(time) {
  let data = time + '';
  return data.substring(4,6)+'-'+data.substring(6,8)
}
function timeFuc2(time) {
  let data = time + '';
  return data.substring(0,4)+'-'+data.substring(4,6)+'-'+data.substring(6,8)+' '+data.substring(8,10)+':'+data.substring(10,12)
}
module.exports = {
  formatTime: formatTime,
  timeFuc: timeFuc,
  timeFuc1: timeFuc1,
  timeFuc2:timeFuc2
}
