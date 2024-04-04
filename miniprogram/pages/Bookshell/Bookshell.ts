// pages/Bookshell/Bookshell.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: 'name',
    address: 'none',
    phone: 'none',
    email: 'none',
    major: 'none',
    age: 18,
    flag: 0,
    headspath: '/icons/头像5.svg',
    headsid: '',
    openid: '',
    names:Array<string>(),
    ids:Array<string>(),
    photoids:Array<string>(),
    prices:Array<string>(),
    nicknames:'',
    isRefreshing: false,
  },
  get_self() {
    //获取用户信息
    if (this.data.flag == 0) {
      const db = wx.cloud.database()
      const _ = db.command
      const app = getApp()
      const idstr = app.globalData.user_openid
      console.log(idstr)
      db.collection('customers').where({
        _openid: idstr
      }).get({
        success: res => {
          console.log(res.data)
          this.setData({
            name: res.data[0].nickname,
            address: res.data[0].address,
            phone: res.data[0].phone,
            email: res.data[0].email,
            major: res.data[0].major,
            age: res.data[0].age,
            headsid: res.data[0].headsid,
            openid: idstr,
            flag: 1
          })
          console.log(this.data)
          //通过headsid获取云储存中的headspath

          wx.cloud.getTempFileURL({
            fileList: [res.data[0].headsid],
            success: res => {
              // get temp file URL
              console.log(res.fileList)
              this.setData({
                headspath: res.fileList[0].tempFileURL
              })
            },
            fail: err => {
              console.error(err)
              this.setData({
                headspath: "/icons/头像5.svg"
              })
            }
          })

        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   * 监听页面加载，获取页面跳转传过来的参数ids photoids prices names数组
   */
  onLoad(options) {
    const names= JSON.parse(options.names||"[]");
    const ids= JSON.parse(options.ids||"[]");
    const photoids= JSON.parse(options.photoids||"[]");
    const prices= JSON.parse(options.prices||"[]");
    this.setData({
      names:names,
      ids:ids,
      photoids:photoids,
      prices:prices,
    })
    console.log(this.data.names);
    console.log(this.data.ids);
    console.log(this.data.photoids);
    console.log(this.data.prices);
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
    //监测onready是否
    console.log(this.data.names)
    console.log(this.data.ids)
    console.log(this.data.photoids)
    console.log(this.data.prices)
    this.get_self()
    
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
    if (this.data.isRefreshing) return;
    this.setData({
      isRefreshing: true,
    });
    // 下拉刷新逻辑
    // 更新数据等操作
    setTimeout(() => {
      this.setData({
        isRefreshing: false,
      });
      wx.stopPullDownRefresh(); // 停止下拉刷新动画
    }, 1000);
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
  FindBooks()
  {
    //通过openid在云数据库books集合查找用户的所有书籍信息
    const db = wx.cloud.database()
    db.collection('books').where({
      shopid: this.data.openid
    }).get({
      success: res => {
        console.log(res.data)
        console.log(this.data.openid)
        for(let i=0;i<res.data.length;i++)
        {
          this.data.names.push(res.data[i].bookname)
          this.data.ids.push(res.data[i]._id)
          this.data.photoids.push(res.data[i].booksphotoID)
          this.data.prices.push(res.data[i].price)
        }
        console.log(this.data.names)
        console.log(this.data.ids)
        console.log(this.data.photoids)
        console.log(this.data.prices)
        
        
      }
    })
  }
})