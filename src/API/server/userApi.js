import axios from '@/utils/request'

/**
 * 手机登录
 * @method loginByPhone
 * @param {number} query.phone：手机号
 * @param {number} query.password：密码
 * */
export const loginByPhone = (query) => axios.post('/login/cellphone', query)

/**
 *  登录后调用此接口 , 传入用户 id, 可以获取用户信息
 * @method getUserInfo
 * @param {number} uid: 用户id
 * */
export const getUserInfo = (uid) => axios.get('/user/detail', { params: { uid: uid } })

/**
 * 登录后调用此接口 , 传入用户 id, 可以获取用户播放历史
 * @method getUserPlaybackHistory
 * @param {number} query.uid: 用户id (必选参数)
 * @param {number} query.type: 历史类型 type=1 时只返回 weekData, type=0 时返回 allData (可选参数)
 * */
export const getUserPlaybackHistory = (query) => axios.get('/user/record', { params: query })

/**
 *  登录后调用此接口 , 传入用户 id, 可以获取用户歌单
 *  @method getUserSonglist
 *  @param {number} query.uid: 用户id (必选参数)
 *  @param {number} query.limit:返回数量 , 默认为 30
 *  @param {number} query.loffset: 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * */
export const getUserSonglist = (query) => axios.get('/user/playlist', { params: query })
/**
 * 获取验证码
 * @method getVerificationCode
 * @param {number} phone - 手机号码
 * */
export const getVerificationCode = (phone) => axios.get('/captcha/sent', { params: { phone } })
/**
 * 检测手机号码是否已注册
 * @method checkIfTheMobilePhoneNumberIsRegistered
 * @param {number} phone - 手机号码
 * */
export const checkIfTheMobilePhoneNumberIsRegistered = (phone) => axios.get('/cellphone/existence/check', { params: { phone } })
/**
 * 验证验证码
 * @method verification_code
 * @param {number} phone - 手机号码
 * @param {number} captcha - 验证码
 * */
export const verificationcode = (phone, captcha) => axios.get('/captcha/verify', {
  params: {
    phone,
    captcha
  }
})
/**
 * 注册或修改密码
 * @method registerOrChangePassword
 * @param {number} query.captcha - 验证码
 * @param {number} query.phone - 手机号码
 * @param {number} query.password - 密码
 * @param {number} query.nickname - 昵称
 * */
export const registerOrChangePassword = (query) => axios.get('/register/cellphone', { params: query })
