<template>
  <div class="app">
    <div class="topbox">
      <div class="bill">
        <span>净资产（元）</span>
        <br>
        <i>{{totalMoney}}</i>
      </div>
      <div class="detail">
        <div>
          资产
          <i>{{totalUp}}</i>
        </div>
        <div>
          负债
          <i>{{totalDown}}</i>
        </div>
      </div>
    </div>
    <div class="bodybox">
      <div
        class="billitem"
        v-for="item in BillList"
        v-bind:key="item.id"
        @click="handerLink(item.id)"
      >
        <div class="pic">
          <img :src="item.icon">
        </div>
        <div class="data">
          <p class="title">{{item.title}}</p>
          <p class="desc">{{item.remark}}</p>
        </div>
        <div class="number" v-bind:class="{red:item.money<0}">{{item.money}}</div>
      </div>
    </div>
    <div class="bottombox">
      <button open-type="getUserInfo" @getuserinfo="successGetUserInfo" v-if="!haslogin">授权</button>

      <div class="btnadd" v-else @click="handerLink(maxid)">添加</div>
    </div>
  </div>
</template>

<script>
const db = wx.cloud.database();
const tb_mybilllist = db.collection("mybilllist");
const tb_logs = db.collection("logs");

export default {
  mixins: [],
  components: {},
  data() {
    return {
      globalData: {},
      BillList: [],
      maxid: 0,
      totalMoney: 0,
      totalUp: 0,
      totalDown: 0,
      userInfo: null,
      haslogin: false
    };
  },
  onReady: function() {
    // Do something when page ready.
    console.log("Page [home] onReady");
  },
  bindgetuserinfo: function() {
    console.log("Page [home] bindgetuserinfo");
  },
  onShow: function() {
    // Do something when page show.
    console.log("Page [home] onShow");
  },
  onHide: function() {
    // Do something when page hide.
    console.log("Page [home] onHide");
  },
  onUnload: function() {
    // Do something when page close.
    console.log("Page [home] onUnload");
  },
  mounted() {
    var appInstance = getApp();
    this.globalData = appInstance.globalData;
   

    wx.getSetting({
      success(res) {
        if (res.authSetting["scope.userInfo"]) {
          wx.getUserInfo({
            success(res) {
              if (!!e.userInfo) {
                this.setUserInfo(res);
              }
            }
          });
        } else {
          console.log("未获取");
        }
      }
    });
  },
  methods: {
    setUserInfo(userInfo) {
      this.userInfo = userInfo;
      this.haslogin = true;
      tb_logs.add({
        data: {
          type: "login",
          data: userInfo,
          date: new Date().valueOf()
        }
      });
      wx.showLoading()
      this.refreshData();
      wx.hideLoading();
    },
    successGetUserInfo(e) {
      if (!!e.detail.userInfo) {
        this.setUserInfo(e.detail.userInfo);
      }
    },
    async refreshData() {
      if(!this.haslogin)
      {
        return;
      }
      let xbillList = await tb_mybilllist.where({}).get();
      let billList = xbillList.data;

      this.BillList = billList;
      this.maxid =
        billList.length == 0
          ? 1
          : billList.sort((a, b) => a.id < b.id)[0]["id"] + 1;
      let totalmoney = 0,
        totalup = 0,
        totaldown = 0;
      billList.map(item => {
        totalmoney += item.money;
        if (item.money > 0) totalup += item.money;
        if (item.money < 0) totaldown += item.money;
      });
      this.totalMoney = totalmoney;
      this.totalUp = totalup;
      this.totalDown = totaldown;
    },
    getAllData() {
      return Megalo.getStorageSync("myallbills") || [];
    },
    handerLink(id) {
      Megalo.navigateTo({
        url: `/pages/detail/index?id=${id}`
      });
    },
    onTouchStart(e) {
      console.log(e);
    },
    handlerClick() {
      wx.showToast({
        title: "成ee功",
        icon: "success",
        duration: 2000
      });
    }
  }
};
</script>

<style lang="less" scoped>
.topbox {
  font-size: 13px;
  padding: 10px;
  background: #32c338;
  i {
    font-size: 17px;
    font-weight: 550;
    font-style: normal;

    display: inline;
  }
  .bill {
    text-align: center;
  }
  .detail {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    div {
      flex-basis: 50%;
      text-align: center;
      vertical-align: middle;
      margin: 10px 0;
    }
    div:first-child {
      border-right: 1px solid #000;
    }
  }
}
.bodybox {
  margin: 10px;

  .billitem {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    padding: 5px;

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
      font-size: 18px;

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
}
.bottombox {
  margin: 20px;
  .btnadd {
    margin: 10px 0;
    background: #32c338;
    opacity: 0.9;
    width: 100%;
    height: 40px;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
    border-radius: 25px;
    color: #fff;
    box-shadow: 2px 2px 5px #32c338;
    text-shadow: 2px 2px 5px #32c338;
  }
}
</style>
