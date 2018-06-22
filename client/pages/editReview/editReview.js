// pages/editReview/editReview.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieDetail: {},
    reviewValue: '',
    tapIndex: "",
  },

  onInput(event) {
    let reviewValue = this.data.reviewValue
    this.setData({
      reviewValue: event.detail.value.trim()
    })
  },
  onTapFinishEdit(){
    let reviewValue = this.data.reviewValue
    let movieDetail = this.data.movieDetail
    if(reviewValue.length <=0 ){
      wx.showToast({
        title: '请输入你的影评内容',
        icon:'none',
      })
    }else{
      try {//利用localStorage传递数据
        wx.setStorageSync('reviewValue', this.data.reviewValue)
      } catch (e) {
      }  
      wx.navigateTo({
        url: '/pages/previewReview/previewReview?movieId=' + movieDetail.id,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMovieDetail(options.movieId)
    this.setData({
      tapIndex: options.tapIndex
    })
  },

  getMovieDetail(id) {
    wx.showLoading({
      title: '数据加载中'
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
            title: '数据加载失败',
            icon: 'none'
          })
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({
          title: '数据加载失败',
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