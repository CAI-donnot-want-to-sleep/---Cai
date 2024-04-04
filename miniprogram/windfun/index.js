const cloud = require('myfirst-server-6gilvis4ef17b0da');

// 初始化云开发环境
cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  
  return {
    openid: wxContext.OPENID
  };
};