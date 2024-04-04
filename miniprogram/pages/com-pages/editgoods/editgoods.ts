// pages/com-pages/editgoods/editgoods.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:"",
    mname:'',
    mprice:0,
    mphotoId:'',
    midstr:'',
    mphotoPath:'',
    mnumber :0
  },
  _getEverything: function () {
    const db = wx.cloud.database();//打开云数据库
    let photoId: string = '';//定义一个外部变量photoId用于接受数据库中的书籍信息的photoId
    let name: string = '';//定义一个外部变量name用于接受数据库中的书籍信息的name
    let price: number = 0;//定义一个外部变量price用于接受数据库中的书籍信息的price
    let iD: string = '';//定义一个外部变量iD用于接受数据库中的书籍信息的id
    let number: number = 0;//定义一个外部变量number用于接受数据库中的书籍信息的number
    db.collection('books').where(
      {
        _id: this.data.midstr,//通过书籍的id来查找
      }
    ).get(
      {
        success: res =>//成功找到之后，返回res书籍所有信息
        {
          photoId = res.data[0].booksphotoID;//photoId记录返回结果的书籍的photoId
          name = res.data[0].bookname;
          price = res.data[0].price;//price记录返回结果的书籍的price
          iD = res.data[0]._id;//iD记录返回结果的书籍的id
          number = res.data[0].number;//number记录返回结果的书籍的number
          this.setData
            (
              {
                mphotoId: photoId,
                mname: name,
                mprice: price,
                midstr: iD,
                mnumber: number
              }
            )
          //通过云存储的id获取图片
          wx.cloud.downloadFile(
            {
              fileID: this.data.mphotoId,//文件的id
              success: res => {
                //返回临时文件路径
                this.setData
                  (
                    {
                      mphotoPath: res.tempFilePath
                    }
                  )
              }
            }
          )
      }
    }
    )
    ;


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      midstr:options.midstr,
      mname:options.mname,
      
    })
    this._getEverything()
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

  }
  ,
  editname(e:any){
    //通过云开发改变数据库的books的bookname字段
    const db = wx.cloud.database()
    db.collection('books').doc(this.data.midstr).update({
      data:{
        bookname:e.detail.value
      },
      success:res=>{
        console.log("修改成功")
      }
    })
    this.setData({
      mname:e.detail.value
    })
  },
  editprice(e:any){
    //通过云开发改变数据库的books的price字段
    const db = wx.cloud.database()
    db.collection('books').doc(this.data.midstr).update({
      data:{
        price:e.detail.value
      },
      success:res=>{
        console.log("修改成功")
      }
    })
    this.setData({
      mprice:e.detail.value
    })
  }
  ,
  editnumber(e:any){
    //通过云开发改变数据库的books的number字段
    const db = wx.cloud.database()
    db.collection('books').doc(this.data.midstr).update({
      data:{
        number:e.detail.value
      },
      success:res=>{
        console.log("修改成功")
      }
    })
    this.setData({
      mnumber:e.detail.value
    })
  }
  ,
  //上传照片到云存储的书籍照片文件夹里，并且删除原来的照片文件，重新获取到现在新上传的文件id以及文件路径，改变数据库中的books集合的booksphotoID字段，同时修改本地的mphotoId和mphotoPath

  upphoto(){
    wx.chooseImage({
      count:1,
      success:res=>{
        const tempFilePaths = res.tempFilePaths
        wx.cloud.uploadFile({
          cloudPath: 'booksphoto/'+this.data.midstr+'.png',
          filePath: tempFilePaths[0],
          success:res=>{
            console.log("上传成功")
            console.log(res.fileID)
            this.setData({
              mphotoId:res.fileID
            })
            wx.cloud.deleteFile({
              fileList: [this.data.mphotoId],
              success:res=>{
                console.log("删除成功")
              }
            })
            wx.cloud.downloadFile(
              {
                fileID: this.data.mphotoId,//文件的id
                success: res => {
                  //返回临时文件路径
                  this.setData
                    (
                      {
                        mphotoPath: res.tempFilePath
                      }
                    )
              }
            }
            )
            const db = wx.cloud.database()
            db.collection('books').doc(this.data.midstr).update
            (
              {
                data:
                {
                  booksphotoID:this.data.mphotoId
                }
              }
            )
            } 
        })
      } 
  })
  }

})