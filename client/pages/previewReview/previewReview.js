const app = getApp()
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
// pages/previewReview/previewReview.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reviewValue: "",
    userInfo: null,
    movieDetail:{},
    audioDetail: null,
    duration: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.getReviewValue()
      this.getAudioReview()
      this.getMovieDetail(options.movieId)

      this.innerAudioContext = wx.createInnerAudioContext()
  },

  // 获取电影详情
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

  // 获取文字review
  getReviewValue(){
    let that = this
    wx.getStorage({
      key: 'reviewValue',
      success: function (res) {
        that.setData({
          reviewValue: res.data,
        })
      }
    })
  },

  //获取音频review
  getAudioReview() {
    let that = this
    wx.getStorage({
      key: 'audioDetail',
      success: function (res) {
        if(res.data){
          let duration = Math.round(res.data.duration/1000)
          that.setData({
            audioDetail: res.data,
            duration: duration
          })
          console.log(that.data.audioDetail)
        }
      }
    })
  },

  // 播放录音
  playRecord: function () {
    var src = this.data.audioDetail.tempFilePath;
  
    this.innerAudioContext.src = src;
    this.innerAudioContext.play()
  },

  
  onTapEdit(){
    wx.navigateBack()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.checkSession({// 获取用户信息
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        })
      }
    })
  },

  //上传影评
  uploadReview(event) {
    let username = this.data.userInfo.nickName
    let content = this.data.reviewValue
    let audioDetail = this.data.audioDetail
    let movie_id = this.data.movieDetail.id
    let duration = this.data.duration
    let audio = null
    
    wx.showLoading({
      title: '正在发表评论'
    })

    if (this.data.audioDetail){// 录音影评上传
      this.uploadAudio(audioUrl =>{
        qcloud.request({
          url: config.service.uploadReview,
          login: true,
          method: 'PUT',
          data: {
            movie_id: movie_id,
            username: username,
            duration: duration,
            audio: audioUrl
          },
          success: result => {
            wx.hideLoading()

            let data = result.data

            if (!data.code) {
              wx.showToast({
                title: '发表评论成功'
              })
              wx.navigateTo({
                url: '/pages/reviewList/reviewList?movieId=' + movie_id,
              })

            } else {
              wx.showToast({
                icon: 'none',
                title: '发表评论失败！！！'
              })
            }
          },
          fail: (res) => {
            wx.hideLoading()
            console.log(res)
            wx.showToast({
              icon: 'none',
              title: '发表评论失败'
            })
          }

        })
      })
    }else{//文字影评上传
      qcloud.request({
      url: config.service.uploadReview,
      login: true,
      method: 'PUT',
      data:{
        content: content,
        movie_id: movie_id,
        username: username,
        duration: duration,
      },
      success: result => {
        wx.hideLoading()

        let data = result.data

        if (!data.code) {
          wx.showToast({
            title: '发表评论成功'
          })
          wx.navigateTo({
            url: '/pages/reviewList/reviewList?movieId=' + movie_id,
          })

        } else {
          wx.showToast({
            icon: 'none',
            title: '发表评论失败！！！'
          })
        }
      },
      fail: (res) => {
        wx.hideLoading()
        console.log(res)
        wx.showToast({
          icon: 'none',
          title: '发表评论失败'
        })
    }
    })
    }
  },

  uploadAudio(cb){
    let that = this
    let filePath = that.data.audioDetail.tempFilePath
    let audioUrl
     
    if(filePath){
      wx.uploadFile({
      url: config.service.uploadAudio,
      filePath: filePath,
      header: {
        'content-type': 'multipart/form-data'
      },
      name: 'file',
      success: res =>{
        let data = JSON.parse(res.data)
        console.log(data.data)
        if(!data.code){
          audioUrl = data.data.imgUrl
          that.setData({
            audio: audioUrl 
          })
          if(cb){
            cb(audioUrl)
          }
        }
      }
      })
    }
  },
})