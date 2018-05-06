<template>
  <div v-show="showFlag" class="food" transition="move" v-el:food>
    <div class="food-content">
      <div class="img-header">
        <img :src="food.image">
        <div class="back" @click="hide">
          <i class="icon-arrow_lift"></i>
        </div>
      </div>
      <div class="content">
        <h1 class="title">{{food.name}}</h1>
        <div class="detail">
          <span class="sell-count">月售{{food.sellCount}}份</span>
          <span class="rating">好评率{{food.rating}}%</span>
        </div>
        <div class="price">
          <span class="now-price">¥{{food.price}}</span>
          <del class="old-price" v-show="food.oldPrice">¥{{food.oldPrice}}</del>
        </div>
        <div class="add-cart" v-show="!food.count || food.count === 0" @click="addFirst" transition="fade">加入购物车</div>
        <div class="cartcontrol-wrapper" v-show="food.count > 0">
          <v-cartcontrol :food="food"></v-cartcontrol>
        </div>
      </div>

      <v-split v-show="food.info"></v-split>
      <div class="food-info" v-show="food.info">
        <h1 class="title">商品信息</h1>
        <p class="text">{{food.info}}</p>
      </div>

      <v-split></v-split>
      <div class="rating">
        <h1 class="title">商品评价</h1>
        <v-ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></v-ratingselect>
        <div class="rating-wrapper">
          <ul v-show="food.ratings && food.ratings.length">
            <li class="rating-item border-1px" v-for="rating in food.ratings" v-show="needShow(rating.rateType,rating.text)">
              <div class="rat-top">
                <span class="time fl">{{rating.rateTime | formatDate}}</span>
                <span class="user fr">
                  {{rating.username}}
                  <img class="avatar" :src="rating.avatar" alt="">
                </span>
              </div>
              <div class="rat-text">
                <span :class="{'icon-thumb_up':rating.rateType === 0,'icon-thumb_down':rating.rateType === 1}"></span>
                <span class="text">{{rating.text}}</span>
              </div>
            </li>
          </ul>
          <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import BScroll from 'better-scroll';
  import {formatDate} from 'common/js/date';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import split from 'components/split/split';
  import ratingselect from 'components/ratingselect/ratingselect';

  const ALL = 2;

  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,
        // 对评论组件的变量跟踪
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      };
    },
    methods: {
      show() {
        this.showFlag = true;
        // 初始化数据(默认显示全部，和只看内容的评价)
        this.selectType = ALL;
        this.onlyContent = true;
        // 页面滚动
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$els.food, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      hide() {
        this.showFlag = false;
      },
      addFirst(event) {
        if (!event._constructed) {
          return;
        }
        // 用Vue.set向food添加参数
        if (this.food.count === undefined) {
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count = 1;
        }
        // 做一个抛物线小球动画(传一个派发事件)
        this.$dispatch('cart.add', event.target);
      },
      needShow(type, text) {
        // 改变显示的内容时需要更新scroll滚动
        this.$nextTick(() => {
          this.scroll.refresh();
        });
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return this.selectType === type;
        }
      }
    },
    events: {
      // 把子组件传过来的值type赋值给父组件
      'ratingtype.select'(type) {
        this.selectType = type;
      },
      'content.toggle'(onlyContent) {
        this.onlyContent = onlyContent;
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      'v-cartcontrol': cartcontrol,
      'v-split': split,
      'v-ratingselect': ratingselect
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../../common/scss/mixin.scss";

  .food {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 48px;
    z-index: 30;
    width: 100%;
    background: #fff;
    &.move-transition {
      transition: all 0.2s linear;
      transform: translate3d(0, 0, 0);
    }
    &.move-enter, &.move-leave {
      transform: translate3d(100%, 0, 0);
    }
    .img-header {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 100%;
      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      .back {
        position: absolute;
        top: 10px;
        left: 0;
        .icon-arrow_lift {
          display: block;
          padding: 10px;
          font-size: 20px;
          color: #fff;
        }
      }
    }
    .content {
      position: relative;
      padding: 18px;
      .title {
        font-size: 14px;
        font-weight: bold;
        line-height: 14px;
        margin-bottom: 8px;
        color: rgb(7, 17, 27);
      }
      .detail {
        margin-bottom: 18px;
        height: 10px;
        line-height: 10px;
        font-size: 0;
        .sell-count, .rating {
          font-size: 10px;
          color: rgb(147, 153, 159);
          margin-right: 12px;
        }
      }
      .price {
        line-height: 24px;
        font-weight: bold;
        .now-price {
          font-size: 14px;
          color: rgb(240, 20, 20);
          margin-right: 5px;
        }
        .old-price {
          font-size: 10px;
          color: rgb(147, 153, 159);
        }
      }
      .cartcontrol-wrapper {
        position: absolute;
        bottom: 12px;
        right: 12px;
      }
      .add-cart {
        position: absolute;
        bottom: 18px;
        right: 18px;
        width: 74px;
        height: 24px;
        font-size: 10px;
        color: #fff;
        text-align: center;
        line-height: 24px;
        border-radius: 12px;
        background: rgb(0, 160, 220);
        &.fade-transition {
          opacity: 1;
          transition: all 0.2s;
        }
        &.fade-enter, &.fade-leave {
          opacity: 0;
        }
      }
    }
    .food-info {
      padding: 18px;
      .title {
        line-height: 14px;
        margin-bottom: 16px;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }
      .text {
        padding: 0 8px;
        line-height: 24px;
        font-size: 12px;
        color: rgb(77, 85, 93);
      }
    }
    .rating {
      padding-top: 18px;
      .title {
        font-size: 14px;
        font-weight: bold;
        line-height: 14px;
        margin: 0 8px;
        color: rgb(7, 17, 27);
      }
      .rating-wrapper {
        margin: 0 18px;
        .rating-item {
          padding: 16px 0;
          box-sizing: border-box;
          @include border-1px(rgba(7, 17, 27, 0.1));
          .rat-top {
            overflow: hidden;
            font-size: 10px;
            line-height: 12px;
            margin-bottom: 6px;
            color: rgb(147, 153, 159);
            .user {
              .avatar {
                width: 12px;
                height: 12px;
                margin-left: 6px;
                border-radius: 50%;
              }
            }
          }
          .rat-text {
            font-size: 12px;
            .text {
              color: rgb(7, 17, 27);
            }
            .icon-thumb_up {
              color: rgb(0, 160, 220);
            }
            .icon-thumb_down {
              color: rgb(147, 153, 159);
            }
          }
        }
        .no-rating {
          padding: 16px 0;
          font-size: 12px;
          color: rgb(147, 153, 159);
        }
      }
    }
  }
</style>
