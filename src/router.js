import Vue from 'vue'
import Router from 'vue-router'

//组件模块
import Detail from './pages/Detail'
import Home from './pages/Home'

Vue.use(Router)

export default new Router({
    mode: "history",
    routes: [
        {
            path: '/', name: 'home', component: Home,
            meta: {
                title: "文档中心 - 首页",
                content: {
                    keywords: '文档中心',
                    description: '文档中心',
                }
            }
        },
        {
            path: '/detail/:book/:id?', name: 'detail', component: Detail,
            meta: {
                title: "文档中心 - ",
                content: {
                    keywords: '文档中心',
                    description: '文档中心',
                }
            }
        },
    ],
})
