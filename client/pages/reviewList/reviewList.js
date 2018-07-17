const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
const app = getApp()
// pages/reviewList/reviewList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reviewList:[],
    userInfo :null,
    movieId: "",
    optionsMovieId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      optionsMovieId: options.movieId
    })
    this.getReviewList(options.movieId)
  },

  // 刷新页面
  onPullDownRefresh() {
    let optionsMovieId = this.data.optionsMovieId
    this.getReviewList(optionsMovieId ,() => wx.stopPullDownRefresh())
  },

  getReviewList(movieId, callback) {
    wx.showLoading({
      title: '影评数据加载中'
    })

    qcloud.request({
      url: config.service.reviewList,
      success: result => {
        wx.hideLoading()

        let data = result.data
        if (!data.code) {
          let reviews = data.data
          let reviewList = []

          for(let i = 0; i < reviews.length; i++){
            if (reviews[i].movie_id == movieId){
              reviewList.push(reviews[i])
            }
          }
          this.setData({
            reviewList: reviewList,
            movieId: movieId
          })
        } else {
          wx.showToast({
            title: '影评数据加载失败',
            icon: 'none'
          })
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({
          title: '影评数据加载失败',
          icon: 'none'
        })
      },
      complete: () => {
        wx.hideLoading();//loading 逻辑
        callback && callback()
      }
    })
  },

  onTapAddReview(e) {
    let userInfo = this.data.userInfo
    let movieId = this.data.movieId
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/user/user',
      })
    } else {
      wx.showActionSheet({
        itemList: ['文字', '音频'],
        success: function (res) {
          wx.navigateTo({
            url: '/pages/editReview/editReview?tapIndex=' + res.tapIndex + '&&movieId=' + movieId,
          })
        },
        fail:  () => {}
      })

    }
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})