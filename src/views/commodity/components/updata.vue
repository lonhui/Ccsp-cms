<template>
    <div id="updata">
        <div class="content">
            <button @click="closeUpdate">XXXX</button>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        closeUpdate(){
            this.$emit('on-close')
        }
    }    
}
</script>

<style scoped>
#updata{
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(7, 17, 27, 0.8);
    overflow-y: auto;
}
.content{
    width: 500px;
    height: 500px;
    background-color: #fff;
    margin: 100px auto 0;
}
</style>
