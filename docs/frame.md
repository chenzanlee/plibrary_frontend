
MuYuan-Platform架构指南
==================

```i管书``` 为超大型项目，项目结构多为模块化拆分。

****

* [目录架构](#目录架构)

### 目录架构

<pre v-pre="" data-lang="">
	<code class="lang-" style="padding:0">
  
┌── docs                            项目文档
│   └── frame.md                    项目架构指南
├── node_modules                    第三方依赖
├── public                          静态资源
│   ├── favicon.ico                 favicon图标
│   └── index.html                  html模板
├── src                             源代码
│   ├── assets                      主题 字体等静态资源
│   ├── common                      项目公用资源
│   │   ├── base                    底层封装库
│   │   ├── config                  配置项
│   │   ├── constants               定义常量
│   │   ├── directive               指令封装
│   │   ├── filters                 filter封装
│   │   ├── styles                  样式集合
│   │   └── utils                   工具函数
│   ├── components                  全局公用组件
│   ├── http                        请求库封装
│   │   └── api                     请求地址
│   ├── icons                       项目所有 svg icons
│   ├── lib                         项目私有库
│   ├── router                      全局路由管理
│   ├── store                       全局 store管理
│   ├── views                       views 所有板块
│   │   └── xxxx                    项目板块
│   │   │    ├── common             板块公用资源
│   │   │    │    ├── components    组件
│   │   │    │    └── styles        样式
│   │   │    ├── page               板块页面
│   │   │    │    └── subpage       子页面
│   │   │    ├── router             板块路由
│   │   │    │    └── modules       子模块
│   │   │    └── store              板块 store管理
│   ├── App.vue                     入口页面
│   └── main.js                     入口文件 加载组件 初始化等
├── .env.xxx                        环境变量配置
├── vue.config.js                   vue-cli 配置
└── package.json                    package.json
	</code>
</pre>
