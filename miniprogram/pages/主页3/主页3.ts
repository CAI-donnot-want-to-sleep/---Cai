// pages/主页3/主页3.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    ids:Array<string>(),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    const app = getApp()
    const idstr = app.globalData.user_openid
    console.log(getApp().globalData.user_openid)
    wx.cloud.callFunction(
      {
        name: 'login',
        success: res => {
          const info = (res as any).result.userInfo
          console.log('[云函数] [login] user openid: ', info.openId);
          this.setData
            (
              {
                openid: info.openId,
              }
            )
          app.setOpenId(info.openId)
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      }
    )
    //检测是否登录,如果没有登录就跳转到登录界面，如果登录了就显示用户的openid   
    if (idstr === ''&&this.data.openid===''){
      wx.showToast({
        title: '请先登录',
        success: function () {
          wx.navigateTo({
            url: '/pages/good/good',
          })
        }
      })

    }
    if (idstr !== '' && this.data.openid === '') {
      this.setData({
        openid: idstr
      })
    }

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    //在云数据库里面找cart集合，找里面所有订单号（id）,然后把订单号放到ids数组里面，要求匹配buyer_openid和openid
  
    const db = wx.cloud.database()
    idstrs: Array<string>()
    db.collection('cart').where({
      buyer_openid: this.data.openid
    }).get().then(res => {
      console.log(res.data)
      
      for (let i = 0; i < res.data.length; i++) {
        this.data.ids.push(res.data[i].id)
      }
      console.log(this.data.ids)
      //刷新页面
      this.setData({
        ids: this.data.ids
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    this.setData
      (
        {
          ids: []
        }
      )
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})