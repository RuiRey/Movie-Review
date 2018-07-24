const app = getApp()
// pages/movieDetail/movieDetail.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieDetail:{},
    userInfo: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMovieDetail(options.id)
  },

  //添加影评
  onTapAddReview(e){
    let userInfo = this.data.userInfo
    let movieDetail = this.data.movieDetail
    if(!userInfo){//如果用户没有登陆，跳转到个人中心页面提示用户登陆
      wx.navigateTo({
        url: '/pages/user/user',
      })
    }else{
      wx.showActionSheet({//提供两种影评方式，跳转到编辑影评页面
        itemList: ['文字', '音频'],
        success: function (res) {
          wx.navigateTo({
            url: '/pages/editReview/editReview?tapIndex='+res.tapIndex + '&&movieId=' + movieDetail.id,
          })
        },
        fail: () => { }
      })
      
    }
  },

  //获取电影详情
  getMovieDetail(id){
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
          for (let i = 0; i < movieList.length; i++){
            if(movieList[i].id == id){
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {//监听用户是否登陆
    app.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        })
      }
    })
  }
})