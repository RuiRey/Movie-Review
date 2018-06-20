const DB = require('../utils/db.js')

module.exports = {
  movieList: async ctx => {
    ctx.state.data = await DB.query("SELECT * FROM movies;")
  },
}