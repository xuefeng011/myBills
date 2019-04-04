<template>
  <div class="app">
    <div class="top">
      <div class="billitem">
        <div class="pic">
          <img :src="billItem.icon">
        </div>
        <div class="data">
          <p class="title">{{billItem.title}}</p>
          <p class="desc">{{billItem.remark}}</p>
        </div>
        <div class="number red">{{billItem.money}}</div>
      </div>
    </div>
    <div class="billdetail">
      <div class="line">
        <span>标题信息</span>
        <input type="text" name="title" v-model="billItem.title" placeholder="标题">
      </div>
      <div class="line">
        <span>来源信息</span>
        <picker
          class="_picker"
          mode="selector"
          range-key="name"
          :value="billItem.source"
          :range="sourceRange"
          @change="sourceChange"
        >
          <view class="picker">{{sourceRange[billItem.source]["name"]}}</view>
        </picker>
      </div>
      <div class="line">
        <span>备注信息</span>
        <input type="text" name="remark" v-model="billItem.remark" placeholder="备注">
      </div>
      <div class="split"></div>
      <div class="line">
        <span>金额</span>
        <input type="money" name="money" v-model="billItem.money" placeholder="金额">
      </div>
    </div>

    <div class="bottombox">
      <div class="btnremove" @click="removeData">删除</div>
      <div class="btnupdate" @click="updateData">更新</div>
    </div>
  </div>
</template>

<script>
import mixin from "./mixin.js";
const db = wx.cloud.database();
const tb_mybilllist = db.collection("mybilllist");

export default {
  mixins: [mixin],
  data() {
    return {
      sourceRange: [
        {
          name: "现金",
          icon: "https://xuefeng011.github.io/images/img/cash.png"
        },
        {
          name: "支付宝",
          icon: "https://xuefeng011.github.io/images/img/zhi.png"
        },
        {
          name: "花呗",
          icon: "https://xuefeng011.github.io/images/img/huabei.png"
        },
        {
          name: "蚂蚁财富",
          icon: "https://xuefeng011.github.io/images/img/mayi.png"
        },
        {
          name: "微信",
          icon: "https://xuefeng011.github.io/images/img/wechat.png"
        },
        {
          name: "京东",
          icon: "https://xuefeng011.github.io/images/img/jingdong.png"
        },
        {
          name: "银行卡",
          icon: "https://xuefeng011.github.io/images/img/bank.png"
        },
        {
          name: "浦发",
          icon: "https://xuefeng011.github.io/images/img/pufa.png"
        },
        {
          name: "农行",
          icon: "https://xuefeng011.github.io/images/img/nongye.png"
        },
        {
          name: "工行",
          icon: "https://xuefeng011.github.io/images/img/gongshang.png"
        }
      ],
      globalData: {},

      billItem: {
        id: 0,
        title: "",
        source: 0,
        remark: "",
        money: "",
        icon: "https://xuefeng011.github.io/images/img/cash.png"
      }
    };
  },
  mounted() {
    let { query } = this.$mp || {};
    let id = parseInt(query.id);

    tb_mybilllist
      .where({ id: id })
      .get()
      .then(res => {
        if (res.data.length > 0) {
          this.billItem = res.data[0];
        } else {
          this.billItem = {
            id: id,
            title: "",
            source: 0,
            remark: "",
            money: "",
            icon: this.sourceRange[0]["icon"]
          };
        }
      });

    var appInstance = getApp();
    this.globalData = appInstance.globalData;
  },
  methods: {
    sourceChange(e) {
      this.setSource(parseInt(e.detail.value));
    },
    setSource(id) {
      this.billItem.source = id;
      this.billItem.icon = this.sourceRange[id]["icon"];
    },
    onTouchStart(e) {
      console.log(e);
    },
    handlerClick() {
      wx.showToast({
        title: "成功",
        icon: "success",
        duration: 2000
      });
    },
    async removeData() {
      let re = await tb_mybilllist.doc(this.billItem._id).remove();

      wx.showToast({
        title: "成功",
        icon: "success",
        duration: 1000,
        success() {
          setTimeout(() => {
            Megalo.navigateBack();
          }, 1000);
        }
      });
    },
    async updateData() {
      let d = await tb_mybilllist.doc(this.billItem._id);
      this.billItem.money = parseFloat(this.billItem.money);
      if (!d._id) {
        tb_mybilllist.add({
          data: {
            id: this.billItem.id,
            title: this.billItem.title,
            source: this.billItem.source,
            remark: this.billItem.remark,
            icon: this.billItem.icon,
            money: this.billItem.money,
            updatetime: new Date().valueOf()
          },
          success() {
            wx.showToast({
              title: "成功",
              icon: "success",
              duration: 1000,
              success() {
                setTimeout(() => {
                  Megalo.navigateBack();
                }, 1000);
              }
            });
          },
          fail(e) {
            wx.showToast({
              title: e.errMsg,
              icon: "error",
              duration: 1000,
              success() {}
            });
          }
        });
      } else {
        d.set({
          data: {
            id: this.billItem.id,
            title: this.billItem.title,
            source: this.billItem.source,
            remark: this.billItem.remark,
            icon: this.billItem.icon,
            money: this.billItem.money,
            updatetime: new Date().valueOf()
          },
          success() {
            wx.showToast({
              title: "成功",
              icon: "success",
              duration: 2000,
              success() {
                setTimeout(() => {
                  Megalo.navigateBack();
                }, 1000);
              }
            });
          },
          fail(e) {
            console.log(e);
            wx.showToast({
              title: e.errMsg,
              icon: "error",
              duration: 2000,
              success() {}
            });
          }
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.app {
  background: #eee;
  height: 100%;
}
.billitem {
  padding: 10px 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background: #fff;
  border-bottom: 1px solid #eee;
  .pic {
    flex-basis: 80px;
    text-align: center;
    align-self: center;
    img {
      width: 35px;
      height: 35px;
      background: #eee;
      border-radius: 50%;
      display: inline-block;
      padding: 10px;
    }
  }
  .data {
    flex: 1;
    text-align: left;
    padding: 5px 0 0 15px;
    font-size: 17px;

    .desc {
      color: #999;
      font-size: 15px;
    }
  }
  .number {
    flex-basis: 100px;
    text-align: right;
    align-self: center;
    &.red {
      color: #f40;
    }
  }
}

.billdetail {
  margin: 15px 0;
  background: #fff;
  .split {
    height: 15px;
    width: 100%;
    background: #eee;
  }
  .line {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    font-size: 16px;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    span {
      flex-basis: 40%;
      text-align: center;
      display: inline-block;
    }
    input,
    ._picker {
      flex-basis: 60%;
      text-align: center;
      display: inline-block;

      border-radius: 5px;
    }
  }
}
.bottombox {
  position: fixed;
  width: 100%;
  bottom: 30px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  div {
    opacity: 0.9;
    margin: 0 15px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
    border-radius: 25px;
    color: #fff;
    flex: 1;
  }
  .btnremove {
    background: rgb(248, 84, 24);
    box-shadow: 2px 2px 5px rgb(248, 84, 24);
    text-shadow: 2px 2px 5px rgb(248, 84, 24);
  }
  .btnupdate {
    background: #32c338;
    box-shadow: 2px 2px 5px #32c338;
    text-shadow: 2px 2px 5px #32c338;
  }
}
</style>
