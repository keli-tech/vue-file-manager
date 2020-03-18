<template>

    <el-row style="width:100%;height: 100%;">

        <el-col :xs="24" :sm="6" class="left hidden-sm-and-down">
            <div class="nav-title">
                <div class="nav-title-head">
                    <img src="/static/images/logo.png"
                         class="head-pic"
                         @click="handleTitleClick"
                    />
                    <span style="font-size: 22px;margin-left: 10px;font-weight: bold;flex:1;text-align: left;">文档中心</span>
                    <el-button icon="el-icon-search" circle @click="isSearch=true"></el-button>
                </div>
            </div>

            <el-menu
                    :default-active="activeIndex"
                    mode="vertical"
                    class="el-menu-vertical-demo nav"
                    @select="handleSelect"
                    background-color="#F4F7F9"
                    text-color="#102030"
                    active-text-color="#3065BB"
            >
                <el-menu-item v-for="(item) in menuList" :key="item.id"
                              class="menu-item"
                              :index="''+item.id">
                    <router-link :to="{path: '/detail/'+item.book.book_code+'/' + item.id, params: { color: 'red' }}"
                                 tag="span">
                        <el-link type="primary">
                            <a :href="'/detail/'+item.book.book_code +'/' + item.id">{{item.title}}</a>
                        </el-link>
                    </router-link>
                </el-menu-item>
            </el-menu>
            <div class="nav-bottom">
                <div class="sign-bottom">
                    <i class="el-icon-cloudy-and-sunny" style="font-size: 18px;padding: 8px;"></i>
                    Powered by keli.tech
                </div>
            </div>
        </el-col>

        <el-col :xs="24" :sm="24" :md="18" style="overflow: auto; height:100%;">


            <el-row style="width:100%;height: 100%;">
                <el-col :xs="24" :sm="24" :md="18" class="hidden-md-and-up">
                    <div class="nav-title" style="background:white">
                        <div class="nav-title-head">
                            <img src="/static/images/logo.png"
                                 class="head-pic"
                                 @click="handleTitleClick"
                            />
                            <span style="font-size: 22px;margin-left: 10px;font-weight: bold;flex:1;text-align: left;">文档中心</span>
                            <el-button icon="el-icon-search" circle @click="isSearch=true"></el-button>
                        </div>
                    </div>
                </el-col>

                <el-col :span="6"></el-col>

                <template v-if="is404" style="height:100%;display:flex;-ms-background-position-x: center;">
                    <div style="position:absolute;top:0;left:0;width:100%; height: 100%;background-size:100% 100%; background: url(https://api.keli.tech/uploads/_/originals/786463a1-5b80-5a20-b88c-3fa81e72003b.jpg) no-repeat center;">
                        <div style="padding-top: 60px;">
                            <span style=" font-size: 40px;color:#B4A77B">404 NOT FOUND</span>
                        </div>
                    </div>
                </template>
                <el-col v-else :xs="24" :sm="24" :md="18">
                    <div style="text-align:  left;margin: 0 50px; line-height: 28px;">
                        <h1>{{article.title}}</h1>
                        <div v-html="article.content"></div>

                        <div v-if="article.id">
                            <el-divider></el-divider>
                            <span style="color:#666; font-size: 12px;padding-bottom: 20px;">更新时间: {{article.modified_on}}</span>
                        </div>

                    </div>

                    <div class="nav-bottom hidden-md-and-up">
                        <div class="sign-bottom">
                            <i class="el-icon-cloudy-and-sunny" style="font-size: 18px;padding: 8px;"></i>
                            Powered by keli.tech
                        </div>
                    </div>
                </el-col>


                <el-col :span="6"></el-col>


            </el-row>


        </el-col>

        <el-drawer
                :visible.sync="isSearch"
                direction="rtl"
                :show-close="false"
                size="25%"
        >
            <span slot="title" class="search-title">
<!--                <i class="el-icon-search" style="padding: 10px;font-size:22px;"></i>-->
                <el-input
                        prefix-icon="el-icon-search"
                        placeholder="搜索"
                        v-model="input"
                        clearable>
                </el-input>
                <el-button type="text" @click="isSearch=false">
                    <i class="el-icon-right"
                       style="font-size: 22px;padding:5px;"></i>
                </el-button>
            </span>
            <div slot style="color:#ccc">- [] todo</div>
        </el-drawer>

    </el-row>

</template>

<script>

    var MarkdownIt = require('markdown-it');

    export default {
        name: 'Home',
        props: {
            msg: String
        },
        data() {
            return {
                is404: false,
                menuList: [],
                menuObj: {},
                isSearch: false,
                input: '',
                book: 'index',
                activeIndex: "-1",
                article: {},
            }
        },
        comments: {},

        beforeMount() {
            this.$route.params.book ? this.book = this.$route.params.book : ""

            this.getList(this.book)
            if (this.$route.params.id) {
                this.getDetail(this.$route.params.id)
            }
        },
        beforeRouteUpdate(newRoute, oldParam, next) {
            if (newRoute.params.id) {
                this.getDetail(newRoute.params.id)
            }
            next()
        },
        methods: {
            good() {
                this.$http.get()
            },
            handleTitleClick() {
                // eslint-disable-next-line no-console
                if (this.$route.path === '/') {
                    //
                    //
                } else {
                    this.$router.push('/')
                    this.getList(this.book)
                    this.activeIndex = '1'
                    this.getDetail(this.activeIndex)
                }
            },
            handleSelect(key) {
                if (key === this.activeIndex) {
                    return
                }
                this.activeIndex = key + "";
                this.$router.push({
                    name: 'detail', params: {
                        book: this.book, id: key,
                        title: this.menuObj[key].title,
                        keywords: this.menuObj[key].keywords,
                        description: this.menuObj[key].description,
                    }
                })
            },

            getList(book) {
                var url = "http://cluster2:800/_/items/blog?sort=sort&fields=id,title,keywords,description,book.book_code&filter[book.book_code][eq]=" + book
                var me = this
                me.is404 = false
                this.$axios.get(url, {}).then(function (response) {
                    var data = response.data;
                    if (data.public === true) {
                        me.menuList = data.data
                        for (let key in data.data) {
                            let item = data.data[key]
                            me.menuObj[item.id] = item
                        }

                        if (me.activeIndex === "-1" && me.menuList.length > 0) {
                            const blogId = me.menuList[0].id
                            me.getDetail(blogId)
                        }
                        if (me.menuList.length === 0) {
                            me.is404 = true
                        }
                    }
                }).catch(function (error) {
                    // eslint-disable-next-line no-console
                    console.log(error, 444)
                    me.is404 = true
                }).then(function () {
                    // always executed
                });
            },
            getDetail(id) {
                const url = "http://cluster2:800/_/items/blog/" + id + "?fields=id,title,content,modified_on";
                const me = this;
                me.is404 = false
                me.activeIndex = id + ""


                this.$axios.get(url, {}).then(function (response) {
                    const data = response.data;
                    if (data.public === true) {
                        me.activeIndex = id + ""
                        const md = new MarkdownIt();
                        data.data.content = md.render(data.data.content);
                        me.article = data.data

                        if (data.data.title === null) {
                            me.is404 = true
                        }
                    }
                }).catch(function (error) {
                    // eslint-disable-next-line no-console
                    console.log(error, id, 888)
                    me.is404 = true
                }).then(function () {
                    // always executed
                });
            },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .left {
        height: 100%;
        display: flex;
        flex: 1;
        flex-direction: column;
        background: #F4F7F9;
    }

    .head-pic {
        width: 50px;
        height: 50px;
    }

    .nav-title {
        padding: 10px;
        height: 50px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border-bottom: 2px solid #E6ECF1;
    }

    .nav-title-head {
        display: flex;
        width: 100%;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .nav-title-booktitle {
        text-align: left;
    }

    .search-title {
        padding: 10px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #E6ECF1;
    }


    .nav {
        background: #F4F7F9;
        flex: 1;
        flex-direction: column;
        overflow: auto;
    }

    .nav-bottom {
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .sign-bottom {
        margin: 10px;
        height: 40px;
        width: 100%;
        background: #E6ECF1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        border-radius: 5px;
    }

    .menu-item {
        text-align: left;
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .el-menu-item {
        height: 36px;
        line-height: 36px;
    }

    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
