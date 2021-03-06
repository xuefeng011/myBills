import App from './index'
import Vue from 'vue'

const app = new Vue( App )

app.$mount()

export default {
  config: {
    navigationBarTitleText: '详情',

    // 微信小程序配置
    _wechat: {
      navigationBarBackgroundColor: '#32c338',
      navigationBarTextStyle: 'black'
    },

    // 支付宝小程序配置
    _alipay: {
      navigationBarBackgroundColor: '#4D7AF4',
    },

    // 百度小程序配置
    _swan: {
      navigationBarBackgroundColor: '#38f',
      navigationBarTextStyle: 'white'
    }
  }
}