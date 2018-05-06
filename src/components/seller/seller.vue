<template>
  <div class="seller" v-el:seller>
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc border-1px">
          <v-star :size="36" :score="seller.score"></v-star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <p>起送价</p>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <p>商家配送</p>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <p>平均配送时间</p>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite">
          <span class="icon-favorite" :class="{'active':favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <v-split></v-split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <p class="text">{{seller.bulletin}}</p>
        <ul class="s-supports" v-if="seller.supports">
          <li class="sup-li border-top-1px" v-for="item in seller.supports">
            <span class="icon" :class="classMap[seller.supports[$index].type]"></span>
            <span class="sup-text">{{seller.supports[$index].description}}</span>
          </li>
        </ul>
      </div>
      <v-split></v-split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" v-el:pic-wrapper>
          <ul class="pic-list" v-el:pic-list>
            <li class="pic-item" v-for="pic in seller.pics">
              <img :src="pic" alt="">
            </li>
          </ul>
        </div>
      </div>
      <v-split></v-split>
      <div class="infos">
        <h1 class="title">商家信息</h1>
        <ul>
          <li class="info-item border-top-1px" v-for="info in seller.infos">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {saveToLocal, loadFromLocal} from 'common/js/store';
  import BScroll from 'better-scroll';
  import star from 'components/star/star';
  import split from 'components/split/split';

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        // 根据本地存储的数据决定商家收藏的状态
        favorite: (() => {
          return loadFromLocal(this.seller.id, 'favorite', false);
        })()
      };
    },
    computed: {
      favoriteText() {
        return this.favorite ? '已收藏' : '收藏';
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    watch: {
      // 当刷新页面时监听到seller的dom发生变化后执行_initScroll方法初始化scroll
      'seller'() {
        this._initScroll();
        this._initPicsScroll();
      }
    },
    ready() {
      // 当切换到其他页面再切换回当前页面时会重新初始化scroll，页面才能滚动
      this._initScroll();
      this._initPicsScroll();
    },
    methods: {
      toggleFavorite(e) {
        if (!e._constructed) {
          return;
        }
        this.favorite = !this.favorite;
        saveToLocal(this.seller.id, 'favorite', this.favorite);
      },
      // 页面滚动方法
      _initScroll() {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$els.seller, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      },
      // 商家实景图片滚动方法
      _initPicsScroll() {
        // 当商家有图片时
        if (this.seller.pics) {
          // 先给ul设置宽度
          let picWidth = 120;   // 图片宽度
          let margin = 6;   // 图片间隔
          let width = (picWidth + margin) * this.seller.pics.length - margin;  // 总图片宽度就是ul宽度
          this.$els.picList.style.width = width + 'px';
          this.$nextTick(() => {
            if (!this.picScroll) {
              this.picScroll = new BScroll(this.$els.picWrapper, {
                scrollX: true,   // 横向滚动
                eventPassthrough: 'vertical'  // 忽略竖向滚动
              });
            } else {
              this.picScroll.refresh();
            }
          });
        }
      }
    },
    components: {
      'v-star': star,
      'v-split': split
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../../common/scss/mixin.scss";

  .seller{
    position: absolute;
    top: 174px;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    .overview{
      position: relative;
      padding: 18px;
      .title{
        font-size: 14px;
        line-height: 14px;
        color: rgb(7,17,27);
        margin-bottom: 8px;
      }
      .desc{
        padding-bottom: 18px;
        font-size: 0;
        @include border-1px(rgba(7,17,27,0.1));
        .s-star{
          display: inline-block;
          vertical-align: top;
          margin-right: 8px;
        }
        .text{
          margin-right: 12px;
          font-size: 10px;
          line-height: 18px;
          color: rgb(77,85,93);
        }
      }
      .remark{
        display: flex;
        padding-top: 18px;
        .block{
          flex: 1;
          text-align: center;
          border-right: rgba(7,17,27,0.1);
          &:last-child{
            border-right: none;
          }
          p{
            margin-bottom: 4px;
            font-size: 10px;
            line-height: 10px;
            color: rgb(147,153,159);
          }
          .content{
            font-size: 10px;
            line-height: 24px;
            color: rgb(7,17,27);
            .stress{
              font-size: 24px;
            }
          }
        }
      }
      .favorite{
        width: 50px;
        position: absolute;
        right: 11px;
        top: 18px;
        text-align: center;
        .icon-favorite{
          display: block;
          font-size: 24px;
          line-height: 24px;
          color: #d4d6d9;
          margin-bottom: 4px;
          &.active{
            color: rgb(240,20,20);
          }
        }
        .text{
          font-size: 10px;
          line-height: 10px;
          color: rgb(77,85,93);
        }
      }
    }
    .bulletin{
      padding: 18px 18px 0 18px;
      .title{
        font-size: 14px;
        line-height: 14px;
        color: rgb(7,17,27);
        margin-bottom: 8px;
      }
      .text{
        font-size: 12px;
        line-height: 24px;
        color: rgb(240,20,20);
        margin: 0 12px 16px;
      }
      .s-supports{
        .sup-li{
          padding: 16px 12px;
          font-size: 0;
          @include border-top-1px(rgba(7,17,27,0.1));
          .icon{
            display: inline-block;
            width: 16px;
            height: 16px;
            vertical-align: top;
            margin-right: 6px;
            background-size: 16px 16px;
            background-repeat: no-repeat;
            &.decrease{
              @include bg-image('decrease_4');
            }
            &.discount{
              @include bg-image('discount_4');
            }
            &.guarantee{
              @include bg-image('guarantee_4');
            }
            &.invoice{
              @include bg-image('invoice_4');
            }
            &.special{
              @include bg-image('special_4');
            }
          }
          .sup-text{
            font-size: 12px;
            line-height: 16px;
            color: rgb(7,17,27);
          }
        }
      }
    }
    .pics{
      padding: 18px;
      .title{
        font-size: 14px;
        line-height: 14px;
        color: rgb(7,17,27);
        margin-bottom: 8px;
      }
      .pic-wrapper{
        width: 100%;
        overflow: hidden;
        white-space: nowrap;    /* 当图片张数大于屏幕宽度时不会被折行 */
        .pic-list{
          font-size: 0;
          .pic-item{
            display: inline-block;
            margin-right: 6px;
            width: 120px;
            height: 90px;
            &:last-child{
              margin-right: 0;
            }
            img{
              width: 120px;
              height: 90px;
            }
          }
        }
      }
    }
    .infos{
      padding: 18px 18px 0 18px;
      .title{
        font-size: 14px;
        line-height: 14px;
        color: rgb(7,17,27);
        margin-bottom: 12px;
      }
      .info-item{
        padding: 16px 12px;
        font-size: 12px;
        line-height: 16px;
        color: rgb(7,17,27);
        @include border-top-1px(rgba(7,17,27,0.1));
      }
    }
  }
</style>
