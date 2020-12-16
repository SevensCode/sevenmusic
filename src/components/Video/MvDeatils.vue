<template>
  <div v-if="isShow" class="container layout">
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
      <comment :comment-list="commentList" :get-comment-list="getMvComment" :type="1"></comment>
      <pager v-if="commentList.total>commentQuery.limit" :handle-current-change="handleCurrentChange"
             :limit="commentQuery.limit" :total="commentList.total"></pager>
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
            <img :onerror="defaultImg" :key="item.id" v-lazy="item.cover" alt="">
            <i class="el-icon-caret-right"></i>
          </section>
          <h1 class="mvName"><i class="iconfont icon-MV"></i>{{ item.name }}</h1>
          <p class="author">By.{{ item.artistName }}</p>
        </section>
      </el-card>
    </div>
  </div>
  <Loading v-else height="650px"></Loading>
</template>

<script>
import { getMvComments, getMvData, getMvInfo, getMvUrl, getSimilarMv } from '@/API/server/api'
import Comment from '@/components/common/comment'
import Loading from '@/components/common/Loading'
import Pager from '@/components/common/pager'

export default {
  components: {
    Pager,
    Loading,
    Comment
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
      // 相识 Mv 列表
      similarMvList: [],
      commentQuery: {
        id: this.$route.query.id,
        limit: 20,
        offset: 0,
        before: 0
      },
      // mv评论列表
      commentList: {},
      isShow: false
    }
  },
  async mounted () {
    await this.getMvDatas()
    await this.getMvComment()
    await this.getSimilarMv()
    this.isShow = true
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
      // 获取 mv 评论
      const { data: mvComment } = await getMvComments(this.commentQuery)
      this.commentList = mvComment
    },
    async getSimilarMv () {
      const { data: similarMv } = await getSimilarMv(this.id)
      this.similarMvList = similarMv.mvs
    },
    handleCurrentChange (newPage) {
      this.commentQuery.offset = (newPage - 1) * this.commentQuery.limit
      this.getMvComment()
    }
  },
  computed: {
    defaultImg () {
      return 'this.src="' + require('../../assets/img/tpwzd.jpg') + '"'
    }
  }
}
</script>

<style lang="less" scoped>
.layout {
  display: grid;
  grid-template-columns: 1000px 350px;
  justify-content: space-between;
  align-items: flex-start;
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
        justify-content: flex-start;
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
        justify-content: flex-start;
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
        justify-content: flex-start;
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
        align-items: flex-start;
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
        align-items: center;
        span {
          margin-right: 20px;
        }
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
