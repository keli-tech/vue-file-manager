<template>

    <el-row style="width:100%;height: 100%;">

        <el-col :md="3" :lg="4" style="color:white;" class="hidden-xs-and-down">.</el-col>

        <el-col :xs="24" :md="18" :lg="16" class="left" :gutter="20"
        >
            <div class="nav-title">
                <div class="nav-title-head">
                    <img src="/static/images/logo.png"
                         class="head-pic"
                         @click="handleTitleClick"
                    />
                    <span style="font-size: 22px;margin-left: 10px;font-weight: bold;flex:1;text-align: left;">文件管理</span>
                    <el-button icon="el-icon-search" circle @click="isSearch=true"></el-button>
                </div>
            </div>

            <p style="font-size: 23px;">
                文档列表
            </p>

            <el-row style="flex:1; text-align: left;">

                <template>
                    <div style="margin-top: 20px">
                        <el-button type="danger" @click="toggleSelection()">删除
                        </el-button>
                        <el-button @click="toggleSelection()">移动</el-button>
                        <el-button @click="toggleSelection([tableData[1], tableData[2]])">新建文件夹
                        </el-button>
                        <el-button @click="toggleSelection()">上传文件</el-button>
                    </div>
                    <el-table
                            ref="multipleTable"
                            :data="tableData"
                            tooltip-effect="dark"
                            style="width: 100%;"
                            max-height="550"
                            @selection-change="handleSelectionChange">
                        <el-table-column
                                type="selection"
                                width="55">
                        </el-table-column>
                        <el-table-column
                                label="名称"
                                show-overflow-tooltip>
                            <template slot-scope="scope">
                                <template v-if="scope.row.type=='fold'">
                                    <i class="el-icon-folder" style="font-size: 20px;"></i>
                                </template>
                                <template v-else-if="scope.row.type=='mp3'">
                                    <i class="iconfont" style="font-size: 24px;">&#xe6c0;</i>
                                </template>
                                <template v-else-if="scope.row.type=='flac'">
                                    <i class="iconfont" style="font-size: 24px;">&#xe6c3;</i>
                                </template>
                                <span style="margin-left: 10px">{{ scope.row.name }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="230" fixed="right">
                            <template slot-scope="scope">
                                <el-button
                                        size="mini"
                                        @click="handleEdit(scope.$index, scope.row)">重命名
                                </el-button>
                                <el-button
                                        size="mini"
                                        @click="handleEdit(scope.$index, scope.row)">移动
                                </el-button>
                                <el-button
                                        size="mini"
                                        type="danger"
                                        @click="handleDelete(scope.$index, scope.row)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                </template>


                <!--                <el-col v-for="(item, index) in bookCluster"-->
                <!--                        :key="index"-->
                <!--                        :xs="24" :sm="12" :md="8" :lg="8" :xl="6"-->
                <!--                        style="padding:10px;"-->
                <!--                >-->
                <!--                    <el-card shadow="hover" class="box-card">-->
                <!--                        <div slot="header" class="clearfix">-->
                <!--                            <span>{{item.title}}</span>-->
                <!--                        </div>-->
                <!--                        <div style="padding-bottom:  10px;">{{item.desc}}</div>-->


                <!--                        <div v-for="(it, idx) in item.category" :key="idx" class="text item">-->
                <!--                            <el-link type="info">-->
                <!--                                {{(idx+1)+". "}}-->
                <!--                            </el-link>-->
                <!--                            <router-link :to="{path: '/detail/'+it.code+'/', params: { color: 'red' }}" tag="span">-->
                <!--                                <el-link type="primary">-->
                <!--                                    <a :href="'/detail/'+it.code +'/'">{{it.title}}</a>-->
                <!--                                </el-link>-->
                <!--                            </router-link>-->
                <!--                        </div>-->
                <!--                    </el-card>-->
                <!--                </el-col>-->

            </el-row>


            <div class="nav-bottom">
                <div class="sign-bottom">
                    <i class="el-icon-cloudy-and-sunny" style="font-size: 18px;padding: 8px;"></i>
                    Powered by keli.tech
                </div>
            </div>
        </el-col>

    </el-row>

</template>

<script>

    const MarkdownIt = require('markdown-it');

    export default {
        name: 'Home',
        props: {
            msg: String
        },
        data() {
            return {
                bookCluster: [],
                menuList: [],
                menuObj: {},
                isSearch: false,
                input: '',
                book: 'index',
                activeIndex: "1",
                article: {},
                recommendArticle: {},
                tableData: [{
                    date: '2016-05-03',
                    type: 'fold',
                    name: 'JAY',
                }, {
                    date: '2016-05-02',
                    type: 'fold',
                    name: '范特西',
                }, {
                    date: '2016-05-04',
                    type: 'fold',
                    name: '七里香',
                }, {
                    date: '2016-05-01',
                    type: 'mp3',
                    name: '双刀.mp3',
                }, {
                    date: '2016-05-08',
                    type: 'mp3',
                    name: '梯田.mp3',
                }, {
                    date: '2016-05-06',
                    type: 'mp3',
                    name: '七里香.mp3',
                }, {
                    date: '2016-05-07',
                    type: 'flac',
                    name: '告白气球.flac',
                }
                ],
                multipleSelection: []
            }
        },
        comments: {},
        beforeMount() {
            this.getBookList()
            this.getRecommendBlog()
        },
        beforeRouteUpdate(newRoute, oldParam, next) {
            if (newRoute.params.id) {
                this.getDetail(newRoute.params.id)
            }
            next()
        },
        methods: {
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
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
                this.activeIndex = key;
                this.$router.push({
                    name: 'detail', params: {
                        book: this.book, id: key,
                        title: this.menuObj[key].title,
                        keywords: this.menuObj[key].keywords,
                        description: this.menuObj[key].description,
                    }
                })
            },
            getRecommendBlog() {
                const url = "http://cluster2:800/_/items/blog?sort=sort&fields=id,title,content,keywords,description,book.book_code&filter[book.book_code][eq]=recommend&limit=1";
                const me = this;

                this.$axios.get(url, {}).then(function (response) {
                    const data = response.data;
                    if (data.public === true && data.data.length > 0) {
                        let data1 = data.data[0]

                        let md = new MarkdownIt();
                        data1.content = md.render(data1.content);
                        me.recommendArticle = data1

                        // eslint-disable-next-line no-console
                        console.log(me.recommendArticle)
                    }
                }).catch(function (error) {
                    // eslint-disable-next-line no-console
                    console.log(error, 888)
                }).then(function () {
                    // always executed
                });
            },
            getBookList() {
                var url = "http://cluster2:800/_/items/books?sort=sort&fields=id,title,book_code,desc,book_cluster.sort,book_cluster.id,book_cluster.title,book_cluster.desc"
                var me = this
                this.$axios.get(url, {}).then(function (response) {
                    var data = response.data;
                    if (data.public === true) {

                        let cluster = {}
                        for (let key in data.data) {
                            let item = data.data[key]
                            let clusterId = item.book_cluster.id
                            if (!cluster.hasOwnProperty(clusterId)) {
                                cluster[clusterId] = {
                                    title: item.book_cluster.title,
                                    desc: item.book_cluster.desc,
                                    category: [{title: item.title, code: item.book_code}]
                                }
                            } else {
                                cluster[clusterId].category.push(
                                    {title: item.title, code: item.book_code}
                                )
                            }
                        }
                        me.bookCluster = cluster
                    }
                }).catch(function (error) {
                    // eslint-disable-next-line no-console
                    console.log(error)
                    me.$router.replace("/")

                }).then(function () {
                    // always executed
                });
            }
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

    .box-card {
        width: 100%;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
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

    @font-face {
        font-family: 'iconfont';  /* project id 1698385 */
        src: url('//at.alicdn.com/t/font_1698385_an1b8pxn0qp.eot');
        src: url('//at.alicdn.com/t/font_1698385_an1b8pxn0qp.eot?#iefix') format('embedded-opentype'),
        url('//at.alicdn.com/t/font_1698385_an1b8pxn0qp.woff2') format('woff2'),
        url('//at.alicdn.com/t/font_1698385_an1b8pxn0qp.woff') format('woff'),
        url('//at.alicdn.com/t/font_1698385_an1b8pxn0qp.ttf') format('truetype'),
        url('//at.alicdn.com/t/font_1698385_an1b8pxn0qp.svg#iconfont') format('svg');
    }
</style>
