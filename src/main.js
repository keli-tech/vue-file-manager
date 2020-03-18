import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import './plugins/axios.js'

import router from './router'


Vue.config.productionTip = false

var _hmt = _hmt || [];

new Vue({
    router,
    beforeMount() {
        // eslint-disable-next-line no-console
        this.$router.beforeEach((to, from, next) => {


            if (to.meta.content) {
                let head = document.getElementsByTagName('head');
                let meta = document.createElement('meta');

                let keywords = to.params.keywords ? to.params.keywords : to.meta.content.keywords
                let description = to.params.description ? to.params.description : to.meta.content.description

                document.querySelector('meta[name="keywords"]').setAttribute('content', keywords)
                document.querySelector('meta[name="description"]').setAttribute('content', description)
                meta.content = to.meta.content;
                head[0].appendChild(meta)
            }

            if (to.meta.title) {
                document.title = to.meta.title + to.params.title
            }

            if (to.path) {
                // eslint-disable-next-line no-console
                // console.log(to.path, _hmt)
                // _hmt.push(['_trackPageview', to.fullPath]);
            }

            next()
        })
    },
    render: h => h(App),
}).$mount('#app')
