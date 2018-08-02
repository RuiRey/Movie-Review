//需要修改sql语句，实现跨表格查询，整理出myReviewList
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
    reviewList:{},
    myReviewList:[],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMovieList()
    this.getReviewList()
  },

  //获取电影列表
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

  // 获取影评列表
  getReviewList() {
    qcloud.request({
      url: config.service.reviewList,
      success: result => {
        let data = result.data
        if (!data.code) {
          this.setData({
            reviewList: data.data
          })
        }
      }
    })
  },

  //获取我的影评列表
  getMyReviewList() {

    let myReviewList = []
    let userId = this.data.userInfo.openId
    let reviewList = this.data.reviewList
    let index = this.data.index
    
    if(index == 0){
      for (let i = 0; i < reviewList.length; i++) {
        if (reviewList[i].user == userId) {
          myReviewList.push(reviewList[i])
        }
      }
      this.setData({
        myReviewList: myReviewList
      })
    }else if(index == 1){
      qcloud.request({
        url: config.service.collectedReviewList,
        success: result => {
          let data = result.data
          let myCollectedReviewList = []
          if (!data.code) {
            let collectedReview = data.data
            for (let i = 0; i < collectedReview.length; i++) {
              if (collectedReview[i].user_id == userId) {
                myCollectedReviewList.push(collectedReview[i])
              }
            }
            for(let i = 0; i<myCollectedReviewList.length; i++){
              myReviewList.push(reviewList[myCollectedReviewList[i].review_id-1])
            }
            this.setData({
              myReviewList: myReviewList
            })
          }
        }
      })
    }
  },

  //获取我收藏的影评列表
  getMyCollectedReviewList(){
    qcloud.request({
      url: config.service.collectedReviewList,
      success: result => {
        wx.hideLoading()
        let data = result.data
        let userId = this.data.userInfo.openId
        let myCollectedReviewList = []
        if (!data.code) {
          let collectedReview = data.data
          for (let i = 0; i < collectedReview.length; i++) {
            if (collectedReview[i].user == userId) {
              myCollectedReviewList.push(collectedReview[i])
            }
          }
        }
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
  }
})