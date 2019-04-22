<template>
    <div>
        当前位置：
    </div>
</template>

<script>
export default {
    data() {
        return{
            path:'/aasf/asd/af/s',
            paths:[]
        }
    },
    computed: {
        getpath(){
            this.path=this.$router.path;
        }
    },
}
</script>


