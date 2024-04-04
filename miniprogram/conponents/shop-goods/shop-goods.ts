// conponents/goods.ts
Component
(
  {
  
  /**
   * 组件的属性列表
   */
  properties:
   {
    name://书名
    {
      type:String,
      value:'name',
      observer(newVal,oldVal,changedPath)//监听器，监听name的变化
      {
        console.log("1name:"+newVal);
        this.properties.name=newVal;
        console.log("1name:"+this.properties.name);
      }
    },
    price://价格
    {
      type:Number,
      value:0,
      observer(newVal,oldVal,changedPath)//监听器，监听price的变化  
      {
        console.log("1price:"+newVal);
        this.properties.price=newVal;
        console.log("1price:"+this.properties.price);
      }
    },
    photoId://照片文件在云储存中的id
    {
      type:String,
      value:'',
      observer(newVal,oldVal,changedPath)//监听器，监听photoId的变化
      {
        console.log("1photoId:"+newVal);
        this.properties.photoId=newVal;
        console.log("1photoId:"+this.properties.photoId);
      }
    },
    idstr://数据库里面记录的书籍信息的id
    {
      type:String,
      value:'',
      observer(newVal,oldVal,changedPath)//监听器，监听idstr的变化
      {
        console.log("1id:"+newVal);
        this.properties.idstr=newVal;
        console.log("1id:"+this.properties.idstr);
      }
    },
    //照片在云储存的文件路径
    photoPath:
    {
      type:String,
      value:'',
      observer(newVal,oldVal,changedPath)//监听器，监听photoPath的变化
      {
        console.log("1photoPath:"+newVal);
        this.properties.photoPath=newVal;
        console.log("1photoPath:"+this.properties.photoPath);
      }
    },
    //响应式更新data
    // number:书的余量
    number:
    {
      type:Number,
      value:0,
      observer(newVal,oldVal,changedPath)//监听器，监听number的变化
      {
        console.log("1number:"+newVal);
        this.properties.number=newVal;
        console.log("1number:"+this.properties.number);
      }
    },

  },

  /**
   * 组件的初始数据
   */
  data: 
  {
    mname:'',
    mprice:0,
    mphotoId:'',
    midstr:'',
    mphotoPath:'',
    mnumber:0
  },

  /**
   * 组件的方法列表
   */
  methods: 
  {

    _getEverything:function()
    {
      const db=wx.cloud.database();//打开云数据库
      let photoId:string='';//定义一个外部变量photoId用于接受数据库中的书籍信息的photoId
      let name:string='';//定义一个外部变量name用于接受数据库中的书籍信息的name
      let price:number=0;//定义一个外部变量price用于接受数据库中的书籍信息的price
      let iD:string='';//定义一个外部变量iD用于接受数据库中的书籍信息的id
      let number:number=0;//定义一个外部变量number用于接受数据库中的书籍信息的number
      db.collection('books').where(
        {
          _id:this.properties.idstr,//通过书籍的id来查找
        }
      ).get(
        {
          success:res=>//成功找到之后，返回res书籍所有信息
          {
            photoId=res.data[0].booksphotoID;//photoId记录返回结果的书籍的photoId
            name=res.data[0].bookname;
            price=res.data[0].price;//price记录返回结果的书籍的price
            iD=res.data[0]._id;//iD记录返回结果的书籍的id
            number=res.data[0].number;//number记录返回结果的书籍的number
            this.properties.photoId=photoId;//将photoId传递给属性的photoId
            this.properties.name=name;//将name传递给属性的name
            this.properties.price=price;//将price传递给属性的price
            this.properties.idstr=iD;//将iD传递给属性的id
            this.properties.number=number;//将number传递给属性的number
            console.log("e1phid:"+this.properties.photoId);//测试点1：检测photoId赋值
            console.log("e1name:"+this.properties.name);//测试点1：检测name赋值
            console.log("e1price:"+this.properties.price);//测试点1：检测price赋值
            console.log("e1id:"+this.properties.idstr);//测试点1：检测id赋值
            console.log("e1number:"+this.properties.number);//测试点1：检测number赋值
            this.setData
            (
              {
                mphotoId:photoId,
                mname:name,
                mprice:price,
                midstr:iD,
                mnumber:number
              }
            )
            this.setData(
              {
                mphotoId:photoId
              }

            )
            //通过云存储的id获取图片
            wx.cloud.downloadFile(
            {
          fileID:this.properties.photoId,//文件的id
          success:res=>
          {
            //返回临时文件路径
            this.properties.photoPath=res.tempFilePath;//将临时文件路径传递给属性的photoPath
            console.log("4phpth:"+this.properties.photoPath);
            this.setData
            (
              {
                mphotoPath:res.tempFilePath
              }
            )
          }
            }
      )

          }
        }
      );
      
      
    },
    
    
    bindtapToGoods:function()//点击查看详情后跳转商品页面
    {
      wx.navigateTo(
        {
          url:'/pages/商品界面/商品界面?name='+this.properties.name+'&price='+this.properties.price+'&photoPath='+this.properties.photoPath+'&idstr='+this.properties.idstr+'&photoId='+this.properties.photoId+'&number='+this.properties.number
          //向商品界面传递书籍的名称，价格，图片，id
        }
      )
    },
    bindtapToBuy:function()//点击添加购物车的情况
    {
      // this._getName();//获取商品名
      // this._getBookphoto();//获取商品图片
      // this._getPrice();//获取商品价格
      const db=wx.cloud.database();//打开云数据库
      db.collection('shoppingcart').add(
        {
          data://添加的信息
          {
            bookname:this.properties.name,//书籍的名称
            bookphoto:this.properties.photoId,//书籍的图片
            bookprice:this.properties.price,//书籍的价格
            bookid:this.properties.idstr,//书籍的id
          }
          
        }
      ).then(res=>
      wx.showToast(
        {
          title:'添加成功',
          icon:'success',
          duration:2000
        }))
;
      
    },
    _getName:function()//获取商品名
    {
      const db=wx.cloud.database();//打开云数据库
      let name:string='';//定义一个外部变量name用于接受数据库中的书籍信息的name
      db.collection('books').where(
        {
          _id:this.properties.idstr,//通过书籍的id来查找
        }
      ).get(
        {
          success:res=>//成功找到之后，返回res书籍所有信息
          {
            name=res.data[0].bookname;
            //name记录返回结果的书籍的名称
            console.log(name);//测试点1：检测name赋值
            this.properties.name=name;
            console.log("2name:"+this.properties.name);
            this.setData(
              {
                mname:name
              }
            )
          }
        }
      );
      // this.properties.name=name;//将name传递给属性的name
      // console.log("2"+name);
    },
    _getBookphoto:function()
    {
      const db=wx.cloud.database();//打开云数据库
      let photoId:string='';//定义一个外部变量photoId用于接受数据库中的书籍信息的photoId
      db.collection('books').where(
        {
          _id:this.properties.idstr,//通过书籍的id来查找
        }
      ).get(
        {
          success:res=>//成功找到之后，返回res书籍所有信息
          {
            photoId=res.data[0].booksphotoID;//photoId记录返回结果的书籍的photoId
            this.properties.photoId=photoId;//将photoId传递给属性的photoId
            console.log("3phid:"+this.properties.photoId);
            this.setData(
              {
                mphotoId:photoId
              }

            )
            //通过云存储的id获取图片
            wx.cloud.downloadFile(
            {
          fileID:this.properties.photoId,//文件的id
          success:res=>
          {
            //返回临时文件路径
            this.properties.photoPath=res.tempFilePath;//将临时文件路径传递给属性的photoPath
            console.log("4phpth:"+this.properties.photoPath);
            this.setData
            (
              {
                mphotoPath:res.tempFilePath
              }
            )
          }
            }
      )

          }
        }
      );
      
      
    },

    _getPrice:function()
    {
      const db=wx.cloud.database();//打开云数据库
      let price:number=0;//定义一个外部变量price用于接受数据库中的书籍信息的price
      db.collection('books').where(
        {
          _id:this.properties.idstr,//通过书籍的id来查找
        }
      ).get(
        {
          success:res=>//成功找到之后，返回res书籍所有信息
          {
            price=res.data[0].price;//price记录返回结果的书籍的price
            this.properties.price=price;//将price传递给属性的price
            console.log("5price:"+this.properties.price);
            this.setData
            (
              {
                mprice:price
              }
            )
          }
        }
      );
      
    },
    _getId:function()
    {
      const db=wx.cloud.database();//打开云数据库
      let iD:string='';//定义一个外部变量iD用于接受数据库中的书籍信息的id
      db.collection('books').where(
        {
          _id:this.properties.idstr,//通过书籍的id来查找
        }
      ).get(
        {
          success:res=>//成功找到之后，返回res书籍所有信息
          {
            iD=res.data[0]._id;//iD记录返回结果的书籍的id
            this.properties.idstr=iD;//将iD传递给属性的id
            console.log("6price:"+this.properties.idstr);
            this.setData
            (
              {
                midstr:iD

              }
            )
          }
        }
      );
      
    },
    _getNumber:function()
    {
      const db=wx.cloud.database();//打开云数据库
      let number:number=0;//定义一个外部变量number用于接受数据库中的书籍信息的number
      db.collection('books').where(
        {
          _id:this.properties.idstr,//通过书籍的id来查找
        }
      ).get(
        {
          success:res=>//成功找到之后，返回res书籍所有信息
          {
            number=res.data[0].number;//number记录返回结果的书籍的number
            let fnumber:string=number.toFixed(2);
            let num:number = +fnumber;
            this.properties.number=num;//将number传递给属性的number
            console.log("7price:"+this.properties.number);
            this.setData
            (
              {
                mnumber:num
              }
            )
          }
        }
      );
    },
    
    _show:function()//展示商品信息到组件中去
  {
    // this._getName();//获取商品名
    // this._getBookphoto();//获取商品图片
    // this._getPrice();//获取商品价格
    // this._getId();//获取商品id
    this._getEverything();
    console.log("name:"+this.properties.name);
    console.log("photoPath:"+this.properties.photoPath);
    console.log("price:"+this.properties.price);
    console.log("id:"+this.properties.idstr);
    console.log("photoId:"+this.properties.photoId);
    console.log("mname:"+this.data.mname);
    console.log("mphotoPath:"+this.data.mphotoPath);
    console.log("mprice:"+this.data.mprice);
    console.log("midstr:"+this.data.midstr);
    console.log("mphotoId:"+this.data.mphotoId);
    console.log("name:"+this.properties.name);
    console.log("photoPath:"+this.properties.photoPath);
    console.log("price:"+this.properties.price);
    console.log("id:"+this.properties.idstr);
    console.log("photoId:"+this.properties.photoId);
    console.log("mname:"+this.data.mname);
    console.log("mphotoPath:"+this.data.mphotoPath);
    console.log("mprice:"+this.data.mprice);
    console.log("midstr:"+this.data.midstr);
    console.log("mphotoId:"+this.data.mphotoId);
  }
  ,
  bindtapToEdit:function()
  {
    //跳转到pages/com-pages/editgoods/editgoods
    wx.navigateTo
    (
      {
        url:'/pages/com-pages/editgoods/editgoods?midstr='+this.data.midstr+'&mname='+this.data.mname+'&mprice='+this.data.mprice+'&mphotoId='+this.data.mphotoId+'&mnumber='+this.data.mnumber+'&mphotoPath='+this.data.mphotoPath
      }
    )
  },
  }, 
  
  attached:function()//组件加载完毕后执行
  {
    this._show();//展示商品信息到组件中去
  },
  options:
  {
    multipleSlots:true,
  }
})
