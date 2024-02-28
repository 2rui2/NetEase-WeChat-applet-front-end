// pages/play/play.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //歌曲列表
    musicList:[],
    //当前歌曲下标
    newIndex:0,
    //当前音乐id
    musicid:"",
//当前音乐
    music:{},
    //控制播放方法
    action:{
      "method":"play"
    },
    //歌词
    lrclist:[],
    //歌词当前下标
    index:-1,
    //滚动条设置
    top:0,
    //音乐模式
    mode:"loop",
    //音乐总时长
    endtime:0,
    //当前音乐时长
    playtime:0,
    //总时长
    sumtime:"03:30",
    //当前时间
    nowtime:"00:00",
  },
    //切换模式的方法
    cutMode:function(){
      if(this.data.mode=="loop"){
        this.setData({
          mode:'single'
        })
      }
      else{
        this.setData({
          mode:'loop'
        })
      }
},
//上一首歌曲执行方法
lastSong:function(){
  //判断musicList是否超出边界
  var newIndex=this.data.newIndex
  var musicList=this.data.musicList
  if(newIndex==0){
    this.setData({
      musicid:musicList[musicList.length-1].id,
      newIndex:musicList.length-1
    })
   }else{
     //上一首歌曲
     console.log(musicList[newIndex-1].id)
    this.setData({
   musicid:musicList[newIndex-1].id,
   newIndex:newIndex-1
    })
   }
    //调用获取歌曲详情的函数
  this.getMusicDetail()
  //调用获取歌词的函数
  this.getMusicData()
   this.setData({
    action:{
      method:"play"
    }
   })
  },
//下一首歌曲执行方法
nextSong:function(){
  
//判断musicList是否超出边界
var newIndex=this.data.newIndex
var musicList=this.data.musicList
if(newIndex==musicList.length-1){
  this.setData({
    musicid:musicList[0].id,
    newIndex:0
  })
 }else{
   //下一首歌曲
  //  console.log(musicList[newIndex+1].id)
  this.setData({
 musicid:musicList[newIndex+1].id,
 newIndex:newIndex+1
  })
 }
  //调用获取歌曲详情的函数
this.getMusicDetail()
//调用获取歌词的函数
this.getMusicData()
 this.setData({
  action:{
    method:"play"
  }
 })
},
  //切换模式的方法
  cutMode:function(){
    if(this.data.mode=="loop"){
      this.setData({
        mode:'single'
      })
    }
    else{
      this.setData({
        mode:'loop'
      })
    }
  }
  ,
  //当歌曲播放完毕执行方法
  changMusic:function(){
if(this.data.mode=="loop"){
//循环歌曲
this.nextSong()
}else{
  //单曲循环歌曲
  this.setData({
    musicid:this.data.musicid,
    action:{
      method:"play"
    }

  }) 
  //调用获取歌曲详情的函数
this.getMusicDetail()
//调用获取歌词的函数
this.getMusicData()
  }
},
//接收objdata
getPlayMusic:function(){
//获取事件对象
const eventChannel=this.getOpenerEventChannel()
//添加事件监听器
eventChannel.on('playMusic',(data)=>{
  // console.log(data)
  //获取音乐列表
  const musicList=data.data.musicList
  //获取当前下标
  const newIndex=data.data.newIndex
  //获取当前音乐
  const music=musicList[newIndex]
  // console.log(music)
  this.setData({musicList:musicList,newIndex:newIndex,musicid:music.id})
})
},
//获取歌曲详情
getMusicDetail:function(){
wx.request({
  url: 'http://localhost:3000/song/detail?ids='+this.data.musicid,
  dataType:"json",
success:(result)=>{
  // console.log(result.data.songs[0])
  this.setData({music:result.data.songs[0]})
}
})
},
//控制音乐播放
musicplay:function(){
  if(this.data.action.method==="play"){
    this.setData({action:{
      "method":"pause"
    }})
  }else{
    this.setData({action:{
      "method":"play"
    }})
  }
},
//获取歌词
getMusicData:function(){
wx.request({
  url: 'http://localhost:3000/lyric?id='+this.data.musicid,
  dataType:"json",
  success:(result)=>{
//     console.log(result)
// console.log(result.data.lrc.lyric)
const lyric=result.data.lrc.lyric

//调用歌词简化的函数
this.setMusicData(lyric)
  }
})
},
// 简化歌词
// setMusicData:function(lyr){
//   //定义空列表
//   let lrclist=[]
//   //拆成段落
// const lyriclist=lyr.split("\n")
// console.log(lyriclist)
// //分离出歌词和时间
// //正则表达式[00:36.846]
// const re=/\[\d{2}:\d{2}.\d{2,3}\]/
// lyriclist.forEach(item =>{
//  console.log(item)
// var date=item.match(re)
// if(date!=null){
//   //提取歌词
//   const lrcstr=item.replace(re,"") 
//      //获取时间
//      let itemdata=date[0]
//      if(itemdata!=null){
//        //去除中括号
//     itemdata= itemdata.slice(1,-1)
//      //换算时间
//   const timelist=itemdata.split(":")
//   const time0=timelist[0]
//   const time1=timelist[1]
//   //整理最终时间
//   const time=parseFloat(time0)*60+parseFloat(time1)
//   lrclist.push([time,lrcstr])
//      }
// }else{
//   lrclist.push([this.data.endtime,""])
// }
// })
// this.setData({lrclist:lrclist})
// },
setMusicData:function(lyr){
  //定义空列表
  let lrclist=[]
  //拆成段落
const lyriclist=lyr.split("\n")
// console.log(lyriclist)
//分离出歌词和时间
//正则表达式[00:36.846]
const re=/\[\d{2}:\d{2}.\d{2,3}\]/
lyriclist.forEach(item =>{
//  console.log(item)
  if(item){
     //获取时间
  let itemdata=item.match(re)[0]
   //提取歌词
   const lrcstr=item.replace(re,"")
  //判断剔除空时间
 if(itemdata){
    //去除中括号
    itemdata= itemdata.slice(1,-1)
    // console.log(itemdata)
    //换算时间
  const timelist=itemdata.split(":")
  const time0=timelist[0]
  const time1=timelist[1]
  //整理最终时间
  const time=parseFloat(time0)*60+parseFloat(time1)
   lrclist.push([time,lrcstr])
  //  console.log(time)
  }
}
})
// console.log(this.data.endtime)
this.setData({lrclist:lrclist})
},
//歌词跟踪
timeUpdate:function(result){
//  console.log(result.detail.currentTime)
 const lrclist=this.data.lrclist
 const playtime=result.detail.currentTime
 const endtime=result.detail.duration
//  if(this.data.index!=lrclist.length-2){ 
//每句歌词统计
 for(var i=0;i<lrclist.length;i++){
   if(lrclist[i][0]<playtime&&playtime<lrclist[i+1][0]){
    //  console.log(lrclist[i+1][1])
     this.setData({
       index:i
     })
  }}
  if(this.data.index==lrclist.length-2){
    lrclist.push([endtime,""])
  }
//  else{
//    this.setData({
//      index:lrclist.length-1
// })
// lrclist.push([endtime,""])
//  }
 var index=this.data.index
 if(index>5){
  this.setData({
    top:(index-5)*30
  })
  // console.log((index-5)*30)
 }
  //进度条时间的数更新
//总时长进行格式化并存储(sum_m是总时长的分钟，sum_s是总时长的秒钟)
var sum_m=Math.floor(endtime/60)
var sum_s=Math.floor(endtime%60)
//格式化总时长
if(sum_m<10){
  sum_m="0"+sum_m
}
if(sum_s<10){
  sum_s="0"+sum_s
}
// console.log(sumtime)
//当前时间进行格式化并存储(play_m是总时长的分钟，play_s是总时长的秒钟)
var play_m=Math.floor(playtime/60)
var play_s=Math.floor(playtime%60)
//格式化总时长
if(play_m<10){
  play_m="0"+play_m
}
if(play_s<10){
  play_s="0"+play_s
}
// console.log(nowtime)
this.setData({
  nowtime:play_m+":"+play_s,
  sumtime:sum_m+":"+sum_s,
  endtime:endtime,
  playtime:playtime
})
},
sliderchange:function(e){
  console.log(e.detail.value)

  this.setData({
    playtime:e.detail.value,
    action:{
      method:'setCurrentTime',
      data:e.detail.value
    }
  })
  this.setData({
    action:{
      method:'play'
    }
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
//调用接收objdata的函数
  this.getPlayMusic()
//调用获取歌曲详情的函数
this.getMusicDetail()
//调用获取歌词的函数
this.getMusicData()
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