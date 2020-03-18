<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>

    export default {
        name: 'app',
        components: {}
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        /*margin-top: 60px;*/
        height: 100%;
    }

    .el-drawer__header {
        padding: 0 !important;
        margin: 0 !important;
    }

    img {
        max-width: 100%;
    }

    .el-menu-item:focus, .el-menu-item:hover {
        outline: none !important;
        background-color: #e6e6e6 !important;
    }


    body {
        display: block;
        margin: 0;
        height: 100%;
    }

    html {
        height: 100%;
    }

</style>
