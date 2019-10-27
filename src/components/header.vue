<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img :src='seller.avatar' width="64" height="64"/>
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}} / {{seller.deliveryTime}}分钟送达
        </div>
        <div v-if = 'seller.supports' class="supports">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div v-if = 'seller.supports' class="support-count" @click = 'showDetail'>
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper">
      <span class="bulletin-title"></span>
      <span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right" @click = 'showDetail'></i>
    </div>
    <div class="background">
      <img :src='seller.avatar' width="100%" height="100%"/>
    </div>
     <transition name="fade">
      <div v-show = 'detailShow' class="detail">
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <h1>{{seller.name}}</h1>
            <div class="star-wrapper">
              <star :size="48" :score="seller.score"></star>
            </div>
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul v-if='seller.supports' class="supports">
              <li class="support-item" v-for='(item, index) in seller.supports' :key="index">
                <span class="icon" :class="classMap[item.type]"></span>
                <span class="text">{{item.description}}</span>
              </li>
            </ul>
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin">
              <p>{{seller.bulletin}}</p>
            </div>
          </div>
        </div>
        <div class="detail-close" @click='hideDetail'>
          <i class="icon-close"></i>
        </div>
      </div>
     </transition>
  </div>
</template>

<script>
// @ is an alias to /src
import star from './star.vue'

export default {
  props: {
    store: Object
  },
  data () {
    return {
      detailShow: false,
      seller: []
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  methods: {
    showDetail: function () {
      this.detailShow = true
    },
    hideDetail: function () {
      this.detailShow = false
    }
  },
  watch: {
    store: {
      handler (newName, oldName) {
        this.seller = newName.seller
      }
    }
  },
  components: {
    star
  }
}
</script>

<style lang="stylus">
@import "../assets/index.styl"
.icon
  display inline-block
  vertical-align top
  width 12px
  height 12px
  margin-right 2px
  &.decrease
    bg-image('header/decrease_1', 12, 12)
  &.discount
    bg-image('header/discount_1', 12, 12)
  &.guarantee
    bg-image('header/guarantee_1', 12, 12)
  &.invoice
    bg-image('header/invoice_1', 12, 12)
  &.special
    bg-image('header/special_1', 12, 12)
.header
  position relative
  overflow hidden
  color #ffffff
  .content-wrapper
    position relative
    padding 24px 12px 18px 24px
    font-size 0
    .avatar
      display inline-block
      vertical-align top
      img
        border-radius 2px
    .content
      display inline-block
      margin-left 16px
      font-size 16px
      .title
        margin 2px 0 8px 0
        .brand
          display inline-block
          vertical-align top
          width 30px
          height 18px
          bg-image('header/brand', 30, 18)
        .name
          margin-left 6px
          font-size 16px
          font-weight bold
          line-height 18px
      .description
        margin-bottom 10px
        font-size 12px
        font-weight 200
        line-height 12px
      .supports
        .text
          vertical-align top
          font-size 10px
          font-weight 200
          line-height 12px
    .support-count
      position absolute
      right 12px
      bottom 14px
      padding 0 8px
      height 24px
      line-height 24px
      border-radius 14px
      background-color rgba(0,0,0,0.2)
      .count
        font-size 10px
      .icon-keyboard_arrow_right
        font-size 10px
        margin-left 2px
  .bulletin-wrapper
    position relative
    height 28px
    line-height 28px
    padding 0 22px 0 12px
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
    background-color rgba(7,17,27,0.2)
    .bulletin-title
      display inline-block
      width 22px
      height 14px
      vertical-align top
      margin-top 6px
      margin-right 4px
      bg-image('header/bulletin', 22, 14)
    .bulletin-text
      vertical-align top
      font-size 10px
      font-weight 200
      line-height 28px
    .icon-keyboard_arrow_right
      position absolute
      right 12px
      top 8px
      font-size 10px
  .background
    position absolute
    top 0
    left 0
    width 100%
    height 100%
    background-color rgba(7,17,27,0.5)
    filter blur(5px)
    z-index -1
  .detail
    position fixed
    top 0
    left 0
    z-index 6
    width 100%
    height 100%
    overflow auto
    background-color rgba(7,17,27,0.8)
    &.fade-enter-active, &.fade-leave-active
      transition opacity 0.5s
    &.fade-enter, &.fade-leave-active
      opacity 0
    .detail-wrapper
      width 100%
      min-height 100%
      .detail-main
        margin-top 64px
        padding-bottom 64px
        h1
          font-size 16px
          font-weight 700
          line-height 16px
          text-align center
        .star-wrapper
          margin-top 18px
          padding 2px 0
          text-align center
        .title
          display flex
          width 80%
          margin 28px auto 24px auto
          .line
            flex 1
            position relative
            top -6px
            border-bottom 1px solid rgba(255,255,255,0.2)
          .text
            padding 0 12px
            font-weight 700
            font-size 14px
        .supports
          width 80%
          margin 0 auto
          padding-left 0
          .support-item
            padding 0 12px
            margin-bottom 12px
            font-size 0
            &:last-child
              margin-bottom 0
            .icon
              width 16px
              height 16px
              background-size: 16px 16px;
            .text
              padding-left 6px
              font-size 12px
              line-height 16px
        .bulletin
          width 80%
          margin 0 auto
          p
            padding 0 12px
            font-size 12px
            line-height 24px
    .detail-close
      position relative
      width 32px
      height 32px
      font-size 32px
      color rgba(255,255,255,0.5)
      margin -64px auto 0 auto
      clear both
</style>
