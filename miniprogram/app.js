//app.js
var util = require('./utils/util');
App({
  util: util,
  data:{
    openId:''
  },
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
      try {
        var value = wx.getStorageSync('openId')
        if (!value) {
          wx.cloud.callFunction({
            // 云函数名称
            name: 'login',
            // 传给云函数的参数
            success: function (res) {
              console.log(res.result)
              wx.setStorage({
                key: "openId",
                data: res.result.openid
              })
            },
            fail: console.error
          })
        }
      } catch (e) {
        // Do something when catch error
      }
    }

    this.globalData = {
      
    }
  }
})
