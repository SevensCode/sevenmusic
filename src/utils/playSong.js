import store from '@/store/index'
import { getLyrics, getMusicUrl, getSongDetails } from '@/API/server/api'
import tool from '@/utils/tool'

// 获取歌曲信息
export const getMusicInfo = async (id) => {
  // 获取歌曲信息
  const { data: musicInfo } = await getSongDetails(id)
  const mm = tool.formatZero(new Date(musicInfo.songs[0].dt).getMinutes())
  const ss = tool.formatZero(new Date(musicInfo.songs[0].dt).getSeconds())
  musicInfo.songs[0].playT = mm + ':' + ss
  store.commit('currendMusicInfo', musicInfo.songs[0])
}
// 播放音乐
export const playMusic = async () => {
  store.state.lyricsDom.style.top = 0
  store.commit('currentLyricsTopZero')
  const audio = store.state.audioDom
  const { data: res } = await getMusicUrl(store.state.musicInfo.id)
  store.commit('musicUrl', res.data[0].url)
  if (store.state.musicUrl.length !== 0) {
    audio.play().catch(() => {
    })
    // 监听音频播放的实时时间事件
    audio.addEventListener('timeupdate', () => {
      // 用秒数来显示当前播放进度
      const timeDisplay = Math.floor(audio.currentTime) // 获取实时时间
      // 音乐时长
      store.commit('getMusicDuration', Math.floor(audio.duration))
      // 进度条的值
      store.commit('getProgressBarValue', Math.floor(audio.currentTime))
      // 分钟
      const minute = timeDisplay / 60
      let minutes = parseInt(minute)
      minutes = tool.formatZero(minutes)
      // 秒
      const second = timeDisplay % 60
      let seconds = Math.round(second)
      seconds = tool.formatZero(seconds)
      store.commit('currendPlayTime', minutes + ':' + seconds)
      songAndLyricsSynchronization()
      // 播放完当前音乐自动切换下一首
      if (Math.floor(audio.duration) === Math.floor(audio.currentTime)) {
        pauseMusic()
        nextSong()
      }
    })
  }
}

export const pauseMusic = () => {
  const audio = store.state.audioDom
  audio.pause()
}

// 下一首
export const nextSong = async () => {
  let index = store.state.playlist.findIndex(item => {
    return item.id === store.state.musicInfo.id
  })
  if (index === store.state.playlist.length - 1) {
    index = -1
  }
  switch (store.state.playOrder) {
    case 0:
      await getMusicInfo(store.state.playlist[index + 1].id)
      await lyrics()
      break
    case 1:
      await getMusicInfo(store.state.playlist[index].id)
      await lyrics()
      break
    case 2:
      await getMusicInfo(store.state.playlist[Math.floor(Math.random() * store.state.playlist.length)].id)
      await lyrics()
      break
  }
  store.state.playing = true
  await playMusic()
}
// 上一首
export const previousSong = async () => {
  let index = store.state.playlist.findIndex(item => {
    return item.id === store.state.musicInfo.id
  })
  if (index === 0) {
    index = store.state.playlist.length
  }
  switch (store.state.playOrder) {
    case 0:
      await getMusicInfo(store.state.playlist[index - 1].id)
      await lyrics()
      break
    case 1:
      await getMusicInfo(store.state.playlist[index].id)
      await lyrics()
      break
    case 2:
      await getMusicInfo(store.state.playlist[Math.floor(Math.random() * store.state.playlist.length)].id)
      await lyrics()
      break
  }
  store.state.playing = true
  await playMusic()
}

export const lyrics = async () => {
  // 歌曲id
  const id = store.state.musicInfo.id
  // 歌词容器dom
  const lyricsBox = store.state.lyricsDom
  // 获取歌词
  const { data: lyrics } = await getLyrics(id)
  console.log(lyrics)
  if (lyrics.klyric && lyrics.lrc) {
    // 原歌词
    const Olyrics = lyrics.lrc.lyric.split(/\[.*?\]/).filter(value => !!value)
    store.commit('getLyricsTime', lyrics.lrc.lyric.match(/\d{2,}?:\d{2}/g))
    lyricsBox.innerHTML = ''
    Olyrics.forEach((item) => {
      const p = document.createElement('p')
      p.className = 'lyricsStyle'
      p.innerText = item
      lyricsBox.appendChild(p)
    })
  }
}

// 歌词与歌曲同步
export const songAndLyricsSynchronization = () => {
  const p = document.querySelectorAll('.lyricsStyle')
  if (store.state.lyricsTime) {
    let index = store.state.lyricsTime.findIndex(item => {
      return item === store.state.currendPlayTime
    })
    try {
      p[index].classList.add('lyricsActive')
      p.forEach((item) => {
        item.classList.remove('lyricsActive')
      })
      if (p[index].innerHTML === '<br>') {
        index -= 1
      }
      store.commit('upDateIndex', index)
      p[index].classList.add('lyricsActive')
    } catch (e) {
    }
  }
}
