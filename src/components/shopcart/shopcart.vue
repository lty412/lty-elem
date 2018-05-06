<template>
  <div class="shop-cart">
    <!--底部购物车栏-->
    <div class="content-line" @click="toggleList">
      <div class="left-line">
        <div class="logo-wrapper">
          <div class="logo" :class="{'heightlight':totalCount>0}">
            <i class="icon-shopping_cart" :class="{'heightlight':totalCount>0}"></i>
          </div>
          <div class="num" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'heightlight':totalPrice>0}">¥{{totalPrice}}</div>
        <div class="desc">另需配送费¥{{deliveryPrice}}元</div>
      </div>
      <div class="right-line" @click.stop.prevent="toPay">
        <div class="pay" :class="payClass">{{payDesc}}</div>
      </div>
    </div>
    <!--小球-->
    <div class="balls-container">
      <div v-for="ball in balls" v-show="ball.show" class="ball" transition="drop">
        <div class="inner inner-hook"></div>
      </div>
    </div>
    <!--底部购物车列表-->
    <div class="shopcart-list" v-show="listShow" transition="fold">
      <div class="list-header">
        <h1 class="cart-tit">购物车</h1>
        <span class="empty-cart" @click="emptyCart">清空</span>
      </div>
      <div class="list-content" v-el:list-content>
        <ul>
          <li class="food border-1px" v-for="food in selectFoods">
            <span class="name">{{food.name}}</span>
            <span class="price">¥{{food.price*food.count}}</span>
            <div class="cartcontrol-wrapper">
              <v-cartcontrol :food="food"></v-cartcontrol>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div class="list-mask" v-show="listShow" @click="hideList" transition="fade"></div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import cartcontrol from 'components/cartcontrol/cartcontrol';

  export default {
    props: {
      // 所选择的商品
      selectFoods: {
        type: Array,
        default() {
          return [];
        }
      },
      // 商品总额
      deliveryPrice: {
        type: Number,
        default: 0
      },
      // 起送价
      minPrice: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        // 小球
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [],
        fold: true
      };
    },
    computed: {
      // 获取总额
      totalPrice() {
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      // 获取总数
      totalCount() {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      // 控制结算区块文案
      payDesc() {
        if (this.totalPrice === 0) {
          return `¥${this.minPrice}元起送`;
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `还差¥${diff}元起送`;
        } else {
          return '去结算';
        }
      },
      // 控制结算区块样式
      payClass() {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough';
        } else {
          return 'enough';
        }
      },
      listShow() {
        if (!this.totalCount) {
          this.fold = true;
          return false;
        }
        let show = !this.fold;
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$els.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
        return show;
      }
    },
    methods: {
      // 拿到小球dom
      drop(el) {
        for (let _i in this.balls) {
          let ball = this.balls[_i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      toggleList() {
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      },
      emptyCart() {
        this.selectFoods.forEach((food) => {
          food.count = 0;
        });
      },
      hideList() {
        this.fold = true;
      },
      toPay() {
        if (this.totalPrice < this.minPrice) {
          return;
        }
        window.alert(`支付${this.totalPrice}元`);
      }
    },
    transitions: {
      // 小球动画实现
      drop: {
        beforeEnter(el) {
          let count = this.balls.length;
          while (count--) {
            let ball = this.balls[count];
            if (ball.show) {
              // 获取小球的位置
              let rect = ball.el.getBoundingClientRect();
              // 小球x轴偏移值
              let x = rect.left - 32;
              // 小球y轴偏移值
              let y = -(window.innerHeight - rect.top - 22);
              el.style.display = '';
              el.style.webkitTransform = `translate3d(0,${y}px,0)`;
              el.style.transform = `translate3d(0,${y}px,0)`;
              // 拿到第一个小球元素
              let inner = el.getElementsByClassName('inner-hook')[0];
              inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
              inner.style.transform = `translate3d(${x}px,0,0)`;
            }
          }
        },
        enter(el) {
          /* eslint-disable no-unused-vars */
          let rf = el.offsetHeight;
          this.$nextTick(() => {
            el.style.webkitTransform = 'translate3d(0,0,0)';
            el.style.transform = 'translate3d(0,0,0)';
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = 'translate3d(0,0,0)';
            inner.style.transform = 'translate3d(0,0,0)';
          });
        },
        afterEnter(el) {
          let ball = this.dropBalls.shift();
          if (ball) {
            ball.show = false;
            el.style.display = 'none';
          }
        }
      }
    },
    components: {
      'v-cartcontrol': cartcontrol
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../../common/scss/mixin.scss";

  .shop-cart {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 50;
    width: 100%;
    height: 48px;
    .content-line {
      display: flex;
      background: #141d27;
      font-size: 0;
      color: rgba(255, 255, 255, .4);
      .left-line {
        flex: 1;
        .logo-wrapper {
          display: inline-block;
          position: relative;
          top: -10px;
          z-index: 201;
          margin: 0 12px;
          padding: 6px;
          width: 56px;
          height: 56px;
          box-sizing: border-box;
          vertical-align: top;
          border-radius: 50%;
          background: #141d27;
          .logo {
            width: 100%;
            height: 100%;
            background: #2b343c;
            border-radius: 50%;
            text-align: center;
            &.heightlight {
              background: rgb(0, 160, 220);
            }
            .icon-shopping_cart {
              font-size: 24px;
              line-height: 44px;
              color: #80858a;
              &.heightlight {
                color: #fff;
              }
            }
          }
          .num {
            position: absolute;
            top: 0;
            right: 0;
            width: 24px;
            height: 16px;
            line-height: 16px;
            text-align: center;
            border-radius: 16px;
            font-size: 9px;
            font-weight: bold;
            color: #fff;
            background: rgb(240, 20, 20);
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, .4);
          }
        }
        .price {
          display: inline-block;
          vertical-align: top;
          margin-top: 12px;
          line-height: 24px;
          box-sizing: border-box;
          padding-right: 12px;
          border-right: 1px solid rgba(255, 255, 255, .1);
          font-size: 16px;
          font-weight: bold;
          &.heightlight {
            color: #fff;
          }
        }
        .desc {
          display: inline-block;
          vertical-align: top;
          line-height: 24px;
          margin: 12px 0 0 12px;
          font-size: 10px;
        }
      }
      .right-line {
        flex: 0 0 105px;
        width: 105px;
        .pay {
          height: 48px;
          line-height: 48px;
          text-align: center;
          font-size: 12px;
          font-weight: bold;
          background: #2b333b;
          &.not-enough {
            background: #2b333b;
          }
          &.enough {
            background: #00b43c;
            color: #fff;
          }
        }
      }
    }
    .balls-container {
      .ball {
        position: fixed;
        left: 32px;
        bottom: 22px;
        z-index: 200;
        &.drop-transition {
          transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
          .inner {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: rgb(0, 160, 220);
            transition: all 0.4s linear;
          }
        }
      }
    }
    .shopcart-list {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      &.fold-transition {
        transition: all 0.5s;
        transform: translate3d(0, -100%, 0);
      }
      &.fold-enter, &.fold-leave {
        transform: translate3d(0, 0, 0);
      }
      .list-header {
        height: 40px;
        line-height: 40px;
        padding: 0 18px;
        background: #f3f5f7;
        border-bottom: rgba(7, 17, 27, 0.1);
        .cart-tit {
          float: left;
          color: rgb(7, 17, 27);
          font-size: 14px;
        }
        .empty-cart {
          float: right;
          font-size: 12px;
          color: rgb(0, 160, 220);
        }
      }
      .list-content {
        padding: 0 18px;
        max-height: 217px;
        background: #fff;
        overflow: hidden;
        .food {
          position: relative;
          padding: 12px 0;
          box-sizing: border-box;
          @include border-1px(rgba(7, 17, 27, 0.1));
          .name {
            font-size: 14px;
            line-height: 24px;
            color: rgb(7, 17, 27);
          }
          .price {
            position: absolute;
            right: 90px;
            bottom: 12px;
            font-size: 14px;
            font-weight: bold;
            line-height: 24px;
            color: rgb(240, 20, 20);
          }
          .cartcontrol-wrapper {
            position: absolute;
            right: 0;
            bottom: 6px;
          }
        }
      }
    }
    .list-mask {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 40;
      backdrop-fliter: blur(10px);
      &.fade-transition {
        transition: all 0.5s;
        opacity: 1;
        background: rgba(7, 17, 27, 0.6);
      }
      &.fade-enter, &.fade-leave {
        opacity: 0;
        background: rgba(7, 17, 27, 0);
      }
    }
  }
</style>
