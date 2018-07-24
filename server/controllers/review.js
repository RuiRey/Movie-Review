const DB = require('../utils/db.js')

module.exports = {
  add: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    //let username = ctx.state.$wxInfo.userinfo.nickName
    let avatar = ctx.state.$wxInfo.userinfo.avatarUrl

    let movie_id = +ctx.request.body.movie_id
    let content = ctx.request.body.content || null
    let audio = ctx.request.body.audio || null
    let username = ctx.request.body.username
    let duration = ctx.request.body.duration || null

    await DB.query('INSERT INTO review(user, username, avatar, content, audio, duration, movie_id) VALUES (?, ?, ?, ?, ?, ?, ?)', [user, username, avatar, content, audio, duration, movie_id])

    ctx.state.data = {}
  },
  reviewList: async ctx => {
    ctx.state.data = await DB.query("SELECT * FROM review;")
  },
}