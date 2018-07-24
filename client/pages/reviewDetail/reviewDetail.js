const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
const app = getApp()

const audioReview = wx.createInnerAudioContext();

// pages/reviewDetail/reviewDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reviewDetail: {},
    reviewList:{},
    movieDetail:{},
    reviewId:"",
    movieId: "",
    userInfo: null,
    isPlay:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getReviewDetail(options.reviewId)
    this.getMovieDetail(options.movieId)
  },

  // 点击添加review
  onTapAddReview(e) {
    let userInfo = this.data.userInfo
    let movieId = this.data.movieId
    if (!userInfo) {// 检查用户是否登陆
      wx.navigateTo({
        url: '/pages/user/user',
      })
    } 

    // 检查用户是否已经评论过该电影
    let reviewed = false
    let reviewList = this.data.reviewList
    let review = {}
    for(let i = 0; i < reviewList.length; i++){
      if (reviewList[i].user == userInfo.openId && reviewList[i].movie_id == movieId){
        review = reviewList[i]
        reviewed = true
        break
      }
    }
    if(reviewed){//评论过 跳转到影评详情页面
      wx.navigateTo({
        url: '/pages/reviewDetail/reviewDetail?reviewId='+review.id+'&&movieId='+review.movie_id,
      })
    }else {// 添加影评
      wx.showActionSheet({
        itemList: ['文字', '音频'],
        success: function (res) {
          wx.navigateTo({
            url: '/pages/editReview/editReview?tapIndex=' + res.tapIndex + '&&movieId=' + movieId,
          })
        }
      })

    }
  },

  // 获取影评详情
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
          this.setData({
            reviewList: reviews
          })
          for (let i = 0; i < reviews.length; i++) {
            if (reviews[i].id == reviewId) {
              this.setData({
                reviewDetail: reviews[i],
                reviewId: reviewId
              })
              audioReview.src = reviews[i].audio
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

  //获取电影详情
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

  // 收藏review
  onTapCollectReview(event) {
    let review_id = this.data.reviewId

    qcloud.request({
      url: config.service.collectReview,
      login: true,
      method: 'PUT',
      data: {
        review_id: review_id
      },
      success: result => {
        let data = result.data

        if (!data.code) {
          wx.showToast({
            icon: 'success',
            title: '影评收藏成功'
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '影评收藏失败！！！'
          })
        }
      },
      fail: (res) => {
        wx.hideLoading()
        console.log(res)
        wx.showToast({
          icon: 'none',
          title: '影评收藏失败'
        })
      }
    })
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

  //播放review
  play: function () {

    audioReview.play();
    console.log('start')
    this.setData({ isPlay: true });
    console.log(this.data.isPlay)
  },
  // 停止
  stop: function () {
    audioReview.stop();
    console.log('stop')
    this.setData({ isPlay: false });
    console.log(this.data.isPlay)
  }
})