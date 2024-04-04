// pages/出书页/出书页.ts
Page({

  /**
   * 页面的初始数据
   */
  data: 
  {
    openid: '',
    imageUrl:'',
    name: '',
    id: '',
    viid: '',
    photoid:'',
    price: 0,
    description: '',
    owner_openid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() 
  {

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
  onShow() {

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
  inputPrice(e:any)
  {
    //console.log(e.detail.value)
    this.setData({
      price: e.detail.value
    })
  },
  inputDescription(e:any)
  {
    //console.log(e.detail.value)
    this.setData({
      description: e.detail.value
    })
  },
  chooseImage()
  {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: (res:any) => {
        this.setData({
          imageUrl: res.tempFilePaths[0]
        })
      },
    })
  }
  ,
  inputName(e:any)
  {
    //console.log(e.detail.value)
    this.setData({
      name: e.detail.value
    })
  },
  submitForm()
  {
    const app = getApp()
    const db = wx.cloud.database()
    const _ = db.command
    const photoid = Math.floor(Math.random() * 1000000)
    const viid = Math.floor(Math.random() * 1000000)
    const photoidstr = photoid.toString()
    const viidstr = viid.toString()
    const id = this.data.openid + photoidstr
    const price = this.data.price
    const description = this.data.description
    const owner_openid = this.data.openid
    const name = this.data.name
    const imageUrl = this.data.imageUrl
    if (name === '' || price === 0 || description === '' || imageUrl === '') {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '上传中',
    })
    wx.cloud.uploadFile({
      cloudPath: 'books/' + id + '.jpg',
      filePath: imageUrl,
      success: res => {
        db.collection('books').add({
          data: {
            _id: id,
            bookname: name,
            price: price,
            description: description,
            owner_openid: this.data.openid,
            photoPath: res.fileID,
            viid: viid,
            number: 1
          },
          success: res => {
            wx.hideLoading()
            wx.showToast({
              title: '上传成功',
            })
            wx.navigateBack()
          },
          fail: err => {
            wx.hideLoading()
            wx.showToast({
              title: '上传失败',
              icon: 'none'
            })
          }
        })
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        })
      }
    })
  }
})