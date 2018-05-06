# lty-elem

> A Vue.js project（vue 仿饿了么实例）

> 项目基于 vue1.0  create by lty 20180506

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
# 连接到8080端口，用于本地开发，访问路由：http://localhost:8080/?id=12345#!/goods
npm run dev

# build for production with minification
# 连接到9000端口，项目压缩后访问的 dist 目录，访问路由：http://localhost:9000/?id=12345#!/goods
npm run build

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```


## 注意：1、链接上的 id 参数可选，用于记录当前商家的id，当执行收藏商家操作时需要把此 id 数据存储到本地，以便达到刷新页面也能获取到商家的收藏状态
         2、链接上的 /goods 可选，最好带上，用于决定项目的落地页（默认是/goods）

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
