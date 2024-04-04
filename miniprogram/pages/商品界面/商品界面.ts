// pages/商品界面/商品界面.ts
Page({

  /**
   * 页面的初始数据
   */
  data: 
  {
    name:'book',//书名
    price:0,//价格
    photoId:'',//照片文件在云储存中的id
    idstr:'',//数据库里面记录的书籍信息的id
    photoPath:'',//照片在云储存的文件路径
    number:1,//商品数量
    openid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) 
  {
    //接受搜索结果界面中的goods组件传来的数据
    const name=options.name || 'book';
    const price=parseInt(options.price || '0');
    const photoId=options.photoId || '';
    const idstr=options.idstr || '';
    const photoPath=options.photoPath || '';
    const number=parseInt(options.number || '1');
    this.setData
    (
      {
      name:name,
      price:price,
      photoId:photoId,
      idstr:idstr,
      photoPath:photoPath,
      number:number,
      }
    )
    console.log("商品界面的name："+this.data.name);
    console.log("商品界面的price："+this.data.price);
    console.log("商品界面的photoId："+this.data.photoId);
    console.log("商品界面的idstr："+this.data.idstr);
    console.log("商品界面的photoPath："+this.data.photoPath);
    console.log("商品界面的number："+this.data.number);
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
    if (idstr !== '' && this.data.openid === '') {
      this.setData({
        openid: idstr
      })
    }
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow() 
  {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() 
  {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() 
  {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() 
  {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() 
  {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() 
  {

  },
  back:function()
  {
    wx.navigateBack({
      delta: 1,  // 返回的页面层数，默认为1
      success: function(res) {
        console.log(res);
      },
      fail: function() {
        // 返回失败的处理逻辑
      }
    });
  }
}
)