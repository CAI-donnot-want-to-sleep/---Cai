// pages/good/good.ts
Page
  (
    {

      /**
       * 页面的初始数据
       */
      data:
      {
        ids: Array<string>(),
        openid: '',
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
      TapToLogin() {
        //用户登录微信账号，从微信中获取openid，并传入到云数据库中的customers集合中
        wx.cloud.callFunction
          ({
            name: 'login',
            //这里的报错千万不要动！！！！！！！！！！！！！！！
            success: res => {
              const info = (res as any).result.userInfo
              console.log('[云函数] [login] user openid: ', info.openId);//这里的报错千万不要动！！！！！！！！！！！！！！！
              this.setData
                (
                  {
                    openid: info.openId,//这里的报错千万不要动！！！！！！！！！！！！！！！
                  }
                )
              //传递到全局参数中
              getApp().globalData.user_openid = info.openId;//这里的报错千万不要动！！！！！！！！！！！！！！！
              console.log('全局参数user_openid:' + getApp().globalData.user_openid);
            },
            fail: err => {
              console.error('[云函数] [login] 调用失败', err)
            }
          })
        //获取openid后，将openid传入到云数据库中的customers集合中
        const db = wx.cloud.database()
        //检测是否已经存在该用户
        db.collection('customers').where
          ({
            _openid: this.data.openid
          })
          .get
          ({
            success: res => {
              //如果不存在该用户，则添加该用户
              if (res.data.length == 0) {
                db.collection('customers').add({
                  data:
                  {
                    openid: this.data.openid,
                    nickname: '隐秘的人',
                    age: 20,
                    phone: '12345678901',
                    address: 'test',
                    email: 'test',
                    major: 'test',
                    headsid:'',
                    headspath:'/icons/头像5.svg'
                  },
                  success: res => {
                    // 在返回结果中会包含新创建的记录的所有情况
                    this.setData
                      ({
                        openid: res._id,
                      });
                    
                    wx.showToast
                      ({
                        title: '新增登录用户成功',
                      });
                      wx.navigateBack()
                  },
                  fail: err => {
                    wx.showToast
                      ({
                        icon: 'none',
                        title: '新增记录失败'
                      })
                    console.error('[数据库] [新增记录] 失败：', err)
                  }
                })
              }
              //如果存在该用户，则不添加
              else {
                wx.navigateBack()
                wx.showToast
                  (
                    {
                      title: '该用户已经存在',
                    }
                  )
              }
              //将this.data.openid传入到全局参数中
              getApp().globalData.user_openid = this.data.openid;
            },
            fail: err => {
              wx.showToast
                ({
                  icon: 'none',
                  title: '查询记录失败'
                })
              console.error('[数据库] [查询记录] 失败：', err)
            }
          })
      }
    })