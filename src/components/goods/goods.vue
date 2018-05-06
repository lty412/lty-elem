<template>
  <div class="V-content-wrapper">
    <div class="V-left-menu" v-el:menu-wrapper>
      <ul>
        <li v-for="item in goods" class="menu-li" :class="{'current':currentIndex==$index}" @click="selectMenu($index, $event)">
          <span class="g-name">
            <i v-show="item.type>0" class="icon" :class="classMap[item.type]"></i>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="V-right-goods" v-el:food-wrapper>
      <ul>
        <li v-for="item in goods" class="goods-list goods-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" @click="selectFood(food,$event)" class="food-item border-1px">
              <div class="icon">
                <img width="57" height="57" :src="food.icon">
              </div>
              <div class="foods-content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now-price">¥{{food.price}}</span>
                  <del class="old-price" v-show="food.oldPrice">¥{{food.oldPrice}}</del>
                </div>
                <div class="cartcontrol-wrapper">
                  <v-cartcontrol :food="food"></v-cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <v-shopcart v-ref:shopcart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></v-shopcart>
  </div>
  <v-food :food="selectedFood" v-ref:food></v-food>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import shopcart from 'components/shopcart/shopcart';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import food from 'components/food/food';

  const ERR_OK = 0;

  export default {
    props: {
      // 把seller的数据传进来，以便使用
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,
        selectedFood: {}
      };
    },
    computed: {
      // 目前所滚动到对应右侧商品区块的所以值
      currentIndex() {
        for (let _i = 0; _i < this.listHeight.length; _i++) {
          let height1 = this.listHeight[_i];
          let height2 = this.listHeight[_i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return _i;
          }
        }
        return 0;
      },
      // 所有被选择的商品
      selectFoods() {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    created() {
      // 活动icon样式
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

      // 请求商品数据
      this.$http.get('/api/goods').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.goods = response.data;

          // 初始化Scroll,以便正确计算scroll的高度
          this.$nextTick(() => {
            this._initScroll();

            // 计算右侧商品每个区块的高度，用于联动左侧滑动
            this._calculateHeight();
          });
        }
      });
    },
    methods: {
      selectMenu(index, event) {
        // 传一个event对象，执行自己派发的事件（为了防止pc会触发两次的问题）
        if (!event._constructed) {
          return;
        }
        let goodsList = this.$els.foodWrapper.getElementsByClassName('goods-list-hook');
        let el = goodsList[index];
        this.foodScroll.scrollToElement(el, 300);
      },
      selectFood(food, event) {
        // 传一个event对象，执行自己派发的事件（为了防止pc会触发两次的问题）
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food;
        // 调用food子组件的show方法（需要在对应的Dom上面添加 v-ref：food）
        this.$refs.food.show();
      },
      _initScroll() {
        // 用this.$els.menuWrapper来获取对应的dom (this.$els.menu-wrapper)
        this.menuScroll = new BScroll(this.$els.menuWrapper, {
          click: true
        });

        this.foodScroll = new BScroll(this.$els.foodWrapper, {
          click: true,
          probeType: 3             // 实时监听滚动的位置
        });

        // 监听滚定事件，实时把对应的位置暴露出来(Math.round用于处理小数，Math.abs用于把负值转成正值)
        this.foodScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));       // 可以实时拿到scrollY
        });
      },
      _calculateHeight() {
        // 拿到对应商品区块的dom，并把对应的高度push到listHeight数组中
        let goodsList = this.$els.foodWrapper.getElementsByClassName('goods-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let _i in goodsList) {
          let item = goodsList[_i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      },
      _drop(target) {
        // 为了优化体验，异步执行下落动画
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target);
        });
      }
    },
    components: {
      'v-shopcart': shopcart,
      'v-cartcontrol': cartcontrol,
      'v-food': food
    },
    events: {
      // 需要调用子组件的方法(shopcart组件)
      'cart.add'(target) {
        this._drop(target);
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../../common/scss/mixin.scss";

  .V-content-wrapper {
    width: 100%;
    position: absolute;
    top: 174px;
    bottom: 46px;
    display: flex;
    overflow: hidden;
    .V-left-menu {
      flex: 0 0 80px;
      width: 80px;
      background-color: #f3f5f7;
      .menu-li {
        display: table;
        height: 54px;
        line-height: 14px;
        width: 56px;
        padding: 0 12px;
        &.current {
          position: relative;
          z-index: 10;
          margin-top: -1px;
          background-color: #fff;
          font-weight: bold;
          .g-name {
            @include border-none();
          }
        }
        .icon {
          display: inline-block;
          width: 12px;
          height: 12px;
          vertical-align: top;
          margin-right: 2px;
          background-size: 12px 12px;
          background-repeat: no-repeat;
          &.decrease {
            @include bg-image('decrease_3');
          }
          &.discount {
            @include bg-image('discount_3');
          }
          &.guarantee {
            @include bg-image('guarantee_3');
          }
          &.invoice {
            @include bg-image('invoice_3');
          }
          &.special {
            @include bg-image('special_3');
          }
        }
        .g-name {
          display: table-cell;
          vertical-align: middle;
          width: 56px;
          font-size: 12px;
          line-height: 14px;
          @include border-1px(rgba(7, 17, 27, .1));
        }
      }
    }
    .V-right-goods {
      flex: 1;
      .title {
        padding-left: 14px;
        height: 26px;
        line-height: 26px;
        border-left: 2px solid #d9dde1;
        font-size: 12px;
        color: rgb(147, 153, 159);
        background-color: #f3f5f7;
      }
      .food-item {
        display: flex;
        margin: 18px 18px 0 18px;
        padding-bottom: 18px;
        @include border-1px(rgba(7, 17, 27, .1));
        &:last-child {
          @include border-none();
        }
        .icon {
          flex: 0 0 57px;
          width: 57px;
          margin-right: 10px;
        }
        .foods-content {
          flex: 1;
          .name {
            margin: 2px 0 8px;
            height: 14px;
            line-height: 14px;
            font-size: 14px;
            color: rgb(7, 17, 27);
          }
          .desc, .extra {
            font-size: 10px;
            line-height: 10px;
            color: rgb(147, 153, 159);
          }
          .desc {
            margin-bottom: 8px;
            line-height: 14px;
          }
          .extra .count {
            margin-right: 12px;
          }
          .price {
            font-weight: bold;
            line-height: 24px;
            .now-price {
              margin-right: 5px;
              font-size: 14px;
              color: rgb(240, 20, 20);
              .old-price {
                font-size: 10px;
                color: rgb(147, 153, 159);
              }
            }
          }
          .cartcontrol-wrapper {
            position: absolute;
            right: 0;
            bottom: 12px;
          }
        }
      }
    }
  }
</style>
