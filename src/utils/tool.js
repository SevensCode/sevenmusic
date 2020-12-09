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
   * @param {number} num 需要补零的数
   * */
  formatZero (num) {
    if (num < 10 && num >= 0) {
      return '0' + num
    } else {
      return num
    }
  },
  /**
   * @method 获取当前时间距离上次时间过去多久 ，天 - 分钟
   * @param {number} updateTime 指定日期和时间(秒)
   * */
  getDistanceSpecifiedTime (updateTime) {
    if (updateTime == null) {
      return ''
    }
    const now = new Date().getTime()
    const second = Math.floor((now - updateTime) / (1000))
    const minute = Math.floor(second / 60)
    const hour = Math.floor(minute / 60)
    const day = Math.floor(hour / 24)
    const month = Math.floor(day / 31)
    const year = Math.floor(month / 12)
    if (year > 0) {
      return year + '年前'
    } else if (month > 0) {
      return month + '月前'
    } else if (day > 0) {
      let ret = day + '天前'
      if (day >= 7 && day < 14) {
        ret = '1周前'
      } else if (day >= 14 && day < 21) {
        ret = '2周前'
      } else if (day >= 21 && day < 28) {
        ret = '3周前'
      } else if (day >= 28 && day < 31) {
        ret = '4周前'
      }
      return ret
    } else if (hour > 0) {
      return hour + '小时前'
    } else if (minute > 0) {
      return minute + '分钟前'
    } else if (second > 0) {
      return second + '秒前'
    } else {
      return '刚刚'
    }
  },
  /**
   * 格式年月日
   * @method formatYearMonthDay()
   * @param {number} time 指定日期
   * */
  formatYearMonthDay (time) {
    const date = new Date(time)
    const y = date.getFullYear()
    const m = this.formatZero(date.getMonth() + 1)
    const d = this.formatZero(date.getDate())
    return y + '-' + m + '-' + d
  }
}
