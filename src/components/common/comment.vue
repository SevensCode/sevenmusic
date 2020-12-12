<template>
  <div>
    <section v-if="$store.state.isLogin&&showUserCommentArea" class="userComment">
      <section class="userComment-header">
        <p><i class="el-icon-user"></i><span>{{ userInfo.profile.nickname }}</span>，你好！</p>
      </section>
      <section class="userComment-main">
        <img :onerror="defaultImg" :src="userInfo.profile.avatarUrl" alt="">
        <label>
          <textarea v-model="commentAndReplyQuery.content" placeholder="瞅啥呢！"></textarea>
        </label>
      </section>
      <section class="userComment-footer">
        <button @click="postComments">评论</button>
      </section>
    </section>
    <p v-else-if="!$store.state.isLogin" class="notLoggedIn">
      <a @click="login">登录</a>
      后可以评论！
    </p>
    <section v-if="hotCommentList.length>0" class="title">
      <span class="bar"></span>
      <p>精彩评论</p>
    </section>
    <section v-for="item in hotCommentList" :key="item.commentId" class="commentList">
      <img :onerror="defaultImg" :src="item.user.avatarUrl" alt="">
      <section class="comment-area">
        <section class="comment-header">
          <p class="userNickname">
            {{ item.user.nickname }}
            <span>{{ item.time | howLongHasItBeenSinceLastTime }}</span>
          </p>
          <p class="function">
            <span>{{ item.likedCount }}</span>
            <i class="iconfont icon-thumbsup"></i>&nbsp;|&nbsp;
            <i class="iconfont icon-xiaoxi-s" @click="showReplyCommentArea(item)"></i>
          </p>
        </section>
        <p class="comment-content">{{ item.content }}
          <span v-if="item.beReplied.length>0" class="beReplied">
            <span class="beRepliedUser">@{{ item.beReplied[0].user.nickname }}:</span>
            {{ item.beReplied[0].content }}
          </span>
        </p>
        <section v-if="commentAndReplyQuery.commentId===item.commentId" class="userComment">
          <section class="userComment-header">
            <p><i class="el-icon-user"></i><span>{{ userInfo.profile.nickname }}</span>，你好！</p>
            <button @click="hideReplyCommentArea">取消回复</button>
          </section>
          <section class="userComment-main">
            <img :onerror="defaultImg" :src="userInfo.profile.avatarUrl" alt="">
            <label>
              <textarea v-model="commentAndReplyQuery.content" placeholder="瞅啥呢！"></textarea>
            </label>
          </section>
          <section class="userComment-footer">
            <button @click="replyToComments(item)">评论</button>
          </section>
        </section>
      </section>
    </section>
    <section v-if="latestCommentsList.length>0" class="title">
      <span class="bar"></span>
      <p>最新评论</p>
    </section>
    <el-alert
        v-if="latestCommentsList.length<1&&userInfo"
        :closable="false"
        center
        class="noComments"
        title="还没有评论哦 ~ 快来评论"
        type="info">
    </el-alert>
    <section v-for="(item,i) in latestCommentsList" :key="i" class="commentList">
      <img :onerror="defaultImg" :src="item.user.avatarUrl" alt="">
      <section class="comment-area">
        <section class="comment-header">
          <p class="userNickname">{{ item.user.nickname }}<span>{{ item.time | howLongHasItBeenSinceLastTime }}</span>
          </p>
          <p class="function">
            <span>{{ item.likedCount }}</span>
            <i class="iconfont icon-thumbsup"></i>&nbsp;|&nbsp;<i
              class="iconfont icon-xiaoxi-s" @click="showReplyCommentArea(item)"></i>
          </p>
        </section>
        <p class="comment-content">{{ item.content }}
          <span v-if="item.beReplied.length>0" class="beReplied">
            <span class="beRepliedUser">@{{ item.beReplied[0].user.nickname }}:</span>
            {{ item.beReplied[0].content }}
          </span>
        </p>
        <section v-if="commentAndReplyQuery.commentId===item.commentId" class="userComment">
          <section class="userComment-header">
            <p><i class="el-icon-user"></i><span>{{ userInfo.profile.nickname }}</span>，你好！</p>
            <button @click="hideReplyCommentArea">取消回复</button>
          </section>
          <section class="userComment-main">
            <img :onerror="defaultImg" :src="userInfo.profile.avatarUrl" alt="">
            <label>
              <textarea v-model="commentAndReplyQuery.content" placeholder="瞅啥呢！"></textarea>
            </label>
          </section>
          <section class="userComment-footer">
            <button @click="replyToComments(item)">评论</button>
          </section>
        </section>
      </section>
    </section>
    <pager v-if="commentList.total>latestCommentsList.length" :handle-current-change="handleCurrentChange"
           :limit="query.limit" :total="commentList.total"></pager>
  </div>
</template>

<script>

import Pager from '@/components/common/pager'
import { sendDeleteComment } from '@/API/server/api'

export default {
  name: 'comment',
  components: {
    Pager
  },
  props: {
    commentList: Object,
    query: Object,
    getCommentList: Function,
    type: Number
  },
  data () {
    return {
      // 用户信息
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      // 热门评论列表
      hotCommentList: [],
      // 最新评论列表
      latestCommentsList: [],
      // 当前评论id
      currentCommentID: 0,
      // 用户评论区域
      showUserCommentArea: true,
      // 评论回复参数
      commentAndReplyQuery: {
        // 0 删除, 1 发送, 2 回复
        t: 1,
        // 0: 歌曲 1: mv 2: 歌单 3: 专辑 4: 电台 5: 视频 6: 动态
        type: this.type,
        // mvid
        id: this.$route.query.id,
        // 要发送的内容
        content: '',
        // 回复的评论id (回复评论时必填)
        commentId: 0,
        cookie: window.sessionStorage.getItem('cookie')
      },
      // 点赞参数
      linkQuery: {
        // 资源 id, 如歌曲 id,mv id
        id: this.$route.query.id,
        // 评论id
        cid: 0,
        // 是否点赞 ,1 为点赞 ,0 为取消点赞
        t: 1,
        // 0: 歌曲 1: mv 2: 歌单 3: 专辑 4: 电台 5: 视频 6: 动态
        type: this.type,
        cookie: window.sessionStorage.getItem('cookie')
      }
    }
  },
  mounted () {
    this.info()
  },
  methods: {
    info () {
      if (this.commentList.hotComments) {
        this.hotCommentList = []
        this.commentList.hotComments.forEach(item => {
          this.hotCommentList.push(item)
        })
      }
      if (this.commentList.comments) {
        this.latestCommentsList = []
        this.commentList.comments.forEach(item => {
          this.latestCommentsList.push(item)
        })
      }
    },
    // 分页器
    handleCurrentChange (newPage) {
      this.query.offset = (newPage - 1) * this.query.limit
      this.getCommentList()
    },
    // 显示回复评论区域，隐藏用户评论区域
    showReplyCommentArea (item) {
      if (!this.$store.state.isLogin) return false
      this.commentAndReplyQuery.commentId = item.commentId
      this.showUserCommentArea = false
    },
    // 隐藏回复评论区域，显示用户评论区域
    hideReplyCommentArea () {
      this.commentAndReplyQuery.commentId = 0
      this.showUserCommentArea = true
    },
    // 发布评论
    async postComments () {
      if (this.commentAndReplyQuery.content.length === 0) {
        return this.$message.info('请输入内容！')
      }
      this.commentAndReplyQuery.commentId = 0
      this.commentAndReplyQuery.t = 1
      const { data: res } = await sendDeleteComment(this.commentAndReplyQuery)
      if (res.code === 200) {
        this.commentAndReplyQuery.content = ''
        this.getCommentList()
        return this.$message.success('评论成功！')
      } else {
        return this.$message.error('评论失败')
      }
    },
    // 回复评论
    async replyToComments (item) {
      if (this.commentAndReplyQuery.content.length === 0) {
        return this.$message.info('请输入内容！')
      }
      this.commentAndReplyQuery.commentId = item.commentId
      this.commentAndReplyQuery.t = 2
      const { data: res } = await sendDeleteComment(this.commentAndReplyQuery)
      if (res.code === 200) {
        this.commentAndReplyQuery.content = ''
        this.commentAndReplyQuery.commentId = 0
        this.getCommentList()
        return this.$message.success('评论成功！')
      } else {
        return this.$message.error('评论失败')
      }
    },
    // 登录
    login () {
      window.sessionStorage.setItem('recording', location.hash.slice(1))
      this.$router.push('/login')
    }
  },
  computed: {
    defaultImg () {
      return 'this.src="' + require('../../assets/img/defaultImg.png') + '"'
    }
  },
  watch: {
    commentList: function (value) {
      if (value.hotComments) {
        this.hotCommentList = []
        value.hotComments.forEach(item => {
          this.hotCommentList.push(item)
        })
      }
      this.latestCommentsList = []
      value.comments.forEach(item => {
        this.latestCommentsList.push(item)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  display: flex;
  justify-content: left;
  align-items: center;
  margin: 20px 0;

  p {
    font-size: 14px;
    color: #4a4a4a;
    font-weight: 1000;
  }
}

.like {
  color: #FA2800;
}

.notLoggedIn {
  width: 100%;
  text-align: center;

  a {
    color: #FA2800;
    font-weight: 1000;
    cursor: pointer;
  }
}

.noComments {
  margin-top: 20px;
  width: 100%;
}

.userComment {
  width: 100%;

  .userComment-header {
    width: 100%;
    font-size: 14px;
    color: #4a4a4a;
    display: flex;
    justify-content: space-between;
    height: 32px;
    margin-bottom: 10px;
    margin-top: 10px;

    i {
      margin-right: 15px;
      font-weight: 1000;
      line-height: 30px;
      font-size: 16px;
    }

    button {
      padding: 5px 15px;
      border: 1px solid #dee3ff;
      outline: none;
      background: white;
      color: #4a4a4a;
      font-size: 12px;
      cursor: pointer;
    }
  }

  .userComment-main {
    width: 100%;
    display: grid;
    grid-template-columns: 8% 92%;
    justify-content: space-between;
    align-items: flex-start;

    img {
      width: 50px;
      height: 50px;
      border-radius: 3px;
    }

    textarea {
      width: 100%;
      height: 80px;
      resize: none;
      outline: none;
      background: #f8f9ff;
      border: 1px solid #eaebff;
      padding: 10px;
      border-radius: 3px;
    }
  }

  .userComment-footer {
    width: 100%;
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;

    button {
      font-size: 13px;
      border-radius: 3px;
      border: none;
      outline: none;
      padding: 10px 25px;
      color: white;
      cursor: pointer;
      background: linear-gradient(90deg, #ff4b2b, #ff416c);
    }
  }
}

.commentList {
  display: flex;
  margin-top: 20px;
  justify-content: space-between;
  margin-bottom: 20px;

  img {
    width: 45px;
    height: 45px;
    border-radius: 100%;
    margin-right: 20px;
  }

  .comment-area {
    flex: 1;

    .comment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      .userNickname {
        font-size: 15px;
        color: #4a4a4a;
        font-weight: 600;

        span {
          font-size: 12px;
          color: #a5a5c1;
          margin-left: 10px;
          font-weight: 500;
        }
      }

      .function {
        color: #a5a5c1;

        i {
          color: black;
          cursor: pointer;
        }

        span {
          font-size: 12px;
          margin-right: 5px;
        }
      }
    }

    .comment-content {
      width: 100%;
      font-size: 12px;
      padding: 10px 10px;
      background: #f5f5f5;
      border-radius: 3px;
      line-height: 22px;

      .beReplied {
        display: block;
        width: 100%;
        background: white;
        padding: 10px 10px;
        margin-top: 10px;
        color: #666666;

        .beRepliedUser {
          color: #FA2800;
        }
      }
    }
  }
}
</style>
