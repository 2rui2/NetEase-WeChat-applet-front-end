// pages/singerDetail/singerDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
singerdata:{},
singerDetail:{},
HotMusicList:{}
  },
getsingersData:function(){
//获取事件对象
const eventChannel=this.getOpenerEventChannel()
//添加事件监听器
eventChannel.on('singersDetail',(data)=>{
  // console.log(data)
  this.setData({singerdata:data})
})
},
//获取歌手信息
getsingerDetail:function(){
  //获取歌手ID
 const id=this.data.singerdata.data.id
 //获取歌手简介
wx.request({
  url: 'http://localhost:3000/artist/detail?id='+id,
  dataType:"json",
  success:(result)=>{
    // console.log(result)
this.setData({singerDetail:result})
  }
})
},
//获取热门歌曲
getsings:function(){
//获取歌手ID
const id=this.data.singerdata.data.id
//获取歌曲
wx.request({
  url: 'http://localhost:3000/artist/top/song?id='+id,
  dataType:"json",
  success:(result)=>{
console.log(result)
console.log(result.data.songs[0].al.name)
this.setData({HotMusicList:result})
  }
})
},
playlink:function(e){
  // console.log(e)
  //获取当前下标
  const index=e.currentTarget.dataset.index
  //获取歌曲列表
  const musicData=this.data.HotMusicList.data.songs
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
this.getsingersData()
this.getsingerDetail()
this.getsings()
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