<template>

    <el-row style="width:100%;height: 100%;">

        <el-col :md="3" :lg="4" style="color:white;" class="hidden-xs-and-down">.</el-col>

        <el-col :xs="24" :md="18" :lg="16" class="left" :gutter="20"
        >
            <div class="nav-title">
                <div class="nav-title-head">
                    <!--                    <img src="/static/images/logo.png"-->
                    <!--                         class="head-pic"-->
                    <!--                         @click="handleTitleClick"-->
                    <!--                    />-->
                    <span style="font-size: 22px;margin-left: 10px;font-weight: bold;flex:1;text-align: left;">文件管理</span>
                </div>
            </div>

            <el-row style="flex:1; text-align: left;">

                <template>
                    <div style="margin-top: 20px">

                        <el-row type="flex" class="row-bg">
                            <el-col :span="12">
                                <el-button @click="toggleSelection([tableData[1], tableData[2]])">

                                    <i class="el-icon-folder-add"></i>

                                    新建文件夹
                                </el-button>
                                <el-button @click="toggleSelection()"><i class="el-icon-upload"></i>
                                    上传文件
                                </el-button>
                            </el-col>
                            <el-col :span="6">
                            </el-col>
                            <el-col :span="6">
                            </el-col>
                            <el-col :span="2">
                                <el-button @click="getRecommendBlog()">
                                    <i class="el-icon-refresh"></i>
                                    刷新
                                </el-button>
                            </el-col>
                        </el-row>

                    </div>
                    <el-table
                            border
                            ref="multipleTable"
                            :data="tableData"
                            tooltip-effect="dark"
                            style="width: 100%; margin-top: 25px;"
                            max-height="550"
                            @selection-change="handleSelectionChange">
                        <!--                        <el-table-column-->
                        <!--                                type="selection"-->
                        <!--                                width="55">-->
                        <!--                        </el-table-column>-->
                        <el-table-column
                                label="名称"
                                show-overflow-tooltip>
                            <template slot-scope="scope">
                                <template v-if="scope.row.Type=='fold'">
                                    <i class="el-icon-folder" style="font-size: 20px;"
                                       @click="currentPath=scope.row.FullPath; getRecommendBlog()"></i>
                                </template>
                                <template v-else-if="scope.row.Type=='mp3'">
                                    <i class="iconfont" style="font-size: 24px;">&#xe6c0;</i>
                                </template>
                                <template v-else-if="scope.row.Type=='flac'">
                                    <i class="iconfont" style="font-size: 24px;">&#xe6c3;</i>
                                </template>
                                <span style="margin-left: 10px">{{ scope.row.Name }}</span>
                            </template>
                        </el-table-column>

                        <el-table-column
                                label="大小"
                                fixed="right"
                                width="120"
                        >
                            <template slot-scope="scope">
                                <span style="margin-left: 10px">{{ scope.row.Size }}</span>
                            </template>
                        </el-table-column>

                        <el-table-column label="操作" width="230" fixed="right">
                            <template slot-scope="scope">
                                <el-button
                                        size="mini"
                                        @click="handleEdit(scope.$index, scope.row)">
                                    <i class="el-icon-files"></i>
                                    移动
                                </el-button>
                                <el-button
                                        size="mini"
                                        type="danger"
                                        @click="handleDelete(scope.$index, scope.row)">
                                    <i class="el-icon-delete"></i>
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                </template>

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
                tableData: [],
                multipleSelection: [],
                currentPath: '/',
            }
        },
        comments: {},
        beforeMount() {
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
                const url = "http://localhost:8000/api/assets";
                const me = this;
                const params = {
                    params: {
                        path: me.currentPath
                    }
                }

                // eslint-disable-next-line no-console
                // console.log(me.currentPath)

                this.$axios.get(url, params).then(function (response) {
                    const data = response.data;
                    // eslint-disable-next-line no-console
                    // console.log(data.Code, data.Data.Total);

                    if (data.Code === 200 && data.Data.Total >= 0) {
                        me.tableData = data.Data.List
                        // eslint-disable-next-line no-console
                        console.log(me.tableData)
                    }
                }).catch(function (error) {
                    // eslint-disable-next-line no-console
                    console.log(error, 888)
                }).then(function () {
                    // always executed
                });
            },
            handleDelete(index, row) {
                const url = "http://localhost:8000/api/assets/" + row.ID;
                const me = this;

                this.$axios.delete(url, {}).then(function (response) {
                    const data = response.data;
                    // eslint-disable-next-line no-console
                    console.log(data);

                    if (data.Code === 200) {
                        //     me.tableData = data.Data.List
                        // eslint-disable-next-line no-console
                    }
                    me.getRecommendBlog();

                }).catch(function (error) {
                    // eslint-disable-next-line no-console
                    console.log(error, 888)
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
