<template>
  <div class="cartcontrol">
    <transition name='move'>
      <div class="cart_decrease" v-show='food.count > 0' @click='decreaseCart'>
        <i class="icon-remove_circle_outline"></i>
      </div>
    </transition>
    <div class="cart_count" v-show='food.count > 0'>{{food.count}}</div>
    <!--<div class="cart_add" @click='addCart'>-->
    <div class="cart_add" @click.stop.prevent="addCart($event)">
      <i class="icon-add_circle"></i>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    addCart (event) {
      if (!event._constructed) {
        return
      }
      if (!this.food.count) {
        Vue.set(this.food, 'count', 1)
      } else {
        this.food.count++
      }
      this.$emit('cartAdd', event.target)
    },
    decreaseCart (event) {
      if (!event._constructed) {
        return
      }
      if (this.food.count) {
        this.food.count--
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
font(size, fontColor,lineHeight){
  line-height lineHeight
  font-size size
  color fontColor
}
.cartcontrol
  font-size 0
  .cart_decrease
    display inline-block
    padding 6px
    opacity 1
    i
      display inline-block
      font(24px, rgb(0, 160, 220), 24px)
    &.move-enter-active, &.move-leave-active
      transition all 0.4s linear
      transform translate3d(0, 0, 0)
      i
        transition all 0.4s linear
        transform rotate(0)
    &.move-enter, &.move-leave-to
      opacity 0
      transform translate3d(24px, 0, 0)
      i
        transform rotate(180deg)
  .cart_count
    display inline-block
    vertical-align top
    width 12px
    padding-top 6px
    text-align center
    font(10px, rgb(147, 153, 159), 24px)
  .cart_add
    display inline-block
    height 26px
    padding 6px
    font(24px, #00A0DC, 24px)
</style>
