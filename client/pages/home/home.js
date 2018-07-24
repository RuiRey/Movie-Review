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
    this.getHotMovie()
    this.getRandomReview()
  },

  // 刷新页面
  onPullDownRefresh() {
    this.getRandomReview(() => wx.stopPullDownRefresh())
  },

  // 随机获取热门电影的影评
  getRandomReview(callback) {
    qcloud.request({
      url: config.service.reviewList,
      success: result => {
        let data = result.data
        if (!data.code) {
          let reviews = data.data
          let reviewList = []
          for (let i = 0; i < reviews.length; i++) {
            if (reviews[i].movie_id == 1) {
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
      },
      complete: () => {
        callback && callback()
      }
    })
  },

  // 获取热门电影
  getHotMovie(){
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
})