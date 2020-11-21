export default {
  /**
   * @method 数字转整数 如 100000 转为10万
   * @param {String} num 需要转换的数
   * */
  formatPlayCount (num) {
    if (num.length === 5) {
      return num.slice(0, 1) + '万'
    } else if (num.length === 6) {
      return num.slice(0, 2) + '万'
    } else if (num.length === 7) {
      return num.slice(0, 3) + '万'
    } else if (num.length === 8) {
      return num.slice(0, 4) + '万'
    } else if (num.length === 9) {
      return num.slice(0, 1) + '亿'
    } else if (num.length === 10) {
      return num.slice(0, 2) + '亿'
    } else if (num.length === 11) {
      return num.slice(0, 3) + '亿'
    } else if (num.length === 12) {
      return num.slice(0, 4) + '亿'
    } else if (num.length <= 4) {
      return num.slice(0, 4)
    }
  },
  /**
   * @method 格式化日期格式补0
   * @param {number} date 需要补零的数
   * */
  formatZero (date) {
    if (date < 10 && date >= 0) {
      return '0' + date
    } else {
      return date
    }
  },
  /**
   * @method 获取当前时间距离上次时间过去多久 ，天 - 分钟
   * @param {number} date 指定日期和时间(秒)
   * */
  getDistanceSpecifiedTime (date) {
    // 指定日期和时间
    const EndTime = new Date(date)
    // 当前系统时间
    const NowTime = new Date()
    const t = NowTime.getTime() - EndTime.getTime()
    const d = Math.floor(t / 1000 / 60 / 60 / 24)
    const h = Math.floor(t / 1000 / 60 / 60 % 24)
    const m = Math.floor(t / 1000 / 60 % 60)
    // const s = Math.floor(t / 1000 % 60)
    if (d > 0) {
      return d + ' 天前'
    }
    if (d <= 0 && h >= 1) {
      return h + ' 小时前'
    }
    if (d <= 0 && h <= 0) {
      return m + ' 分钟前'
    }
  }
}
