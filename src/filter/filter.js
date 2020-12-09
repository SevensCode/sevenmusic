import tool from '@/utils/tool'
// 过滤播放次数
const playCount = (value) => {
  return tool.formatPlayCount(JSON.stringify(value))
}
// 过滤播放时间
const playTime = (value) => {
  return tool.formatZero(new Date(value).getMinutes()) + ':' + tool.formatZero(new Date(value).getSeconds())
}
// 格式年月日
const formatYearMonthDay = (value) => {
  return tool.formatYearMonthDay(value)
}
// 补0
const formatZero = (value) => {
  return tool.formatZero(value)
}

export default {
  playCount,
  formatYearMonthDay,
  playTime,
  formatZero
}
