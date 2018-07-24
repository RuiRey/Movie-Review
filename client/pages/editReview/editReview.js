// pages/editReview/editReview.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')

//微信小程序新录音接口，录出来的是mp3
const recorder = wx.getRecorderManager()
const recoderOptions = {
  duration: 60000,
  sampleRate: 16000,
  numberOfChannels: 1,
  encodeBitRate: 96000,
  format: 'mp3',
  frameSize: 50
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieDetail: {},
    reviewValue: '',
    tapIndex: "",

    isSpeaking: false,//是否正在说话
    audioDetail: null

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMovieDetail(options.movieId)
    this.setData({
      tapIndex: options.tapIndex
    })

    //onLoad中为录音接口注册两个回调函数，主要是onStop
    recorder.onStart(() => {
      console.log('recorder.onStart()...')
    })
    recorder.onStop((res) => {
      console.log(res)
      this.setData({
        audioDetail: res
      })
      const { tempFilePath } = res
      console.log('recorder.onStop() tempFilePath:' + tempFilePath)
    })
  },

//监听textarea
  onInput(event) {
    let reviewValue = this.data.reviewValue
    this.setData({
      reviewValue: event.detail.value.trim()
    })
  },

//提交影评 ==> 转到影评预览页面
  onTapFinishEdit(){
    let reviewValue = this.data.reviewValue
    let audioDetail = this.data.audioDetail
    let movieDetail = this.data.movieDetail
    if(reviewValue.length <=0 && !audioDetail){
      wx.showToast({
        title: '请输入你的影评内容',
        icon:'none',
      })
    }else{
      try {//利用localStorage传递数据
        wx.setStorageSync('reviewValue', this.data.reviewValue)
        wx.setStorageSync('audioDetail', this.data.audioDetail)
      } catch (e) {
      }  
      wx.navigateTo({
        url: '/pages/previewReview/previewReview?movieId=' + movieDetail.id,
      })
    }
  },

  
//录音
  touchdown: function () {
    console.log("recorder.start with" + recoderOptions)
    //var _this = this;
    //speaking.call(this);
    this.setData({
      isSpeaking: true
    })
    recorder.start(recoderOptions);
  },
  touchup: function () {
    console.log("recorder.stop")
    this.setData({
      isSpeaking: false,
    })
    recorder.stop();
  },

  
  getMovieDetail(id) {
    wx.showLoading({
      title: '电影数据加载中'
    })

    qcloud.request({
      url: config.service.movieList,
      success: result => {
        wx.hideLoading()

        let data = result.data
        if (!data.code) {
          let movieList = data.data
          for (let i = 0; i < movieList.length; i++) {
            if (movieList[i].id == id) {
              this.setData({
                movieDetail: movieList[i]
              })
              break
            }
          }
        } else {
          wx.showToast({
            title: '电影数据加载失败',
            icon: 'none'
          })
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({
          title: '电影数据加载失败',
          icon: 'none'
        })
      }
    })
  },

})