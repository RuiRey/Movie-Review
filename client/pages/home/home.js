const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')

// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotMovie:{},
    randomReview: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMovieList()
    
    this.getRandomReview(1)
  },

  getRandomReview(movieId) {
    qcloud.request({
      url: config.service.reviewList,
      success: result => {
        let data = result.data
        if (!data.code) {
          let reviews = data.data
          let reviewList = []
          for (let i = 0; i < reviews.length; i++) {
            if (reviews[i].movie_id == movieId) {
              reviewList.push(reviews[i])
            }
          } 
          let l = reviewList.length
          let randomReview = reviewList[Math.floor(Math.random() * l)]
          this.setData({
            randomReview: randomReview
          })
        } else {
          wx.showToast({
            title: '影评数据加载失败',
            icon: 'none'
          })
        }
      },
      fail: () => {
        wx.showToast({
          title: '影评数据加载失败',
          icon: 'none'
        })
      }
    })
  },

  getMovieList(){
    wx.showLoading({
      title:'电影数据加载中'
    })

    qcloud.request({
      url: config.service.movieList,
      success: result=>{
        wx.hideLoading()

        let data = result.data
        if(!data.code){
          this.setData({
            hotMovie: data.data[0]
          })
        }else{
          wx.showToast({
            title: '电影数据加载失败',
            icon: 'none'
          })
        }

      },
      fail:()=>{
        wx.hideLoading()
        wx.showToast({
          title: '电影数据加载失败',
          icon: 'none'
        })
      }
    })
  },
  onTapMovieDetail(){
    wx.navigateTo({
      url: '/pages/movieDetail/movieDetail?id=' + this.data.hotMovie.id,
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