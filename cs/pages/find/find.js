// pages/find/find.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
keyword:"",
songs:[],
limit:30
  },
//查询歌曲
searchBind:function(){
  wx.request({
    url: 'http://localhost:3000/cloudsearch?keywords='+this.data.keyword+'&limit='+this.data.limit,
    success:(result)=>{
      console.log(result.data.result.songs)
      this.setData({
        songs:result.data.result.songs
      })
    }
  })
},
//消除文本框的数据
cancalInput:function(){
  this.setData({
    keyword:"",
    songs:[]
  })
}
,
//获取文本框的数据
searchInput:function(e){
// console.log(e.detail.value);
this.setData({
  keyword:e.detail.value
})
  },
  //点击播放音乐
  playlink:function(e){
    // console.log(e.currentTarget.dataset.index)
    //当前音乐下标
    const index=e.currentTarget.dataset.index
    //当前音乐id
    console.log(index)
    let mid=this.data.songs[index].id
    console.log(mid)
        // console.log(this.data.songs[newindex].id)
    wx.request({
      url: 'http://localhost:3000/check/music?id='+mid,
      success:(result)=>{
        console.log(result.data.success)
        if(result.data.success){
          //存储当前歌曲数据
          const objdata={}
          objdata.musicList=this.data.songs
          objdata.newIndex=index
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
    if(this.data.keyword!=""){
      var limit=this.data.limit
    limit+=2
      this.setData({
        limit:limit
      })
      // wx.showLoading({
      //   title: '歌曲加载中'
      // })
     this.searchBind()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})