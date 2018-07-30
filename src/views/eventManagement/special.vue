<template>
    <div>
        <div class="special">
            <div class="biaoge">
                <table>
                    <thead>
                        <tr>
                            <th>内容ID</th>
                            <th>标题</th>
                            <th>设置积分数</th>
                            <th>生效时间</th>
                            <th>失效时间</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="header-tr">
                            <td>
                                <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                                <label class="form-check-label" for="defaultCheck1">
                                    全选
                                </label>
                            </td>
                            <td>
                                <button type="button" class="btn btn-outline-primary">删除</button>
                                <button type="button" class="btn btn-outline-primary">新增</button>
                            </td>
                            <td></td>
                            <td></td><td></td><td></td>
                        </tr>
                        <tr>
                            <td>
                                <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                                <label class="form-check-label" for="defaultCheck1">
                                    001
                                </label>
                            </td>
                            <td>######</td>
                            <td>100</td>
                            <td>2018-05-12 09:28</td>
                            <td>2019-05-12 09:28</td>
                            <td><a>编辑内容</a></td> 
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style scoped>
table{
    width: 85%;
    margin: 20px auto;
}
table td,table th{
    text-align: center;
    width: 300px;
}
table tr{
    height: 50px;
}
tbody{
    height: 500px;
    border:rgb(88, 88, 88) 2px solid;
}
.header-tr{
    background-color: #bcbcbc;
}
</style>
