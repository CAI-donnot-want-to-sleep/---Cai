// pages/搜索结果界面/搜索结果界面.ts
let isReadyExecuted = false;
Page
(
  {
  data: 
  {
    names:Array<string>(),
    ids:Array<string>(),
    viids:Array<string>(),
    imageurls:Array<string>(),
    prices:Array<string>(),
    openids:Array<string>(),
    searchResults: [],
    num:'',
    isRefreshing: false, // 是否正在刷新
    openid:''
  },
  bindInput(e:any) 
  {
    const value = e.detail.value;
    // 在这里可以进行搜索操作或其他对输入内容的处理
    //搜索输入的内容
    this.setData({
      num:value
    })
    
  },
  /**
   * 页面的初始数据
   */
  
  bindTap()
  {
    //在微信云数据库里搜索关键内容，并且将搜索的内容放在搜索结果界面里面
    // wx.cloud.init;
    const db = wx.cloud.database();
    const regex = new RegExp(this.data.num, "i"); 
    // 用num查询books集合里所有的name的id数组
    db.collection('books').where({
      bookname:regex
    }).get({
      success: res => {
        //展示到搜索结果界面的页面里面
        // res.data 是包含以上定义的两条记录的数组
        console.log('搜索内容1：', res.data);
        for(let i=0;i<res.data.length;i++)
        {
          this.data.names.push(res.data[i].bookname);
          this.data.ids.push(res.data[i]._id);
          this.data.imageurls.push(res.data[i].imageurl);
          this.data.prices.push(res.data[i].price);
          this.data.openids.push(res.data[i]._openid);
        }
        console.log('搜索内容2：', this.data.names);
        console.log('搜索内容2：', this.data.ids);
        console.log('搜索内容2：', this.data.imageurls);
        console.log('搜索内容2：', this.data.prices); 
        
      },fail: err => {
        // 处理异常情况
        console.error(err);
      }
    })

    
  },
  /**
   * 生命周期函数--监听页面加载
   * 从传递过来的参数数组中获取书籍的names和ids
   */
  onLoad(options) 
  {
    const names= JSON.parse(options.names||"[]");
    const ids= JSON.parse(options.ids||"[]");
    this.setData({
      names:names,
      ids:ids,
    })
    console.log(this.data.names);
    console.log(this.data.ids);
    const component = this.selectComponent('#mygoods');
    component._show();
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
  onShow()
  {
    const component = this.selectComponent('#mygoods');
    component._show();
  },
  //监听页面返回刷新
  onNavigateBack() {
    
    
  }
    // 执行相应的操作
  ,
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
    console.log('页面返回')
    this.setData({
      names:[],
      ids:[],
      photoids:[],
      prices:[]
    })
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
  onReachBottom() 
  {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage()
   {

  },
  //搜索功能，根据用户输入的关键字，从云数据库中搜索相关的数据，并传递到searchResults中
  searchdatas: function (key: any) 
  {
    var that = this;
    const db = wx.cloud.database();
    db.collection('books').where({
      bookname: db.RegExp({
        regexp: key,
        options: 'i',
      })
    }).limit(10).get({
      success: function (res) {
        
        console.log(res.data)
        that.setData({
          searchResults: res.data
        })
      }
    })
  }
})