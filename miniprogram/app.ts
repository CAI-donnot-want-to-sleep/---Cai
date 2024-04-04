// app.ts
App({
  globalData:
   {
     user_openid:"oV8LV5SYlFhH5ew1aIhoFCbw3o8o",
   },
   
  showOpenId()
  {
    console.log(this.globalData.user_openid)
    return this.globalData.user_openid;
  },
  setOpenId(openid:any)
  {
    this.globalData.user_openid = openid;
  },
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.cloud.init(
    {
      env:'cj-environment-9g92txoze7ed18e0',
      traceUser:true,
    }
    )
  },
})
// app.js
