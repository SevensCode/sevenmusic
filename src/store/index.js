import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
    // 搜索对话框
    searchDialog: false,
    // 音乐信息
    musicInfo: {},
    // 播放器是否显示
    playMusicShow: false,
    // 是否播放中
    playing: false,
    // 播放器dom
    audioDom: '',
    // 音乐url
    musicUrl: '',
    // 音乐播放时间
    musicDuration: 0,
    // 当前播放时间
    currendPlayTime: '',
    // 进度条
    progressBar: 0,
    // 音乐音量
    musicVolume: 50,
    playlist: [],
    // 播放顺序 0 默认循环列表播放
    playOrder: 0,
    // 歌词
    lyric: '',
    // 歌词容器dom
    lyricsDom: '',
    // 歌词时间
    lyricsTime: [],
    // 当前歌词高度
    currentLyricsTop: 0,
    // 当前歌词Index
    currentIndex: 0,
    // 评论区域是否显示
    allCommentAreaisShow: false
  },
  mutations: {
    // 显示Loading
    showLoading (state) {
      state.loading = true
    },
    // 隐藏Loading
    hideLoading (state) {
      state.loading = false
    },
    // 显示搜索对话框
    showSearchDialog (state) {
      state.searchDialog = true
    },
    // 隐藏搜索对话框
    hideSearchDialog (state) {
      state.searchDialog = false
    },
    // 当前播放的音乐的信息
    currendMusicInfo (state, info) {
      state.musicInfo = info
      state.playMusicShow = true
    },
    // 播放中
    playing (state) {
      state.playing = true
    },
    // 暂停
    pause (state) {
      state.playing = false
    },
    // 音频组件的dom
    getAudioDom (state, dom) {
      state.audioDom = dom
    },
    // 音乐的Url
    musicUrl (state, url) {
      state.musicUrl = url
    },
    // 当前播放时间
    currendPlayTime (state, time) {
      state.currendPlayTime = time
    },
    // 获取进度条值
    getProgressBarValue (state, value) {
      state.progressBar = value
    },
    // 音乐时长
    getMusicDuration (state, time) {
      state.musicDuration = time
    },
    // 获取音乐音量
    getMusicVolume (state, volume) {
      state.musicVolume = volume
    },
    // 获取播放列表
    getPlaylist (state, playlist) {
      state.playlist = playlist
    },
    // 改变播放顺序
    changePlayOrder (state, order) {
      state.playOrder = order
    },
    // 获取歌词
    getLyrics (state, lyrics) {
      state.lyric = lyrics
    },
    // 获取歌词容器dom
    getLyricsDom (state, dom) {
      state.lyricsDom = dom
    },
    // 获取歌词时间
    getLyricsTime (state, time) {
      state.lyricsTime = time
    },
    editCurrentLyricsTop (state, top) {
      state.currentLyricsTop = top
    },
    currentLyricsTopZero (state) {
      state.currentLyricsTop = 0
    },
    upDateIndex (state, index) {
      state.currentIndex = index
    },
    toggleDisplayOfAllCommentAreas (state) {
      state.allCommentAreaisShow = !state.allCommentAreaisShow
    }
  },
  actions: {},
  modules: {}
})
