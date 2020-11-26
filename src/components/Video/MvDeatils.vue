<template>
  <div class="container layout">
    <!-- 视频区域 -->
    <el-card class="mv">
      <video :src="mvUrl" controls height="530" width="950"></video>
      <!-- mv信息区域 -->
      <section class="video-info">
        <p class="title"><i class="iconfont icon-MV"></i>{{ mvData.name }}</p>
        <p class="tag">
          <span v-for="item in mvData.videoGroup" :key="item.id">#{{ item.name }}</span>
        </p>
        <p class="time-playcount">
          <span>发布：{{ mvData.publishTime }}</span>
          <span>播放：{{ mvData.playCount }}</span>
        </p>
        <p class="trend">
          <el-tag color="#f2f2f2"><i class="iconfont icon-zan"></i>{{ mvInfo.likedCount }}</el-tag>
          <el-tag color="#f2f2f2"><i class="iconfont icon-shoucang"></i>{{ mvData.subCount }}</el-tag>
          <el-tag color="#f2f2f2"><i class="iconfont icon-fenxiang"></i>{{ mvData.shareCount }}</el-tag>
        </p>
        <p class="commentsTotal"><i class="iconfont icon-tubiao-"></i>Comments | {{ mvInfo.commentCount }} 条评论 </p>
      </section>
      <!-- mv评论区域 -->
      <section v-if="commentAreaIsShow&&query.cookie" class="mvComments">
        <p class="user"><i class="iconfont icon-yonghu"></i><span>{{ userInfo.profile.nickname }}</span>你好 ！</p>
        <section class="postComments">
          <img :src="userInfo.profile.avatarUrl" alt="">
          <label>
            <textarea v-model="query.content" placeholder="瞅啥呢！"></textarea>
          </label>
        </section>
        <section class="btn">
          <button class="postBut" @click="sendComment">评论</button>
        </section>
      </section>
      <section v-else class="pleaseSignIn">
        <el-alert
            :closable="false"
            center
            type="info">
          <template slot="title">
            <p><span @click="login">登录</span>后可以评论!</p>
          </template>
        </el-alert>
      </section>
      <section v-if="hotComentList.length>0" class="Comment">
        <span class="bar"></span>
        <span class="header">热门评论</span>
        <ul>
          <li v-for="(item) in hotComentList" :key="item.commentId" class="CommentLsit">
            <img :src="item.user.avatarUrl" alt="">
            <section class="info">
              <section class="title">
                <section>
                  <span class="nickname">{{ item.user.nickname }}</span>
                  <span class="commentTime">{{ item.time }}</span>
                </section>
                <section>
                  <span class="praiseCount"><i class="iconfont icon-fabulous"></i>（{{ item.likedCount }}）</span>
                  <span class="mid">&mid;</span>
                  <i class="commentBtn iconfont icon-xiaoxi-s" @click="oppenComment(item.commentId)"></i>
                </section>
              </section>
              <div class="content">
                {{ item.content }}
                <div v-if="item.beReplied.length>0" class="beReplied">
                  <p v-for="item in item.beReplied" :key="item.beRepliedCommentId">
                    <section>
                      <span class="user">#{{ item.user.nickname }}：</span>
                      <span class="userRepliedContent">{{ item.content }}</span>
                    </section>
                  </p>
                </div>
              </div>
              <section v-if="item.commentId===query.commentId" class="mvComments">
                <section class="user">
                  <p><i class="iconfont icon-yonghu"></i><span>{{ userInfo.profile.nickname }}</span>你好 ！</p>
                  <el-button class="button" size="mini" @click="cancelReply">取消回复</el-button>
                </section>
                <section class="postComments">
                  <img :src="userInfo.profile.avatarUrl" alt="">
                  <label>
                    <textarea v-model="query.content" placeholder="瞅啥呢！"></textarea>
                  </label>
                </section>
                <section class="btn">
                  <button class="postBut" @click="replyToComments">评论</button>
                </section>
              </section>
            </section>
          </li>
        </ul>
      </section>
      <section class="Comment">
        <span class="bar"></span>
        <span class="header">最新评论</span>
        <p v-if="latestCommentList.length<1" class="noCommentYet">暂无评论！</p>
        <ul v-if="!$store.state.loading">
          <li v-for="item in latestCommentList" :key="item.commentId" class="CommentLsit">
            <img :src="item.user.avatarUrl" alt="">
            <section class="info">
              <section class="title">
                <section>
                  <span class="nickname">{{ item.user.nickname }}</span>
                  <span class="commentTime">{{ item.time }}</span>
                </section>
                <section>
                  <span class="praiseCount"><i class="iconfont icon-fabulous"></i>（{{ item.likedCount }}）</span>
                  <span class="mid">&mid;</span>
                  <i class="commentBtn iconfont icon-xiaoxi-s" @click="oppenComment(item.commentId)"></i>
                </section>
              </section>
              <div class="content">
                {{ item.content }}
                <div v-if="item.beReplied.length>0" class="beReplied">
                  <p v-for="item in item.beReplied" :key="item.beRepliedCommentId">
                    <section>
                      <span class="user">#{{ item.user.nickname }}：</span>
                      <span class="userRepliedContent">{{ item.content }}</span>
                    </section>
                  </p>
                </div>
              </div>
              <section v-if="item.commentId===query.commentId" class="mvComments">
                <section class="user">
                  <p><i class="iconfont icon-yonghu"></i><span>{{ userInfo.profile.nickname }}</span>你好 ！</p>
                  <el-button class="button" size="mini" @click="cancelReply">取消回复</el-button>
                </section>
                <section class="postComments">
                  <img :src="userInfo.profile.avatarUrl" alt="">
                  <label>
                    <textarea v-model="query.content" placeholder="瞅啥呢！"></textarea>
                  </label>
                </section>
                <section class="btn">
                  <button class="postBut" @click="replyToComments">评论</button>
                </section>
              </section>
            </section>
          </li>
        </ul>
        <Loading v-else></Loading>
        <section v-if="mvInfo.commentCount>20" class="pagination">
          <el-pagination
              :page-size="latestCommentQuery.limit"
              :total=mvInfo.commentCount
              background
              layout="total, prev, pager, next, jumper"
              @current-change="handleCurrentChange">
          </el-pagination>
        </section>
      </section>
    </el-card>
    <!-- MV简介与相关推荐区域 -->
    <div class="related">
      <el-card class="introductionToMv">
        <span class="bar"></span>
        <span class="title">MV简介</span>
        <p v-if="mvData.desc" class="content"><span>{{ mvData.desc }}</span></p>
        <p v-else>什么都没写哦 ~</p>
      </el-card>
      <el-card class="relatedMv">
        <span class="bar"></span>
        <span class="title">相关MV</span>
        <section v-for="item in similarMvList" :key="item.id" class="relatedMvList">
          <section class="frontCover">
            <img :src="item.cover" alt="">
            <i class="el-icon-caret-right"></i>
          </section>
          <h1 class="mvName"><i class="iconfont icon-MV"></i>{{ item.name }}</h1>
          <p class="author">By.{{ item.artistName }}</p>
        </section>
      </el-card>
    </div>
  </div>
</template>

<script>
import Loading from '@/components/common/Loading/Loading'
import { getMvComments, getMvData, getMvInfo, getMvUrl, getSimilarMv, sendDeleteComment } from '@/API/server/api'
import tool from '@/utils/tool'
import '@/assets/css/common/pagination.less'

export default {
  components: {
    Loading
  },
  data () {
    return {
      // mvid
      id: this.$route.query.id,
      // mv数据
      mvData: {},
      // mv播放链接
      mvUrl: '',
      // mv信息
      mvInfo: {},
      // 当前登录的用户信息
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      // 热门评论查询参数
      hotCommentQuery: {
        id: this.$route.query.id,
        limit: 20,
        offset: 0
      },
      // 最新评论查询参数
      latestCommentQuery: {
        id: this.$route.query.id,
        limit: 20,
        offset: 0
      },
      // 热门评论列表
      hotComentList: [],
      // 最新评论列表
      latestCommentList: [],
      // 相识 Mv 列表
      similarMvList: [],
      // 发布评论区域是否显示
      commentAreaIsShow: true,
      // 评论id
      commentId: 0,
      query: {
        // 0 删除, 1 发送, 2 回复
        t: 1,
        // 0: 歌曲 1: mv 2: 歌单 3: 专辑 4: 电台 5: 视频 6: 动态
        type: 1,
        // mvid
        id: this.$route.query.id,
        // 要发送的内容
        content: '',
        // 回复的评论id (回复评论时必填)
        commentId: 0,
        cookie: window.sessionStorage.getItem('cookie')
      }
    }
  },
  created () {
    this.getMvDatas()
    this.getMvComment()
    this.getSimilarMv()
  },
  methods: {
    async getMvDatas () {
      // 获取mv数据
      const { data: mvData } = await getMvData(this.id)
      this.mvData = mvData.data
      const { data: mvUrl } = await getMvUrl({
        id: this.id
      })
      this.mvUrl = mvUrl.data.url
      // 获取mv评论数
      const { data: mvInfo } = await getMvInfo(this.id)
      this.mvInfo = mvInfo
    },
    async getMvComment () {
      // 获取mv评论
      const { data: hotComments } = await getMvComments(this.hotCommentQuery)
      const { data: latestComments } = await getMvComments(this.latestCommentQuery)
      this.hotComentList = hotComments.hotComments
      this.latestCommentList = latestComments.comments
      this.hotComentList.forEach(item => {
        item.time = tool.getDistanceSpecifiedTime(item.time)
      })
      this.latestCommentList.forEach(item => {
        item.time = tool.getDistanceSpecifiedTime(item.time)
      })
    },
    async getSimilarMv () {
      const { data: similarMv } = await getSimilarMv(this.id)
      this.similarMvList = similarMv.mvs
    },
    handleCurrentChange (newPage) {
      this.latestCommentQuery.offset = (newPage - 1) * 20
      this.getMvComment()
    },
    // 打开评论回复
    oppenComment (commentId) {
      if (!this.query.cookie) {
        return this.$message.error('请登录！')
      }
      // 关闭发布评论
      this.commentAreaIsShow = false
      // 开启评论回复
      this.query.commentId = commentId
    },
    // 取消评论
    cancelReply () {
      // 打开发布评论
      this.commentAreaIsShow = true
      // 关闭评论回复
      this.query.commentId = 0
    },
    // 发送评论
    async sendComment () {
      if (this.query.content.trim().length < 1) {
        return false
      }
      await sendDeleteComment(this.query)
      await this.getMvComment()
      this.query.content = ''
      this.$message.success('正在审核，3分钟后刷新页面显示！')
    },
    // 回复评论
    async replyToComments () {
      if (this.query.content.trim().length < 1) {
        return false
      }
      this.query.t = 2
      await sendDeleteComment(this.query)
      this.query.commentId = 0
      this.query.content = ''
      this.$message.success('正在审核，3分钟后刷新页面后显示！')
    },
    login () {
      this.$router.push('login')
    }
  }
}
</script>

<style lang="less" scoped>
.layout {
  display: grid;
  grid-template-columns: 1000px 350px;
  justify-content: space-between;
  align-items: start;

  .el-card {
    border-radius: 10px;
  }

  .mv {
    display: flex;
    justify-content: center;
    flex-direction: row;

    video {
      background: black;
    }

    .video-info {
      p {
        margin: 15px 0;
        width: 100%;
        display: flex;
        justify-content: left;
        align-items: center;
      }

      .span {
        display: flex;
        justify-content: left;
        align-items: center;
      }

      .title {
        color: #4a4a4a;
        font-size: 16px;
        font-weight: 1000;

        i {
          color: #FA2800;
          margin-right: 5px;
          font-size: 20px;
          font-weight: 500;
        }
      }

      .tag {
        color: #FA2800;

        span {
          margin-right: 10px;
          font-size: 12px;
          cursor: pointer;
        }
      }

      .time-playcount {
        font-size: 12px;
        color: #999999;

        span {
          margin-right: 10px;
        }
      }

      .el-tag {
        color: black;
        font-weight: 700;
        font-size: 14px;
        height: 28px;
        border: none;
        margin-right: 15px;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        i {
          margin-right: 5px;
        }
      }

      .commentsTotal {
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: left;
        align-items: center;
        color: #4a4a4a;
        font-size: 14px;
        border-bottom: 1px solid #f1f1f1;
        margin-bottom: 10px;

        i {
          margin-right: 10px;
        }
      }
    }

    .mvComments {
      width: 100%;

      .user {
        width: 100%;
        height: 50px;
        font-size: 14px;
        color: #4a4a4a;
        display: flex;
        justify-content: left;
        align-items: center;

        i {
          font-size: 15px;
          font-weight: 700;
          margin-right: 10px;
        }

        span {
          transition: .3s;
          cursor: pointer;
        }

        span:hover {
          color: #FA2800;
        }
      }

      .postComments {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: start;
        margin-bottom: 20px;

        img {
          width: 50px;
          height: 50px;
          border-radius: 3px;
        }

        textarea {
          width: 880px;
          height: 90px;
          padding: 15px;
          resize: none;
          outline: none;
          border: 1px solid #eaebff;
          background: #f8f9ff;
          font-size: 13px;
          border-radius: 3px;
        }
      }

      .btn {
        display: flex;
        justify-content: flex-end;

        button {
          border: none;
          background: linear-gradient(90deg, #ff4b2b, #ff416c);
          outline: none;
          width: 84px;
          height: 36px;
          color: white;
          cursor: pointer;
          border-radius: 3px;
        }
      }
    }

    .pleaseSignIn {
      span {
        margin: 0 5px;
        transition: 0.5s;
        cursor: pointer;
      }

      span:hover {
        color: #FA2800;
      }
    }

    .Comment {
      margin-top: 20px;
      margin-bottom: 20px;

      .noCommentYet {
        text-align: center;
        margin-top: 10px;
        font-weight: 1000;
        font-size: 14px;
      }

      .header {
        font-size: 16px;
        color: #4a4a4a;
        margin-bottom: 15px;
        font-weight: 1000;
      }

      .CommentLsit {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;

        img {
          width: 45px;
          height: 45px;
          border-radius: 100%;
        }

        .info {
          width: 890px;

          .title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;

            section {
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .nickname {
              font-size: 15px;
              color: #4a4a4a;
              margin-right: 5px;
              font-weight: 1000;
            }

            .commentTime {
              color: #a5a5c1;
              font-size: 12px;
            }

            .praiseCount {
              font-size: 12px;
              color: #666666;

              i {
                font-size: 16px;
                cursor: pointer;
              }
            }

            .mid {
              margin: 0 5px;
            }

            .commentBtn {
              font-size: 20px;
              cursor: pointer;
            }
          }

          .content {
            width: 100%;
            font-size: 12px;
            padding: 10px 10px;
            background: #f5f5f5;
            border-radius: 3px;
            line-height: 22px;

            .beReplied {
              margin: 5px;
              padding: 10px;
              background: #ffffff;
              border-radius: 3px;

              p {
                display: flex;
                justify-content: space-between;
                align-items: start;
                line-height: 22px;

                .user {
                  color: #FA2800;
                  cursor: pointer;
                }
              }
            }
          }
        }
      }

      .mvComments {
        width: 100%;

        .user {
          width: 100%;
          height: 50px;
          font-size: 14px;
          color: #4a4a4a;
          display: flex;
          justify-content: space-between;
          align-items: center;

          i {
            font-size: 15px;
            font-weight: 700;
            margin-right: 10px;
          }

          span {
            transition: .3s;
            cursor: pointer;
          }

          span:hover {
            color: #FA2800;
          }

          .el-button {
            background: #4a4a4a;
            color: #f5f5f5;
          }
        }

        .postComments {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 20px;

          img {
            width: 50px;
            height: 50px;
            border-radius: 3px;
          }

          textarea {
            width: 823px;
            height: 90px;
            padding: 15px;
            resize: none;
            outline: none;
            border: 1px solid #eaebff;
            background: #f8f9ff;
            font-size: 13px;
            border-radius: 3px;
          }
        }

        .btn {
          display: flex;
          justify-content: flex-end;

          button {
            border: none;
            background: linear-gradient(90deg, #ff4b2b, #ff416c);
            outline: none;
            width: 84px;
            height: 36px;
            color: white;
            cursor: pointer;
            border-radius: 3px;
          }
        }
      }
    }
  }

  .related {
    .introductionToMv {
      .title {
        font-size: 14px;
        font-weight: 1000;
        color: #4a4a4a;
      }

      p {
        color: #4a4a4a;
        font-size: 14px;
        margin-top: 20px;
      }
    }

    .relatedMv {
      margin-top: 20px;

      .title {
        font-size: 14px;
        font-weight: 1000;
        color: #4a4a4a;
      }

      .relatedMvList {
        width: 100%;
        height: 235px;
        margin-top: 20px;

        .frontCover {
          width: 100%;
          height: 180px;
          position: relative;
          border-radius: 3px;

          img {
            width: 100%;
            height: 100%;
            border-radius: 3px;
          }

          i {
            position: absolute;
            width: 32px;
            height: 32px;
            z-index: 10;
            left: 50%;
            top: 50%;
            margin-top: -16px;
            margin-left: -16px;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 22px;
            border-radius: 100%;
            background: #FA2800;
            cursor: pointer;
            display: none;
          }
        }

        .frontCover:hover i {
          display: flex;
        }

        .mvName {
          font-size: 14px;
          font-weight: 1000;
          margin-top: 10px;

          i {
            margin-right: 5px;
            color: #FA2800;
            font-weight: 100;
          }
        }

        .author {
          font-size: 12px;
          color: #a5a5c1;
          margin-top: 5px;
        }
      }
    }
  }
}
</style>
