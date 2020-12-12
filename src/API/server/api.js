import axios from '@/utils/request'

/**
 * 获取轮播图
 * @method getBanner
 * */
export const getBanner = () => axios.get('/banner')

/**
 * 获取推荐歌单
 * @method getRecommendedPlaylist
 * @param {number} [limit] - 取出数量 , 默认为 30 (不支持 offset)
 * */
export const getRecommendedPlaylist = (limit) => axios.get('/personalized', { params: { limit: limit } })

/**
 * 获取推荐新音乐
 * @method getRecommendedNewMusic
 * @param {number} [limit] - 取出数量 , 默认为 10 (不支持 offset)
 * */
export const getRecommendedNewMusic = (limit) => axios.get('/personalized/newsong', { params: { limit: limit } })

/**
 * 获取推荐歌手
 * @method getRecommendedSingers
 * @param {number} [limit] - 取出数量 , 默认为 30
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
 * @param {string} [query.order] - 可选值为 'new' 和 'hot', 分别对应最新和最热 , 默认为 'hot'
 * @param {string} [query.cat] - cat: tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部",可从歌单分类接口获取(/playlist/catlist)
 * @param {number} [query.limit] - 取出歌单数量 , 默认为 50
 * @param {number} [query.offset] - 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*50, 其中 50 为 limit 的值
 * */
export const getAFeaturedSonglist = (query) => axios.get('/top/playlist', { params: query })

/**
 * 获取歌单热门分类
 * @method getSonglistSort
 * */
export const getSonglistSort = () => axios.get('/playlist/catlist')

/**
 * @method 获取歌手分类列表
 * @param {number} [query.limit] - 返回数量 , 默认为 30
 * @param {number} [query.offset] - 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * @param {string} [query.initial] - 按首字母索引查找参数,如 /artist/list?type=1&area=96&initial=b 返回内容将以 name 字段开头为 b 或者拼音开头为 b
 *   为顺序排列, 热门传-1,#传0
 * @param {number} [query.type] - 获取类型。 -1:全部 1:男歌手 2:女歌手 3:乐队
 * @param {number} [query.area] - 获取类型。 -1:全部 7华语 96欧美 8:日本 16韩国 0:其他
 * */
export const getSingerSortList = (query) => axios.get('/artist/list', { params: query })

/**
 * 获取全部MV
 * @method getAllMv
 * @param {string} [query.area] - 地区,可选值为全部,内地,港台,欧美,日本,韩国,不填则为全部
 * @param {string} [query.type] - 类型,可选值为全部,官方版,原生,现场版,网易出品,不填则为全部
 * @param {string} [query.order] - 排序,可选值为上升最快,最热,最新,不填则为上升最快
 * @param {number} [query.limit] - 取出数量 , 默认为 30
 * @param {number} [query.offset] - 偏移数量 , 用于分页 , 如 :( 页数 -1)*50, 其中 50 为 limit 的值 , 默认 为 0
 * */
export const getAllMv = (query) => axios.get('/mv/all', { params: query })

/**
 *  传入搜索关键词可以搜索该音乐
 *  @method search
 *  @param {String} query.keywords：关键词
 *  @param {Number} [query.limit] - 返回数量 , 默认为 30
 *  @param {Number} [query.offset] -  偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 *  @param {Number} [query.type] - 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006:
 *   歌词, 1009: 电台, 1014: 视频, 1018:综合
 * */
export const search = (query) => axios.get('/cloudsearch', { params: query })

/**
 * 获取歌单详情
 * @method getPlaylistDetails
 * @param {number} query.id - 歌单ID
 * @param {number} [query.s] - 歌单最近的 s 个收藏者,默认为8
 * */
export const getPalylistDetails = (query) => axios.get('/playlist/detail', { params: query })

/**
 * 获取歌曲详情
 * @method getSongDetails
 * @param {string} ids - 音乐ID ,如 ids = 347230
 * */
export const getSongDetails = ids => axios.get('song/detail', { params: { ids } })

/**
 * 获取歌单收藏者
 * @method getPlaylistCollector
 * @param {number} query.id - 歌单id
 * @param {number} [query.limit] - 取出评论数量 , 默认为 20
 * @param {number} [query.offset] - 偏移数量 , 用于分页 , 如:(评论页数 -1)*20, 其中 20 为 limit 的值
 * */
export const getPlaylistCollector = (query) => axios.get('/playlist/subscribers', { params: query })

/**
 * 获取相关歌单推荐
 * @method getRelatedPlaylistRecommendations
 * @param {number} id - 歌单id (必选参数)
 * */
export const getRelatedPlaylistRecommendations = (id) => axios.get('/related/playlist', { params: { id } })
/**
 * 获取歌单评论
 * @method getPlaylistComments
 * @param {number} query.id - 歌单 id
 * @param {number} [query.limit] - 取出评论数量 , 默认为 20
 * @param {number} [query.offset] - 偏移数量 , 用于分页 , 如:(评论页数 -1)*20, 其中 20 为 limit 的值
 * @param {number} [query.before] - 分页参数,取上一页最后一项的 time 获取下一页数据(获取超过5000条评论的时候需要用到)
 * */
export const getPlaylistComments = (query) => axios.get('/comment/playlist', { params: query })
/**
 * 获取音乐Url
 * @method getMusicUrl
 * @param {number} id - 音乐 id
 * */
export const getMusicUrl = (id) => axios.get('/song/url', { params: { id } })
/**
 * 获取歌词
 * @method getLyrics
 * @param {number} id - 音乐 id
 * */
export const getLyrics = (id) => axios.get('/lyric', { params: { id } })

/**
 * 获取 mv 数据
 * @method getMvData
 * @param {number} mvid - mv 的 id
 * */
export const getMvData = (mvid) => axios.get('/mv/detail', { params: { mvid } })

/**
 * 获取 mv Url
 * @method getMvUrl
 * @param {number} query.id - mv 的 id
 * @param {number} [query.r] - 分辨率,默认1080,可从 /mv/detail 接口获取分辨率列表
 * */
export const getMvUrl = (query) => axios.get('/mv/url', { params: query })

/**
 * 获取 mv 点赞转发评论数数据
 * @method getMvInfo
 * @param {number} mvid - mv 的 id
 * */
export const getMvInfo = mvid => axios.get('/mv/detail/info', { params: { mvid } })
/**
 * 获取 mv 评论
 * @method getMvComments
 * @param {number} query.id - mv 的 id
 * @param {number} [query.limit] - 取出评论数量 , 默认为 20
 * @param {number} [query.offset] - 偏移数量 , 用于分页 , 如:(评论页数 -1)*20, 其中 20 为 limit 的值
 * @param {number} [query.before] - 分页参数,取上一页最后一项的 time 获取下一页数据(获取超过5000条评论的时候需要用到)
 * */
export const getMvComments = query => axios.get('/comment/mv', { params: query })
/**
 * 获取相似mv
 * @method getSimilarMv
 * @param {number} mvid - mv 的 id
 * */
export const getSimilarMv = mvid => axios.get('/simi/mv', { params: { mvid } })
/**
 * 发送/删除评论
 * @method sendDeleteComment
 * @param {number} query.t - 0 删除, 1 发送, 2 回复
 * @param {number} query.type - 数字,资源类型,对应歌曲,mv,专辑,歌单,电台,视频对应以下类型: 0: 歌曲 1: mv 2: 歌单 3: 专辑 4: 电台 5: 视频 6: 动态
 * @param {number} query.id - 对应资源 id
 * @param {string} query.content - 要发送的内容 / 删除的内容 id ,可通过 /comment/mv 等接口获取
 * @param {number} query.commentId - 回复的评论id (回复评论时必填)
 * */
export const sendDeleteComment = query => axios.get('/comment', { params: query })
/**
 * 获取歌手单曲,传入歌手 id, 可获得歌手部分信息和热门歌曲
 * @method getSingerSingles
 * @param {number} id - 歌手 id, 可由搜索接口获得
 * */
export const getSingerSingles = id => axios.get('/artists', { params: { id } })
/**
 * 获取歌手 mv
 * @method getSingerMv
 * @param {number} id - 歌手 id, 可由搜索接口获得
 * */
export const getSingerMv = id => axios.get('/artist/mv', { params: { id } })
/**
 * 获取歌手专辑
 * @method getSingerAlbum
 * @param {number} query.id - 歌手 id, 可由搜索接口获得
 * @param {number} [query.limit] - 取出数量 , 默认为 50
 * @param {number} [query.offset] - 偏移数量 , 用于分页 , 如 :( 页数 -1)*50, 其中 50 为 limit 的值 , 默认 为 0
 * */
export const getSingerAlbum = query => axios.get('/artist/album', { params: query })
/**
 * 获取歌手描述
 * @method getSingerDesc
 * @param {number} id - 歌手 id
 * */
export const getSingerDesc = id => axios.get('/artist/desc', { params: { id } })
/**
 * 获取歌手详情
 * @method getArtistDetails
 * @param {number} id - 歌手 id
 * */
export const getArtistDetails = id => axios.get('/artist/detail', { params: { id } })
/**
 * 获取相似歌手
 * @method getSimilarSingers
 * @param {number} id - 歌手 id
 * */
export const getSimilarSingers = id => axios.get('/simi/artist', { params: { id } })
/**
 * 获取歌手全部歌曲
 * @method getAllTheSongsOfTheSinger
 * @param {number} query.id - 歌手 id
 * @param {string} [query.order] - hot ,time 按照热门或者时间排序
 * @param {number} [query.limit] - 取出歌单数量 , 默认为 50
 * @param {number} [query.offset] - 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*50, 其中 50 为 limit 的值
 * */
export const getAllTheSongsOfTheSinger = query => axios.get('/artist/songs', { params: query })
/**
 * 歌手热门50首歌曲
 * @method getSingerTop50Songs
 * @param {number} id - 歌手 id
 * */
export const getSingerTop50Songs = id => axios.get('/artist/top/song', { params: { id } })
/**
 * 评论点赞
 * @method commentLike
 * @param {number} query.id - 资源 id, 如歌曲 id,mv id
 * @param {number} query.cid - 评论 id
 * @param {number} query.t - 是否点赞 ,1 为点赞 ,0 为取消点赞
 * @param {number} query.type - 0: 歌曲 1: mv 2: 歌单 3: 专辑 4: 电台 5: 视频 6: 动态
 * */
export const commentLike = query => axios.get('/comment/like', { params: query })

/**
 * 获取视频标签列表
 * @method getAListOfVideoTags
 * */
export const getAListOfVideoTags = () => axios.get('/video/group/list')
/**
 * 获取视频分类列表
 * @method getAListOfVideoCategories
 * */
export const getAListOfVideoCategories = (query) => axios.get('/video/category/list', { params: query })
/**
 * 获取视频标签/分类下的视频 调用此接口 , 传入标签/分类id,可获取到相关的视频,分页参数只能传入offset
 * @method getRelatedVideoList
 * @param {number} query.id - videoGroup 的 id
 * @param {number} [query.offset] - 默认0
 * */
export const getRelatedVideoList = (query) => axios.get('/video/group', { params: query })
/**
 * 获取全部视频列表
 * @method getAllVideoList
 * @param {number} [query.offset] - 默认0
 * */
export const getAllVideoList = (query) => axios.get('/video/timeline/all', { params: query })
