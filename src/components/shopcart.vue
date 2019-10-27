<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highLight':totalCount > 0}">
              <i class="icon-shopping_cart" :class="{'highLight':totalCount > 0}"></i>
            </div>
            <div class="num" v-show='totalCount > 0'>{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highLight':totalPrice > 0}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" @click.stop.prevent="pay" :class="{'success':totalPrice >= minPrice}">
          <span class="minprice" :class="{'success':totalPrice >= minPrice}">{{payDesc}}</span>
        </div>
      </div>
      <!--<div class="ball-container">
        <div v-for="ball in balls" :key='ball.id'>
          <transition name="drop" v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter">
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>-->
      <transition name="fold">
        <div class="shopcart-list" v-show='listShow'>
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click='empty'>清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for='(food, index) in selectFoods' :key="index">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price * food.count}}</span>
                </div>
                <div class="cartcontroll-wrapper">
                  <cartControl :food='food'></cartControl>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" @click="hideList" v-show="listShow"></div>
    </transition>
  </div>
</template>

<script>
import cartControl from './cartcontrol'
import BScroll from 'better-scroll'

export default {
  components: {
    cartControl
  },
  props: {
    deliveryPrice: Number,
    minPrice: Number,
    selectFoods: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      balls: [
        {
          id: 1,
          show: false
        },
        {
          id: 2,
          show: false
        },
        {
          id: 3,
          show: false
        },
        {
          id: 4,
          show: false
        },
        {
          id: 5,
          show: false
        }
      ],
      dropBalls: [],
      listShow: false // 折叠
    }
  },
  methods: {
    drop (el) { // 拿到对象
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]
        if (!ball.show) {
          ball.show = true
          ball.el = el
          this.dropBalls.push(ball)
          return
        }
        ball.show = false
      }
    },
    toggleList () { // 点击折叠
      if (!this.totalCount) { // 无商品
        return
      }
      this.listShow = !this.listShow
    },
    empty () { // 清空
      this.selectFoods.forEach((food) => {
        food.count = 0
      })
      this.listShow = false
    },
    hideList () { // 隐藏
      this.listShow = false
    },
    pay () {
      if (this.totalPrice < this.minPrice) {
        return
      }
      window.alert(`支付${this.totalPrice}元`)
    },
    beforeEnter: function (el) {
      let count = this.balls.length
      while (count--) {
        let ball = this.balls[count]
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect()
          let x = rect.left - 32
          let y = -(window.innerHeight - rect.top - 22)
          el.style.display = ''
          el.style.webkitTransform = `translate3d(0, ${y}px, 0)`
          el.style.transform = `translate3d(0, ${y}px, 0)`
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`
          inner.style.transform = `translate3d(${x}px, 0, 0)`
        }
      }
    },
    enter: function (el, done) {
      /* eslint-disable no-unused-vars */
      let rf = el.offestHeight
      this.$nextTick(() => {
        el.style.webkitTransform = 'translate3d(0, 0, 0)'
        el.style.transform = 'translate3d(0, 0, 0)'
        let inner = el.getElementsByClassName('inner-hook')[0]
        inner.style.webkitTransform = 'translate3d(0, 0, 0)'
        inner.style.transform = 'translate3d(0, 0, 0)'
        el.addEventListener('transitionend', done)
      })
    },
    afterEnter: function (el) {
      let ball = this.dropBalls.shift()
      if (ball) {
        ball.show = false
        el.style.display = 'none'
      }
    }
  },
  computed: {
    totalPrice () {
      let price = 0
      this.selectFoods.forEach((food) => {
        price += food.price * food.count
      })
      return price
    },
    totalCount () {
      let count = 0
      this.selectFoods.forEach((food) => {
        count += food.count
      })
      return count
    },
    payDesc () {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}起送`
      } else if (this.totalPrice < this.minPrice) {
        return `还差￥${this.minPrice - this.totalPrice}起送`
      } else {
        return '去结算'
      }
    }
  },
  watch: {
    totalCount: function () {
      if (!this.totalCount) {
        this.listShow = false
        return false
      }
    },
    listShow: function (totalCount) {
      let show = this.listShow
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.listContent, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      }
      return !show
    },
    selectFoods: {
      handler (newVal, oldVal) {
        this.selectFoods = newVal
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "../assets/index.styl"
.shopcart
  position fixed
  bottom 0
  left 0
  z-index 5
  width 100%
  height 48px
  .content
    display flex
    height 100%
    background #141d27
    font-size 0
    .content-left
      flex 1
      .logo-wrapper
        display inline-block
        position relative
        top -10px
        width 56px
        height 56px
        margin 0 12px
        padding 6px
        box-sizing border-box
        vertical-align top
        border-radius 50%
        background #141d27
        .logo
          width 100%
          height 100%
          text-align center
          border-radius 50%
          background #2b343c
          &.highLight
            background rgb(0, 160, 220)
          i
            line-height 44px
            font-size 24px
            color #80858a
            &.highLight
              color #ffffff
        .num
          position absolute
          top 0
          right 0
          width 24px
          height 16px
          line-height 16px
          text-align center
          font-size 9px
          font-weight 700
          color #ffffff
          background rgb(240, 20, 20)
          box-shadow 0 4px 8 0 rgba(0, 0, 0, 0.4)
          border-radius 16px
      .price
        display inline-block
        line-height 24px
        margin-top 12px
        padding-right 12px
        font-size 16px
        font-weight 700
        box-sizing border-box
        color rgba(255, 255, 255, 0.4)
        border-right 1px solid rgba(255, 255, 255, 0.1)
        &.highLight
          color #ffffff
      .desc
        display inline-block
        line-height 24px
        margin-left 12px
        font-size 10px
        color rgba(255, 255, 255, 0.4)
    .content-right
      flex 0 0 105px
      width 105px
      text-align center
      background #2b333b
      &.success
        background #00b43c
      .minprice
        height 48px
        line-height 48px
        font-size 14px
        color rgba(255, 255, 255, 0.4)
        &.success
          color #ffffff
  .ball-container
    .ball
      position fixed
      left 32px
      bottom 22px
      z-index 200
      transition all 0.6s cubic-bezier(0.49, -0.29, 0.75, 0.41)
      .inner
        width 16px
        height 16px
        border-radius 50%
        background rgb(0, 160, 220)
        transition all 0.6s linear
  .shopcart-list
    position absolute
    left 0
    bottom 48px
    z-index -1
    width 100%
    &.fold-enter-active, &.fold-leave-active
      transition all 0.4s linear
      transform translate3d(0, 0, 0)
    &.fold-enter, &.fold-leave-to
      transform translate3d(0, 100%, 0)
    .list-header
      height 40px
      line-height 40px
      padding 0 18px
      background #f3f5f7
      border-bottom 1px solid rgba(7, 17, 27, 0.1)
      .title
        // display inline-block
        float left
        font-size 14px
        color rgb(7, 17, 27)
        line-height 40px
      .empty
        float right
        font-size 14px
        color rgb(0, 160, 220)
        line-height 40px
    .list-content
      padding 0 18px
      max-height 217px
      background #ffffff
      overflow hidden
      .food
        position relative
        // height 48px
        padding 12px 0
        box-sizing border-box
        border-1px(rgba(7, 17, 27, 0.1))
        > div
          display inline-block
        .name
          font-size 14px
          line-height 24px
          color rgb(7, 17, 27)
        .price
          position absolute
          right 90px
          bottom 12px
          line-height 24px
          font-size 14px
          font-weight 700
          color rgb(240, 20, 20)
        .cartcontroll-wrapper
          position absolute
          right 0
          bottom 6px
.list-mask
  position fixed
  top 0
  left 0
  width 100%
  height 100%
  z-index 4
  opacity 1
  backdrop-filter blur(10px)
  background rgba(7, 17, 27, 0.6)
  &.fade-enter-active, &.fade-leave-active
    transition all 0.4s linear
  &.fade-enter, &.fade-leave-to
    opacity 0
    background rgba(7, 17, 27, 0)
</style>
