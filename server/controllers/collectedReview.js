const DB = require('../utils/db.js')

module.exports = {
  collect: async ctx => {
    let user_id = ctx.state.$wxInfo.userinfo.openId 
    let review_id = +ctx.request.body.review_id
  
    await DB.query('INSERT INTO collectedReview(user_id, review_id) VALUES (?, ?)', [user_id, review_id])

    ctx.state.data = {}
  },


  collectedReviewList: async ctx => {
    ctx.state.data = await DB.query("SELECT * FROM collectedReview;")
  },
}