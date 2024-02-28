// pages/songlist/songlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  background:{},
  singers:{},
  NewMusicList:[]
  },
//获取banner
getbanner:function(){
wx.request({
  url: 'http://localhost:3000/banner',
  dataType: "json",
  success: (result) => {
    // console.log(result.data.banners)
    //设置background
  this.setData({
    background:result.data.banners
  })
  }
})
},
getsinger:function(){
  wx.request({
    url: 'http://localhost:3000/top/artists?offset=0&limit=10',
    dataType: "json",
    success: (result) => {
      // console.log(result.data.artists)
      //设置singers
      this.setData({
        singers:result.data.artists
      })
}
  })
},
//获取新歌
getNewMusic:function(){
 wx.request({
   url: 'http://localhost:3000/personalized/newsong',
   dataType:"json",
   success:(result)=>{
    //  console.log(result.data.result)
     //设置新歌数据
     this.setData({
      NewMusicList:result.data.result
     })
   }
 })
},
hotlink:function(e){
  //获取当前下标
 const index= e.currentTarget.dataset.index
 //拿到当前数据
  const singers=this.data.singers
  wx.navigateTo({
    //跳转地址
    url: '/pages/singerDetail/singerDetail',
    success:(res)=>{
res.eventChannel.emit('singersDetail',{data:singers[index]})
    }
  })
},
playlink:function(e){
  console.log(e)
  //获取当前下标
  const index=e.currentTarget.dataset.index
  //获取歌曲列表
  const musicData=this.data.NewMusicList
//获取歌曲ID
let mid=musicData[index].id
wx.request({
  url: 'http://localhost:3000/check/music?id='+mid,
  dataType:"json",
  success:(result)=>{
    if(result.data.success){
      const objdata={}
      objdata.musicList=musicData
      objdata.newIndex=index
      // console.log("能播放")
      //跳转页面
      wx.navigateTo({
        url: '/pages/play/play',
        success:(result)=>{
          result.eventChannel.emit("playMusic",{data:objdata})
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '歌曲没有版权请选择其他歌曲播放',
        showCancel:true,
      })
    }
  }
})
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //找banner
    this.getbanner()
    //找歌手
    this.getsinger()
    this.getNewMusic()
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
})