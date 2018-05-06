<template>
  <div class="cart-control">
    <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart($event)" transition="move">
      <i class="inner icon-remove_circle_outline"></i>
    </div>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';

  export default {
    props: {
      // 父组件传过来的对象
      food: {
        type: Object
      }
    },
    methods: {
      addCart(event) {
        // 防止在pc上回触发两次点击事件
        if (!event._constructed) {
          return;
        }
        if (!this.food.count) {
          // 用Vue.set的方法来添加一个属性
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
        // 传一个派发事件
        this.$dispatch('cart.add', event.target);
      },
      decreaseCart(event) {
        // 防止在pc上回触发两次点击事件
        if (!event._constructed) {
          return;
        }
        if (this.food.count > 0) {
          this.food.count--;
        }
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .cart-control {
    font-size: 0;
    .cart-decrease {
      display: inline-block;
      padding: 6px;
      transition: all 0.4s linear;
      &.move-transition {
        opacity: 1;
        transform: translate3d(0, 0, 0);
        .inner {
          display: inline-block;
          font-size: 24px;
          line-height: 24px;
          color: rgb(0, 160, 220);
          transition: all 0.4s linear;
          transform: rotate(0deg);
        }
      }
      &.move-enter, &.move-leave {
        opacity: 0;
        transform: translate3d(24px, 0, 0);
        .inner {
          transform: rotate(180deg);
        }
      }
    }
    .cart-count {
      display: inline-block;
      vertical-align: top;
      width: 12px;
      padding-top: 6px;
      line-height: 24px;
      text-align: center;
      font-size: 10px;
      color: rgb(147, 153, 159);
    }
    .cart-add {
      display: inline-block;
      padding: 6px;
      font-size: 24px;
      line-height: 24px;
      color: rgb(0, 160, 220);
    }
  }
</style>
