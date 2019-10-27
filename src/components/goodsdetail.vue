<template>
  <transition name="move">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-box">
        <div class="image-header">
          <img :src="food.image" />
          <div class="back" @click="hide">
            <i class="icon-keyboard_arrow_left"></i>
          </div>
        </div>
        <div class="food-content">
          <h1 class="name">{{food.name}}</h1>
          <div class="extra">
            <span>月售{{food.sellCount}}份</span>
            <span>好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span>￥{{food.price}}</span>
            <span class="old-price" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <transition name="fade">
            <div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count===0">
            加入购物车
            </div>
          </transition>
        </div>
        <split></split>
        <div class="food-intro" v-if="food.info">
          <h1 class="name">商品介绍</h1>
          <p class="desc">{{food.info}}</p>
        </div>
        <split></split>
        <div class="food-rating" v-if="food.ratings && food.ratings.length">
          <h1 class="name">商品评价</h1>
          <ratingselect @select='select' @toggle='toggle' :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
        </div>
        <div class="rating-content">
          <ul v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType,rating.text)" v-for="(rating, index) in food.ratings" :key="index" class="rating-item">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar" />
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
                  {{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Vue from 'vue'
import split from './split'
import BScroll from 'better-scroll'
import ratingselect from './ratingSelect'
import { formatDate } from '../assets/data'
// eslint-disable-next-line
const POSITIVE = 0
// eslint-disable-next-line
const NEGATIVE = 1
const ALL = 2
export default {
  props: {
    food: {
      type: Object
    }
  },
  data () {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: false,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      },
      selectRating: [],
      selectDivShow: false, // 存放筛选结果的div
      flag: false // 默认不显示返回按钮
    }
  },
  components: {
    ratingselect,
    split
  },
  created () {
    this.flag = this.$route.path !== '/home'
  },
  filters: {
    formatDate (time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  methods: {
    show () {
      this.showFlag = true
      this.selectType = ALL
      this.onlyContent = true
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    hide () {
      this.showFlag = false
    },
    addFirst (event) {
      if (!event._constructed) {
        return
      }
      this.$emit('add', event.target)
      Vue.set(this.food, 'count', 1)
    },
    addcart () {
      let notIn = true
      if (this.selectFoods.length > 0) {
        this.selectFoods.forEach((foods) => {
          if (foods.name === this.food.name) {
            foods.count++
            notIn = false
          }
        })
        if (notIn) {
          this.food.count = 1
          this.selectFoods.push(this.food)
        }
      } else {
        this.food.count = 1
        this.selectFoods.push(this.food)
      }
    },
    needShow (type, text) {
      if (this.onlyContent && !text) {
        return false
      }
      if (this.selectType === ALL) {
        return true
      } else {
        return type === this.selectType
      }
    },
    select (type) {
      this.selectType = type
    },
    toggle (onlyContent) {
      this.onlyContent = onlyContent
    }
  },
  watch: {
    // 当页面刷新的时候，不会触发 watch 中监听的 路由地址的变化 如果是首页 不显示
    '$route.path': function (newVal, oldVal) {
      if (newVal === '/home') {
        this.flag = false
      } else {
        this.flag = true
      }
    },
    food: {
      handler (newVal, oldVal) {
        this.selectRating = newVal.ratings
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../assets/index.styl"
.food
  position: fixed
  left: 0
  top: 0
  bottom: 48px
  z-index: 4
  width: 100%
  font-size 0
  background #ffffff
  transform: translate3d(0, 0, 0)
  &.move-enter-active, &.move-leave-active
    transition: all 0.2s linear
  &.move-enter, &.move-leave-active
    transform: translate3d(100%, 0, 0)
  .food-box
    .name
      height 14px
      font-size 14px
      font-weight 700
      line-height 14px
      color rgb(7,17,27)
    .image-header
      img
        width: 100%
        height: 100%
      .back
        position: absolute
        top: 0
        left: 0
        padding 10px
        >i
          width 20px
          height 20px
          font-size 18px
          color #ffffff
    .food-content
      position relative
      padding 18px
      font-size 10px
      line-height 13px
      color rgb(147,153,159)
      .extra
        margin-top 8px
        span
          display inline-block
          margin-right 12px
          &.last-child
            margin-right 0
      .price
        margin-top 18px
        line-height 24px
        font-weight 700
        span
          font-size 14px
          color rgb(240,20,20)
        .old-price
          padding-left 8px
          font-size 10px
          text-decoration line-through
          color rgb(147,153,159)
      .buy
        position: absolute
        right: 18px
        bottom: 18px
        z-index: 10
        height: 24px
        line-height: 24px
        padding: 0 12px
        box-sizing: border-box
        border-radius: 12px
        font-size: 10px
        color: #fff
        background: rgb(0, 160, 220)
        opacity: 1
        &.fade-enter-active, &.fade-leave-active
          transition: all 0.2s
        &.fade-enter, &.fade-leave-active
          opacity: 0
          z-index: -1
    .food-intro
      padding 18px
      .desc
        padding 6px 8px
        font-size 12px
        font-weight 200
        line-height 24px
        color rgb(77, 85, 93)
    .food-rating
      padding 18px
      padding-bottom 0
      border-1px(rgba(7, 17, 27, 0.1))
    .rating-content
      padding: 0 18px
      .rating-item
        position: relative
        padding: 16px 0
        border-1px(rgba(7, 17, 27, 0.1))
        .user
          position: absolute
          right: 0
          top: 16px
          line-height: 12px
          font-size: 0
          .name
            display: inline-block
            margin-right: 6px
            vertical-align: top
            font-size: 10px
            color: rgb(147, 153, 159)
          .avatar
            border-radius: 50%
        .time
          margin-bottom: 6px
          line-height: 12px
          font-size: 10px
          color: rgb(147, 153, 159)
        .text
          line-height: 16px
          font-size: 12px
          color: rgb(7, 17, 27)
          .icon-thumb_up, .icon-thumb_down
            margin-right: 4px
            line-height: 16px
            font-size: 12px
          .icon-thumb_up
            color: rgb(0, 160, 220)
          .icon-thumb_down
            color: rgb(147, 153, 159)
      .no-rating
        padding: 16px 0
        font-size: 12px
        color: rgb(147, 153, 159)
</style>
