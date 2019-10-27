<template>
  <div>
    <div class="store">
      <div class="menu-wrapper" ref='menuWrapper'>
        <ul class="menu-items">
          <li class="menu-item" :class="{'current':currentIndex === index}" @click="selectMenu(index,$event)" v-for="(item, index) in goods" :key="index">
            <span class="text">
              <span v-show="item.type > 0" class="icon" :class="classMap[item.type]"></span>
              {{item.name}}
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref='foodsWrapper'>
        <ul>
          <li v-for="(item, index) in goods" :key="index" class="food-list food-list-hook">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li v-for="(food, index) in item.foods" :key="index" class="food-item">
                <div class="food-icon" @click="toDetail(food, $event)">
                  <img :src='food.icon' width="57" height="57"/>
                </div>
                <div class="content">
                  <h2 class="name" @click="toDetail(food, $event)">{{food.name}}</h2>
                  <p v-if="food.description" class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span>月售{{food.sellCount}}份</span>
                    <span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span>￥{{food.price}}</span>
                    <span class="old-price" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartControl @cartAdd='handlecartAdd' :food='food'></cartControl>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <shopcart ref='shopcart' :selectFoods='selectFoods' :deliveryPrice='seller.deliveryPrice' :minPrice='seller.minPrice'></shopcart>
    </div>
    <goodsDetail :food="selectedFood" ref="goodsDetail"></goodsDetail>
  </div>
</template>

<script>
// @ is an alias to /src
import BScroll from 'better-scroll'
import shopcart from './shopcart'
import cartControl from './cartcontrol'
import goodsDetail from './goodsdetail'
const ERR_OK = 'OK'
export default {
  components: {
    shopcart,
    cartControl,
    goodsDetail
  },
  props: {
    store: Object
  },
  data () {
    return {
      seller: [],
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    }
  },
  computed: {
    currentIndex () {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i
        }
      }
      return 0
    },
    selectFoods () {
      let foods = []
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    this.$ajax.get('http://localhost:8080/data.json').then(result => {
      if (result.statusText === ERR_OK) {
        this.goods = result.data.goods
      }
    })
  },
  mounted () {
    this._initScroll()
  },
  methods: {
    _initScroll () {
      let menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      })
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true,
        probeType: 3
      })
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
      this.foodsScroll.once('scroll', (pos) => {
        this._calculateHeight()
        // this.menuLength()
      })
      menuScroll.on('scroll')
    },
    _calculateHeight () {
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    selectMenu (index, event) {
      if (!event._constructed) {
        return
      }
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let el = foodList[index]
      this.foodsScroll.scrollToElement(el, 300)
    },
    _cartAdd (target) {
      this.$nextTick(() => { // 使用$nextTick优化体验
        this.$refs.shopcart.drop(target)
      })
    },
    handlecartAdd (target) {
      this._cartAdd(target)
    },
    toDetail (food, event) {
      if (!event._constructed) {
        return
      }
      this.selectedFood = food
      this.$refs.goodsDetail.show()
    }
  },
  watch: {
    store: {
      handler (newName, oldName) {
        this.goods = newName.goods
        this.seller = newName.seller
      }
    }
  }
}
</script>

<style lang="stylus">
@import "../assets/index.styl"
.store
  display flex
  position absolute
  top 175px
  bottom 46px
  width 100%
  overflow hidden
  .menu-wrapper
    flex 0 0 80px
    width 80px
    background-color #f3f5f7
    .menu-items
      .menu-item
        display table
        width 56px
        height 54px
        padding 0 12px
        line-height 14px
        text-align center
        &.current
          position: relative
          margin-top: -1px
          background: #fff
          font-weight: 700
          .text
              border-none()
        .icon
          &.decrease
            bg-image('header/decrease_3', 12, 12)
          &.discount
            bg-image('header/discount_3', 12, 12)
          &.guarantee
            bg-image('header/guarantee_3', 12, 12)
          &.invoice
            bg-image('header/invoice_3', 12, 12)
          &.special
            bg-image('header/special_3', 12, 12)
        .text
          display table-cell
          width 56px
          font-size 12px
          vertical-align middle
          border-1px(rgba(7,17,27,0.1))
  .foods-wrapper
    flex 1
    .food-list
      .title
        height 26px
        line-height 26px
        padding-left 14px
        font-size 12px
        color rgb(147,153,159)
        border-left 2px solid #d9dde1
        background-color #f3f5f7
      .food-item
        display flex
        margin 18px
        padding-bottom 18px
        border-1px(rgba(7,17,27,0.1))
        &:last-child
          border-none()
        .food-icon
          flex 0 0 57px
          margin-right 10px
        .content
          flex 1
          font-size 10px
          line-height 13px
          color rgb(147,153,159)
          .name
            margin 2px 0 8px 0
            height 14px
            font-size 14px
            line-height 14px
            color rgb(7,17,27)
          .extra
            margin-top 8px
            span
              display inline-block
              margin-right 12px
              &.last-child
                margin-right 0
          .price
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
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 12px
</style>
