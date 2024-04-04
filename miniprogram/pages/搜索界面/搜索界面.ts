// pages/搜索界面/搜索界面.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num:'',
    names:Array<string>(),
    ids:Array<string>(),
    openid:''
  },
  handleinput(e:any)
  {
    // console.log(e.detail.value);
    this.setData({
      num:e.detail.value
    });
    console.log('输入内容：', this.data.num);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  
  handleKeyDown: function(event:any) {
    if (event.keyCode === 13) { // 按下的是回车键
     this.bindTap();
    }
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

  },
  bindInput(e:any) {
    
    // 在这里可以进行搜索操作或其他对输入内容的处理
    this.handleinput(e);
    
  },
  bindTap()
  {
    //在微信云数据库里搜索关键内容，并且将搜索的内容放在搜索结果界面里面
    // wx.cloud.init;
    const db = wx.cloud.database();
    const regex = new RegExp( this.data.num, "i"); 
    // 用num查询books集合里所有的name的id数组
    db.collection('books').where(
      {
      bookname:regex
    }
    ).field(
      {
      bookname:true
    }
    ).get(
      {
      success: res => {
        //展示到搜索结果界面的页面里面
        // res.data 是包含以上定义的两条记录的数组
        console.log('搜索内容1：', res.data);
        for(let i=0;i<res.data.length;i++)
        {
          this.data.names.push(res.data[i].bookname);
          this.data.ids.push(res.data[i]._id);
        }
        
        console.log('搜索内容2：', this.data.names);
        console.log('搜索内容2：', this.data.ids);
        wx.navigateTo(
          {
          url: '/pages/搜索结果界面/搜索结果界面?ids=' + JSON.stringify(this.data.ids) + '&names=' + JSON.stringify(this.data.names),
        }
        ).then(res => {
          console.log(res);
          this.data.names = [];
          this.data.ids=[];
        })
        ;
      }
      ,fail: err => {
        // 处理异常情况
        console.error(err);
      }
    })

    
  }
})