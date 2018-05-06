<template>
  <div class="ratings" v-el:ratings>
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <p class="p1">综合评分</p>
          <p class="p2">高于周边商家{{seller.rankRate}}%</p>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <v-star :size="36" :score="seller.serviceScore"></v-star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <v-star :size="36" :score="seller.foodScore"></v-star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="in-time">
            <span class="title">送达时间</span>
            <span class="time">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <v-split></v-split>
      <v-ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="ratings"></v-ratingselect>
      <div class="rating-wrapper">
        <ul>
          <li class="rating-item border-1px" v-for="rating in ratings" v-show="needShow(rating.rateType, rating.text)">
            <div class="rat-left">
              <img class="avatar" :src="rating.avatar" alt="">
            </div>
            <div class="rat-right">
              <div class="name-time">
                <span class="name fl">{{rating.username}}</span>
                <span class="time fr">{{rating.rateTime | formatDate}}</span>
              </div>
              <div class="star-time">
                <v-star :size="24" :score="rating.score"></v-star>
                <span class="time" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend.length">
                <i class="icon-thumb_up"></i>
                <span class="recom" v-for="item in rating.recommend">{{item}}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import {formatDate} from 'common/js/date';
  import star from 'components/star/star';
  import split from 'components/split/split';
  import ratingselect from 'components/ratingselect/ratingselect';

  const ALL = 2;
  const ERR_OK = 0;

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        ratings: [],
        // 对评论组件的变量跟踪
        selectType: ALL,
        onlyContent: true
      };
    },
    methods: {
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
    created() {
      this.$http.get('/api/ratings').then((res) => {
        res = res.body;
        if (res.errno === ERR_OK) {
          this.ratings = res.data;
          this.$nextTick(() => {
            this.scroll = new BScroll(this.$els.ratings, {
              click: true
            });
          });
        }
      });
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      'v-star': star,
      'v-split': split,
      'v-ratingselect': ratingselect
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../common/scss/mixin.scss";

  .ratings{
    position: absolute;
    top: 174px;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    .overview{
      display: flex;
      padding: 18px 0;
      .overview-left{
        flex: 0 0 137px;
        width: 137px;
        border-right: 1px solid rgba(7,17,27,0.1);
        text-align: center;
        padding: 6px 0;
        @media only screen and (max-width: 320px){
          flex: 0 0 120px;
          width: 120px;
        }
        .score{
          font-size: 24px;
          line-height: 28px;
          color: rgb(255,153,0);
        }
        .p1{
          font-size: 12px;
          line-height: 12px;
          color: rgb(7,17,27);
          margin: 6px 0 8px;
        }
        .p2{
          font-size: 10px;
          line-height: 10px;
          color: rgb(147,153,159);
        }
      }
      .overview-right{
        flex: 1;
        padding: 6px 0 6px 24px;
        @media only screen and (max-width: 320px){
          padding-left: 6px;
        }
        .score-wrapper{
          margin-bottom: 8px;
          font-size: 0;
          .title{
            display: inline-block;
            vertical-align: top;
            font-size: 12px;
            line-height: 18px;
            color: rgb(7,17,27);
          }
          .s-star{
            display: inline-block;
            vertical-align: top;
            margin: 0 12px;
          }
          .score{
            display: inline-block;
            vertical-align: top;
            font-size: 12px;
            line-height: 18px;
            color: rgb(255,153,0)
          }
        }
        .in-time{
          font-size: 12px;
          line-height: 18px;
          .title{
            color: rgb(7,17,27);
          }
          .time{
            color: rgb(147,153,159);
            margin-left: 12px;
          }
        }
      }
    }
    .rating-wrapper{
      padding: 18px;
      .rating-item{
        display: flex;
        padding: 18px 0;
        @include border-1px(rgba(7,17,27,0.1));
        .rat-left{
          flex: 0 0 28px;
          width: 28px;
          margin-right: 12px;
          .avatar{
            width: 28px;
            height: 28px;
            border-radius: 50%;
          }
        }
        .rat-right{
          flex: 1;
          .name-time{
            overflow: hidden;
            font-size: 10px;
            line-height: 12px;
            margin-bottom: 4px;
            .name{
              color: rgb(7,17,27);
            }
            .time{
              color: rgb(147,153,159);
            }
          }
          .star-time{
            margin-bottom: 6px;
            .s-star{
              display: inline-block;
            }
            .time{
              font-size: 10px;
              line-height: 12px;
              color: rgb(147,153,159);
              margin-left: 6px;
            }
          }
          .text{
            font-size: 12px;
            line-height: 18px;
            color: rgb(7,17,27);
            margin-bottom: 8px;
          }
          .recommend{
            line-height: 16px;
            font-size: 0;
            .icon-thumb_up, .recom{
              display: inline-block;
              margin: 0 8px 4px 0;
              font-size: 9px;
            }
            .icon-thumb_up{
              color: rgb(0,160,220);
            }
            .recom{
              padding: 0 6px;
              border: 1px solid rgba(7,17,27,0.1);
              border-radius: 1px;
              color: rgb(147,153,159)
            }
          }
        }
      }
    }
  }
</style>
