const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
const app = getApp()
// pages/reviewDetail/reviewDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reviewDetail: {},
    movieDetail:{},
    reviewId:"",
    movieId: "",
    userInfo: null,
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
        fail: ()=> {
        }
      })

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getReviewDetail(options.reviewId)
    this.getMovieDetail(options.movieId)
  },

  getReviewDetail(reviewId) {
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

          for (let i = 0; i < reviews.length; i++) {
            if (reviews[i].id == reviewId) {
              this.setData({
                reviewDetail: reviews[i],
                reviewId: reviewId
              })
              break
            }
          }
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
      }
    })
  },


  getMovieDetail(movieId) {
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
            if (movieList[i].id == movieId) {
              this.setData({
                movieDetail: movieList[i],
                movieId: movieId
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
  
  }
})