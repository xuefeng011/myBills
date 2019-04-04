<template>
  <div>aaxs</div>
</template>

<script>
export default {
  onLaunch() {
    console.log("app onLaunch", this);
    console.log("打印环境变量:", process.env.VUE_APP_TEST);

    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      console.log("云能力");
      wx.cloud.init({
        traceUser: true
      });
    }
  },
  globalData() {
    return {
      a: 100
    };
  }
};
</script>
