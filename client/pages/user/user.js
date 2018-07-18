const app = getApp()
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    reviewType: ['发布的影评', '收藏的影评'],
    index: 0,
    movieList: {},
    myReviewList:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMovieList()
  },

  getMovieList() {
    qcloud.request({
      url: config.service.movieList,
      success: result => {
        let data = result.data
        if (!data.code) {
          this.setData({
            movieList: data.data
          })
        } 
      }
    })
  },

  getMyReviewList() {
    wx.showLoading({
      title: '影评数据加载中'
    })

    qcloud.request({
      url: config.service.reviewList,
      success: result => {
        wx.hideLoading()

        let data = result.data
        let userId = this.data.userInfo.openId
        let myReviewList = []
        if (!data.code) {
          let reviews = data.data
          for (let i = 0; i < reviews.length; i++) {
            if (reviews[i].user == userId) {
              myReviewList.push(reviews[i])
            }
          }
          this.setData({
            myReviewList: myReviewList
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
      }
    })
  },




  bindPickerChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
    this.getMyReviewList()
  },

  onTapLogin() {
    app.login({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
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
        this.getMyReviewList()
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