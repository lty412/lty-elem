<template>
  <div class="V-header">
    <div class="content-wrapper">
      <div class="head-img">
        <img width="64" height="64" :src="seller.avatar">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="seller-detail">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <div v-if="seller.supports" class="support">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div class="support-count" v-if="seller.supports" @click="showHeadPop">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showHeadPop">
      <span class="bulletin-title"></span>
      <span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="head-bg">
      <img width="100%" height="100%" :src="seller.avatar">
    </div>
    <div class="head-pop" v-show="headPopShow" transition="fade">
      <div class="pop-wrapper cl">
        <div class="pop-main">
          <h1 class="s-name">{{seller.name}}</h1>
          <v-star :size="48" :score="seller.score"></v-star>
          <div class="s-title">
            <span class="line"></span>
            <span class="text">优惠信息</span>
            <span class="line"></span>
          </div>
          <ul class="s-supports" v-if="seller.supports">
            <li class="sup-li" v-for="item in seller.supports">
              <span class="icon" :class="classMap[seller.supports[$index].type]"></span>
              <span class="sup-text">{{seller.supports[$index].description}}</span>
            </li>
          </ul>
          <div class="s-title">
            <span class="line"></span>
            <span class="text">商家公告</span>
            <span class="line"></span>
          </div>
          <div class="s-bulletin">
            <p class="s-con">{{seller.bulletin}}</p>
          </div>
        </div>
      </div>
      <div class="pop-close" @click="hideHeadPop">
        <i class="icon-close"></i>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from 'components/star/star';

  export default{
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        headPopShow: false
      };
    },
    methods: {
      showHeadPop() {
        this.headPopShow = true;
      },
      hideHeadPop() {
        this.headPopShow = false;
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    components: {
      'v-star': star
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../../common/scss/mixin.scss";

  .V-header {
    position: relative;
    color: #fff;
    background: rgba(7, 17, 27, .5);
    overflow: hidden;
    .content-wrapper {
      position: relative;
      padding: 24px 12px 18px 24px;
      font-size: 0;
      .head-img {
        display: inline-block;
        vertical-align: top;
        img {
          border-radius: 2px;
        }
      }
      .content {
        display: inline-block;
        font-size: 14px;
        margin-left: 16px;
        .title {
          margin: 2px 0 8px;
          .brand {
            display: inline-block;
            width: 30px;
            height: 18px;
            vertical-align: top;
            @include bg-image('brand');
            background-size: 30px 18px;
            background-repeat: no-repeat;
            .name {
              margin-left: 6px;
              font-size: 16px;
              font-weight: bold;
              line-height: 18px;
            }
          }
        }
        .seller-detail {
          margin-bottom: 10px;
          line-height: 12px;
          font-size: 12px;
        }
        .support {
          font-size: 0;
          .icon {
            display: inline-block;
            width: 12px;
            height: 12px;
            vertical-align: top;
            margin-right: 4px;
            background-size: 12px 12px;
            background-repeat: no-repeat;
            &.decrease{
              @include bg-image('decrease_1');
            }
            &.discount{
              @include bg-image('discount_1');
            }
            &.guarantee{
              @include bg-image('guarantee_1');
            }
            &.invoice{
              @include bg-image('invoice_1');
            }
            &.special{
              @include bg-image('special_1');
            }
          }
          .text {
            line-height: 12px;
            font-size: 12px;
          }
        }
      }
      .support-count {
        position: absolute;
        right: 12px;
        bottom: 18px;
        padding: 0 8px;
        height: 24px;
        line-height: 24px;
        border-radius: 14px;
        background: rgba(0, 0, 0, 0.2);
        .count {
          vertical-align: top;
          font-size: 10px;
        }
        .icon-keyboard_arrow_right {
          line-height: 24px;
          margin-left: 2px;
          font-size: 10px;
        }
      }
    }
    .bulletin-wrapper {
      position: relative;
      height: 28px;
      line-height: 28px;
      padding: 0 22px 0 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      background-color: rgba(7, 17, 27, .2);
      .bulletin-title {
        width: 22px;
        height: 12px;
        display: inline-block;
        font-size: 0;
        @include bg-image('bulletin');
        background-size: 22px 12px;
        background-repeat: no-repeat;
      }
      .bulletin-text {
        vertical-align: top;
        margin: 0 4px 0 2px;
        font-size: 10px;
      }
      .icon-keyboard_arrow_right {
        position: absolute;
        font-size: 10px;
        right: 12px;
        top: 8px;
      }
    }
    .head-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      filter: blur(10px);
    }
    .head-pop {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 100;
      width: 100%;
      height: 100%;
      overflow: auto;
      transition: all .5s;
      backdrop-filter: blur(3px);
      &.fade-transition {
        opacity: 1;
        background: rgba(7, 17, 27, .8);
      }
      &.fade-enter, &.fade-leave {
        opacity: 0;
        background: rgba(7, 17, 27, 0);
      }
      .pop-wrapper {
        width: 100%;
        min-height: 100%;
        .pop-main {
          padding: 64px 0 94px;
          .s-name {
            font-size: 16px;
            line-height: 16px;
            text-align: center;
            font-weight: bold;
          }
          .s-star {
            margin-top: 18px;
            padding: 2px 0;
            text-align: center;
          }
          .s-title {
            display: flex;
            width: 80%;
            margin: 28px auto 24px;
            .line {
              flex: 1;
              position: relative;
              top: -6px;
              border-bottom: 1px solid rgba(255, 255, 255, .2);
            }
            .text {
              padding: 0 12px;
              font-size: 14px;
              font-weight: bold;
            }
          }
          .s-supports {
            width: 80%;
            margin: 0 auto;
            .sup-li {
              padding: 0 12px;
              margin-bottom: 12px;
              font-size: 0;
              &:last-child{
                margin-bottom: 0;
              }
              .icon {
                display: inline-block;
                width: 16px;
                height: 16px;
                vertical-align: top;
                margin-right: 6px;
                background-size: 16px 16px;
                background-repeat: no-repeat;
                &.decrease {
                  @include bg-image('decrease_2');
                }
                &.discount {
                  @include bg-image('discount_2');
                }
                &.guarantee {
                  @include bg-image('guarantee_2');
                }
                &.invoice {
                  @include bg-image('invoice_2');
                }
                &.special {
                  @include bg-image('special_2');
                }
              }
              .sup-text {
                font-size: 12px;
                line-height: 16px;
              }
            }
          }
          .s-bulletin {
            width: 80%;
            margin: 0 auto;
            .s-con {
              padding: 0 12px;
              font-size: 12px;
              line-height: 24px;
            }
          }
        }
      }
      .pop-close {
        position: relative;
        width: 32px;
        height: 32px;
        margin: -64px auto 0;
        clear: both;
        font-size: 32px;
      }
    }
  }
</style>
