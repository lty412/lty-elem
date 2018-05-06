<template>
  <div>
    <v-header :seller="seller"></v-header>

    <div class="v-tab border-1px">
      <div class="tab-item">
        <a v-link="{path:'/goods'}">商品</a>
      </div>
      <div class="tab-item">
        <a v-link="{path:'/ratings'}">评论</a>
      </div>
      <div class="tab-item">
        <a v-link="{path:'/seller'}">商家</a>
      </div>
    </div>

    <router-view :seller="seller" keep-alive></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {urlParse} from 'common/js/util';
  import header from 'components/header/header.vue';

  const ERR_OK = 0;

  export default {
    data() {
      return {
        seller: {
          id: (() => {
            let queryParam = urlParse();
            return queryParam.id;
          })()
        }
      };
    },
    created() {
      this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.seller = Object.assign({}, this.seller, response.data);  // 扩展对象（把id扩展进去）
        }
      });
    },
    components: {
      'v-header': header
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "./common/scss/mixin.scss";

  .v-tab{
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    @include border-1px(rgba(7,17,27,.1));
    .tab-item{
      flex: 1;
      text-align: center;
      & a{
        display: block;
        font-size: 14px;
        color: #4d555d;
        &.active{
          color: #f01414;
        }
      }
    }
  }
</style>
