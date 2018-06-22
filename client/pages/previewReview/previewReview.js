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
    reviewAudio: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.getReviewValue()
      this.getMovieDetail(options.movieId)
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

  onTapEdit(){
    wx.navigateBack()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  //上传影评
  uploadReview(event) {
    let username = this.data.userInfo.nickName
    let content = this.data.reviewValue
    if (!content) return
    let movie_id = this.data.movieDetail.id

    wx.showLoading({
      title: '正在发表评论'
    })

    qcloud.request({
      url: config.service.uploadReview,
      login: true,
      method: 'PUT',
      data:{
        content: content,
        movie_id: movie_id,
        username: username
      },
      success: result => {
        wx.hideLoading()

        let data = result.data

        if (!data.code) {
          wx.showToast({
            title: '发表评论成功'
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)

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
  },

})