import axios from '@/utils/request'

/**
 * 获取轮播图
 * @method getBanner
 * */
export const getBanner = () => axios.get('/banner')

/**
 * 获取推荐歌单
 * @method getRecommendedPlaylist
 * @param {number} limit: 取出数量 , 默认为 30 (不支持 offset) （可选参数）
 * */
export const getRecommendedPlaylist = (limit) => axios.get('/personalized', { params: { limit: limit } })

/**
 * 获取推荐新音乐
 * @method getRecommendedNewMusic
 * @param {number} limit: 取出数量 , 默认为 10 (不支持 offset) （可选参数）
 * */
export const getRecommendedNewMusic = (limit) => axios.get('/personalized/newsong', { params: { limit: limit } })

/**
 * 获取推荐歌手
 * @method getRecommendedSingers
 * @param {number} limit: 取出数量 , 默认为 30  （可选参数）
 * */
export const getRecommendedSingers = (limit) => axios.get('/artist/list', { params: { limit: limit } })

/**
 * 获取所有榜单
 * @method getAllLists
 * */
export const getAllLists = () => axios.get('/toplist/detail')

/**
 * 获取歌单热门分类
 * @method getSonglistHotSort
 * */
export const getSonglistHotSort = () => axios.get('/playlist/hot')

/**
 * 获取网友精选碟歌单
 * @method getAFeaturedSonglist
 * @param {string} query.order: 可选值为 'new' 和 'hot', 分别对应最新和最热 , 默认为 'hot'
 * @param {string} query.cat:cat: tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部",可从歌单分类接口获取(/playlist/catlist)
 * @param {number} query.limit: 取出歌单数量 , 默认为 50
 * @param {number} query.offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*50, 其中 50 为 limit 的值
 * */
export const getAFeaturedSonglist = (query) => axios.get('/top/playlist', { params: query })

/**
 * 获取歌单热门分类
 * @method getSonglistSort
 * */
export const getSonglistSort = () => axios.get('/playlist/catlist')

/**
 * @method 获取歌手分类列表
 * @param {number} query.limit:  返回数量 , 默认为 30
 * @param {number} query.offset:  偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * @param {string} query.initial:  按首字母索引查找参数,如 /artist/list?type=1&area=96&initial=b 返回内容将以 name 字段开头为 b 或者拼音开头为 b
 *   为顺序排列, 热门传-1,#传0
 * @param {number} query.type:  获取类型。 可取值为 -1:全部 1:男歌手 2:女歌手 3:乐队 例如：type:-1
 * @param {number} query.area:  获取类型。 可取值为 -1:全部 7华语 96欧美 8:日本 16韩国 0:其他 例如 type:-1
 * */
export const getSingerSortList = (query) => axios.get('/artist/list', { params: query })

/**
 * 获取全部MV
 * @method getAllMv
 * @param {string} query.area: 地区,可选值为全部,内地,港台,欧美,日本,韩国,不填则为全部
 * @param {string} query.type: 类型,可选值为全部,官方版,原生,现场版,网易出品,不填则为全部
 * @param {string} query.order: 排序,可选值为上升最快,最热,最新,不填则为上升最快
 * @param {number} query.limit: 取出数量 , 默认为 30
 * @param {number} query.offset: 偏移数量 , 用于分页 , 如 :( 页数 -1)*50, 其中 50 为 limit 的值 , 默认 为 0
 * */
export const getAllMv = (query) => axios.get('/mv/all', { params: query })

/**
 *  传入搜索关键词可以搜索该音乐
 *  @method search
 *  @param {String} query.keywords：关键词 (必选参数)
 *  @param {Number} query.limit：返回数量 , 默认为 30
 *  @param {Number} query.offset：偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 *  @param {Number} query.type：1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频,
 *   1018:综合
 * */
export const search = (query) => axios.get('/cloudsearch', { params: query })

/**
 * 获取歌单详情
 * @method getPlaylistDetails
 * @param {number} query.id: 歌单ID (必选参数)
 * @param {number} query.s: 歌单最近的 s 个收藏者,默认为8
 * */
export const getPalylistDetails = (query) => axios.get('/playlist/detail', { params: query })

/**
 * 获取歌曲详情
 * @method getSongDetails
 * @param {string} ids: 音乐ID ,如 ids = 347230
 * */
export const getSongDetails = ids => axios.get('song/detail', { params: { ids: ids } })

/**
 * 获取歌单收藏者
 * @method getPlaylistCollector
 * @param {number} query.id: 歌单id (必选参数)
 * @param {number} query.limit: 取出评论数量 , 默认为 20
 * @param {number} query.offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
 * */
export const getPlaylistCollector = (query) => axios.get('/playlist/subscribers', { params: query })

/**
 * 获取相关歌单推荐
 * @method getRelatedPlaylistRecommendations
 * @param {number} id: 歌单id (必选参数)
 * */
export const getRelatedPlaylistRecommendations = (id) => axios.get('/related/playlist', { params: { id } })
/**
 * 获取歌单评论
 * @method getPlaylistComments
 * @param {number} query.id: 歌单 id (必选参数)
 * @param {number} query.limit: 取出评论数量 , 默认为 20
 * @param {number} query.offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
 * @param {number} query.before: 分页参数,取上一页最后一项的 time 获取下一页数据(获取超过5000条评论的时候需要用到)
 * */
export const getPlaylistComments = (query) => axios.get('/comment/playlist', { params: query })
/**
 * 获取音乐Url
 * @method getMusicUrl
 * @param {number} id: 音乐 id (必选参数)
 * */
export const getMusicUrl = (id) => axios.get('/song/url', { params: { id } })
/**
 * 获取歌词
 * @method getLyrics
 * @param {number} id: 音乐 id (必选参数)
 * */
export const getLyrics = (id) => axios.get('/lyric', { params: { id } })
