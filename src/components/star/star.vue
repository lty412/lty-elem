<template>
  <div class="s-star" :class="starType">
    <span class="star-item" :class="itemClass" v-for="itemClass in itemClasses" track-by="$index"></span>
  </div>
</template>

<script type="text/ecmascript-6">
  const LENGTH = 5;
  const CLS_ON = 'on';
  const CLS_HALF = 'half';
  const CLS_OFF = 'off';

  export default {
    // 组件接收两个参数，size（星星大小48,36,24），score（分数）
    props: {
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },
    computed: {
      starType() {
        return 'star-' + this.size;
      },
      itemClasses() {
        let result = [];

        // 分数向下取整
        let score = Math.floor(this.score * 2) / 2;
        // 计算半颗星(判断是否有小数,对1取余)
        let hasDecimal = score % 1 !== 0;
        // 计算全星(分数取整)
        let integer = Math.floor(score);

        // 存放全星
        for (let i = 0; i < integer; i++) {
          result.push(CLS_ON);
        }

        // 如果有半星，则放一个半星（半星只有一个）
        if (hasDecimal) {
          result.push(CLS_HALF);
        }

        // 当结果小于定义星星的个数时，用无星补全
        while (result.length < LENGTH) {
          result.push(CLS_OFF);
        }

        // 返回星星状态的数组
        return result;
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../../common/scss/mixin.scss";

  .s-star {
    font-size: 0;
    .star-item {
      display: inline-block;
      background-repeat: no-repeat;
    }
    &.star-48 {
      .star-item {
        width: 20px;
        height: 20px;
        margin-right: 22px;
        background-size: 20px 20px;
        &:last-child {
          margin-right: 0;
        }
        &.on {
          @include bg-image('star48_on');
        }
        &.half {
          @include bg-image('star48_half');
        }
        &.off {
          @include bg-image('star48_off');
        }
      }
    }
    &.star-36 {
      .star-item {
        width: 15px;
        height: 15px;
        margin-right: 6px;
        background-size: 15px 15px;
        &:last-child {
          margin-right: 0;
        }
        &.on {
          @include bg-image('star36_on');
        }
        &.half {
          @include bg-image('star36_half');
        }
        &.off {
          @include bg-image('star36_off');
        }
      }
    }
    &.star-24 {
      .star-item {
        width: 10px;
        height: 10px;
        margin-right: 3px;
        background-size: 10px 10px;
        &:last-child {
          margin-right: 0;
        }
        &.on {
          @include bg-image('star24_on');
        }
        &.half {
          @include bg-image('star24_half');
        }
        &.off {
          @include bg-image('star24_off');
        }
      }
    }
  }
</style>
