// pages/主页1/主页1.ts

Page({
  handleIconTap: function () {
    wx.navigateTo({
      url: '/pages/搜索界面/搜索界面'
    })
  },
  handleIconTapputbook: function () {
    wx.navigateTo
      ({
        url: '/pages/出书页/出书页'
      })
  },
  handleIconTapinbook: function () {
    wx.navigateTo
      ({
        url: '/pages/跑腿页/跑腿页'
      })
  },
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
    if (idstr === ''&&this.data.openid==='') {
      wx.showToast({
        title: '请先登录',
        success: function () {
          wx.navigateTo({
            url: '/pages/good/good',
          })
        }
      })
    }
    if (idstr !== ''&&this.data.openid==='') {
      this.setData({
        openid: idstr
      })
    }
  },
  _showSomeGoodsCom()
  {
    //随机从数据库books中取出两个书籍_id并且存入数组ids中
    const db = wx.cloud.database()
db.collection('books').get().then(res => {
  console.log(res.data)
  // 对获取到的数据进行操作
  const samples = res.data.slice(0, 2)
  console.log(samples)
  // 将获取到的数据存入ids中
  const idstrs = samples.map(item => item._id)
  console.log(idstrs)
  // 将ids中的书籍_id传入this.data.ids中
  this.setData({
    ids: idstrs//别修改
  })
  console.log(this.data.ids)
}).catch(err => {
  console.error(err)
})
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this._showSomeGoodsCom()
  const component = this.selectComponent('#goods');
  component._show();
  
  },
  
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

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