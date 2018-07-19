const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
// pages/hot/hot.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
   movieList: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMovieList()
  },
  // 刷新页面
  onPullDownRefresh() {
    this.getMovieList(() => wx.stopPullDownRefresh())
  },

  getMovieList(callback) {
    wx.showLoading({
      title: '电影数据加载中'
    })

    qcloud.request({
      url: config.service.movieList,
      success: result => {
        wx.hideLoading()

        let data = result.data
        if (!data.code) {
          this.setData({
            movieList: data.data
          })
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
      },
      complete: () => {
        wx.hideLoading();//loading 逻辑
        callback && callback()
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