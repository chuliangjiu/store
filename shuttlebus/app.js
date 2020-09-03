//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    //获取屏幕高度
    wx.getSystemInfo({
      complete: (res) => {
        this.globalData.windowHeight=res.windowHeight;
      },
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    windowHeight:0,
    userInfo: null,
    kind:2,//起点和终点的判断标志 0-起点 1-终点 2-初始值
    currentLatitude:0,
    currentLongitude:0,
    hasLogin:false,//是否已登录
    end:{//起点信息
      address:"",
      latitude:'0',
      longitude:'0'
    },
    start:{//终点信息
      address:"",
      latitude:'0',
      longitude:'0'
    }
  }
})